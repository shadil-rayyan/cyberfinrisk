import subprocess, json, tempfile, shutil, os, stat
from typing import List, Dict
import git
import re

def _rmtree_windows_safe(path: str) -> None:
    """
    Windows-safe rmtree: git sets read-only attributes on .git/objects/pack/ files.
    shutil.rmtree fails with PermissionError [WinError 5] on these.
    This handler clears the read-only flag and retries deletion.
    """
    def _on_error(func, path, exc_info):
        try:
            os.chmod(path, stat.S_IWRITE)
            func(path)
        except Exception:
            pass  # Best-effort cleanup — don't crash the scan

    try:
        shutil.rmtree(path, onerror=_on_error)
    except Exception as e:
        print(f"[scanner] Warning: could not fully clean up temp dir {path}: {e}")


def sanitize_repo_url(url: str) -> str:
    """
    Clean up common URL corruption before passing to git clone.
    Handles:
    - Markdown link artifacts: https://github.com/foo](https://github.com/foo)
    - Surrounding brackets/parens: [https://github.com/foo]
    - Surrounding quotes
    - Trailing slashes and whitespace
    """
    url = url.strip()
    # Strip markdown link suffix: url](url) → just the first url
    url = re.split(r'\]\(https?://', url)[0]
    # Strip leading [ ( or "
    url = re.sub(r'^[\[\("\']+', '', url)
    # Strip trailing ] ) or "
    url = re.sub(r'[\]\)"\']+$', '', url)
    url = url.strip().rstrip('/')
    return url


def clone_repo(repo_url: str, branch: str = "main") -> str:
    repo_url = sanitize_repo_url(repo_url)
    tmp = tempfile.mkdtemp()

    def _try_clone(b=None):
        """Clone with optional branch. b=None uses the repo's default branch."""
        kwargs = {"depth": 1}
        if b:
            kwargs["branch"] = b
        git.Repo.clone_from(repo_url, tmp, **kwargs)

    branches_to_try = [branch]
    # Add the opposite of what the user specified as a second try
    if branch == "main":
        branches_to_try.append("master")
    elif branch == "master":
        branches_to_try.append("main")
    # Final fallback: let git use the repo's own default branch
    branches_to_try.append(None)

    last_error = None
    for b in branches_to_try:
        try:
            _try_clone(b)
            return tmp  # success
        except git.exc.GitCommandError as e:
            last_error = e
            # Only retry on branch-not-found errors; hard-fail on bad URL etc.
            err_str = str(e).lower()
            if "not found" not in err_str and "exit code(128)" not in err_str:
                break

    _rmtree_windows_safe(tmp)
    tried = [b or "(default)" for b in branches_to_try]
    raise ValueError(
        f"Could not clone '{repo_url}'. "
        f"Tried branches: {', '.join(repr(b) for b in tried)}. "
        f"Check that the URL is correct and the repo is public. "
        f"Details: {last_error}"
    )




def run_semgrep(repo_path: str) -> List[Dict]:
    import time
    t0 = time.time()
    result = subprocess.run(
        [
            "semgrep",
            "--config", "p/owasp-top-ten",  # Focused: 1 ruleset instead of 2 = 2x faster
            "--json",
            "--quiet",
            "--jobs", "4",                  # Parallel workers
            "--max-target-bytes", "500000", # Skip files > 500KB (vendor, minified)
            "--timeout", "10",              # 10s cap per file
            "--timeout-threshold", "3",     # Skip rule after 3 timeouts
            repo_path
        ],
        capture_output=True, text=True, timeout=300
    )
    elapsed = time.time() - t0
    try:
        findings = json.loads(result.stdout).get("results", [])
        print(f"[perf] Semgrep: {len(findings)} findings in {elapsed:.1f}s")
        return findings
    except:
        print(f"[perf] Semgrep: parse failed after {elapsed:.1f}s — stdout: {result.stdout[:200]}")
        return []

def read_code_context(file_path: str, line: int, context_lines: int = 40) -> str:
    """Read lines around a vulnerability for LLM context."""
    try:
        with open(file_path) as f:
            lines = f.readlines()
        start = max(0, line - context_lines)
        end   = min(len(lines), line + context_lines)
        numbered = [f"{i+1}: {l}" for i, l in enumerate(lines[start:end], start=start)]
        return "".join(numbered)
    except:
        return ""

