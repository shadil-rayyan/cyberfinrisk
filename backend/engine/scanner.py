import subprocess, json, tempfile, shutil, os
from typing import List, Dict
import git

def clone_repo(repo_url: str, branch: str = "main") -> str:
    tmp = tempfile.mkdtemp()
    git.Repo.clone_from(repo_url, tmp, branch=branch, depth=1)
    return tmp

def run_semgrep(repo_path: str) -> List[Dict]:
    result = subprocess.run(
        ["semgrep", "--config", "p/security-audit",
         "--config", "p/owasp-top-ten", "--json", "--quiet", repo_path],
        capture_output=True, text=True, timeout=300
    )
    try:
        return json.loads(result.stdout).get("results", [])
    except:
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