def parse_semgrep_findings(findings: List[Dict], exposure: str, repo_path: str = "") -> List[Dict]:
    parsed = []
    clustered = {}

    for f in findings:
        raw_path = f.get("path", "unknown")
        
        # 13. Convert to repository-relative paths
        file_path = raw_path
        if repo_path and file_path.startswith(repo_path):
            file_path = file_path[len(repo_path):].lstrip("/")
        elif file_path.startswith("/tmp/"):
            # fallback strip if it starts with /tmp/
            parts = file_path.split("/")
            if len(parts) > 3:
                file_path = "/".join(parts[3:])

        # 6 & 7. Ignore non-production code and example credentials
        lower_path = file_path.lower()
        if any(x in lower_path for x in ["test/", "tests/", "example", "docs/", ".env.example", "docker-compose", "scripts/", "mock"]):
            continue

        raw_rule_id = f.get("check_id", "unknown")
        line = f.get("start", {}).get("line", 0)
        message = f.get("extra", {}).get("message", "")
        severity = f.get("extra", {}).get("severity", "WARNING").lower()

        # 1. Clustering by rule + file
        cluster_key = f"{raw_rule_id}::{file_path}"
        
        if cluster_key not in clustered:
            code_ctx = ""
            if repo_path:
                full_path = os.path.join(repo_path, file_path)
                code_ctx = read_code_context(full_path, line)
            
            clustered[cluster_key] = {
                "raw_rule_id": raw_rule_id,
                "file": file_path,
                "lines": [line],
                "message": message,
                "severity": severity,
                "exposure": exposure.upper(),
                "code_context": code_ctx
            }
        else:
            if line not in clustered[cluster_key]["lines"]:
                clustered[cluster_key]["lines"].append(line)

    for i, (k, v) in enumerate(clustered.items()):
        # Convert list of lines to a representative line or aggregate
        lines = sorted(v["lines"])
        v["id"] = f"VULN_{i+1:03d}"
        v["line"] = lines[0]  # Representative line
        if len(lines) > 1:
            line_str = ", ".join(str(l) for l in lines[:3])
            if len(lines) > 3: line_str += f" (+{len(lines)-3} more)"
            v["file"] = f"{v['file']} (lines {line_str})"
        parsed.append(v)

    return parsed


def run_trivy(repo_path: str) -> Dict:
    """Run Trivy on a local directory and return JSON results."""
    trivy_bin = os.path.join(os.path.dirname(__file__), "trivy")
    # Fallback to system path if local doesn't exist
    if not os.path.exists(trivy_bin):
        trivy_bin = "trivy"

    try:
        result = subprocess.run(
            [trivy_bin, "fs", "--format", "json", "--quiet", "--no-progress", repo_path],
            capture_output=True, text=True, timeout=300
        )
        if result.returncode != 0 and not result.stdout:
            return {}
        return json.loads(result.stdout)
    except Exception as e:
        print(f"Trivy scan failed: {e}")
        return {}


def parse_trivy_findings(trivy_data: Dict, exposure: str, repo_path: str = "") -> List[Dict]:
    """Parse Trivy (SCA & Misconfig) into unified vulnerability format."""
    parsed = []
    results = trivy_data.get("Results", [])
    if not results:
        return []

    count = 0
    for res in results:
        target = res.get("Target", "unknown")
        
        # 1. Handle Vulnerabilities (SCA)
        for v in res.get("Vulnerabilities", []):
            count += 1
            parsed.append({
                "id": f"TRV_V_{count:03d}",
                "raw_rule_id": v.get("VulnerabilityID", "unknown"),
                "file": target,
                "line": 1,  # SCA usually doesn't have a line, default 1
                "message": f"Dependency '{v.get('PkgName')}' ({v.get('InstalledVersion')}) has vulnerability: {v.get('Title', v.get('Description', ''))[:150]}",
                "severity": v.get("Severity", "MEDIUM").lower(),
                "exposure": exposure.upper(),
                "code_context": f"Package: {v.get('PkgName')}\nInstalled: {v.get('InstalledVersion')}\nFixed in: {v.get('FixedVersion', 'N/A')}\nPrimary URL: {v.get('PrimaryURL', 'N/A')}"
            })

        # 2. Handle Misconfigurations (IaC)
        for m in res.get("Misconfigurations", []):
            count += 1
            line = m.get("CauseMetadata", {}).get("StartLine", 1)
            
            code_ctx = ""
            if repo_path:
                full_path = os.path.join(repo_path, target)
                code_ctx = read_code_context(full_path, line)

            parsed.append({
                "id": f"TRV_M_{count:03d}",
                "raw_rule_id": m.get("ID", "unknown"),
                "file": target,
                "line": line,
                "message": m.get("Message", ""),
                "severity": m.get("Severity", "MEDIUM").lower(),
                "exposure": exposure.upper(),
                "code_context": code_ctx
            })

    return parsed

