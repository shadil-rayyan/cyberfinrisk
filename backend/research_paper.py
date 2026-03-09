import json
import os
import re
import sys
import shutil
import csv
from datetime import datetime
from typing import Dict, Any, List

# Add current dir to sys.path for internal imports
sys.path.append(os.getcwd())

# Ensure venv/bin is in PATH for subprocess calls (like semgrep)
venv_bin = os.path.join(os.getcwd(), "venv", "bin")
os.environ["PATH"] = venv_bin + os.pathsep + os.environ.get("PATH", "")

from models.company import CompanyContext
from engine.scanner import clone_repo, run_semgrep, parse_semgrep_findings
from main import run_risk_engine, generate_executive_summary

# Constants for systematic organization
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DOC_DIR = os.path.join(BASE_DIR, "Doc")
EXP_BASE_DIR = os.path.join(DOC_DIR, "experiments")
RUNS_DIR = os.path.join(EXP_BASE_DIR, "runs")

# Input file (maintained in the existing location for compatibility)
INPUT_FILE = os.path.join(DOC_DIR, "experiment_log", "repo_json.md")

# Global tracking files
SUMMARY_CSV = os.path.join(EXP_BASE_DIR, "experiments_summary.csv")
SUMMARY_MD = os.path.join(EXP_BASE_DIR, "experiments_summary.md")

def parse_repo_json(file_path: str) -> List[Dict[str, Any]]:
    """Parse the markdown file and extract company info + JSON."""
    if not os.path.exists(file_path):
        return []
    
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Split by ## 
    sections = re.split(r'## \d+\.', content)[1:]
    experiments = []
    
    for section in sections:
        # Extract GitHub URL
        github_match = re.search(r'- \*\*GitHub\*\*: (https://github\.com/\S+)', section)
        # Extract Branch (if any)
        branch_match = re.search(r'- \*\*Branch\*\*: (\S+)', section)
        
        # Extract JSON block
        json_match = re.search(r'```json\n(.*?)\n```', section, re.DOTALL)
        
        if github_match and json_match:
            repo_url = github_match.group(1).strip()
            branch = branch_match.group(1).strip() if branch_match else "main"
            try:
                company_data = json.loads(json_match.group(1))
                experiments.append({
                    "repo_url": repo_url,
                    "branch": branch,
                    "company": company_data
                })
            except json.JSONDecodeError:
                continue
            
    return experiments

def run_experiment(exp: Dict[str, Any], run_dir: str) -> Dict[str, Any]:
    """Run a single experiment and save results in a systematic structure."""
    repo_url = exp["repo_url"]
    branch = exp["branch"]
    company_data = exp["company"]
    company = CompanyContext(**company_data)
    
    print(f"\n[EXPERIMENT] {company.company_name} | {repo_url}")
    
    repo_path = None
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    company_slug = company.company_name.replace(' ', '_').lower()
    
    # Define directories
    experiment_dir = os.path.join(run_dir, company_slug)
    artifact_dir = os.path.join(experiment_dir, "artifacts")
    os.makedirs(artifact_dir, exist_ok=True)
    
    try:
        # 1. Clone
        print(" -> Cloning repository...")
        repo_path = clone_repo(repo_url, branch)
        
        # 2. Raw Semgrep Scan
        print(" -> Running Semgrep scan...")
        raw_findings = run_semgrep(repo_path)
        raw_count = len(raw_findings)
        
        # 3. Parsing for engine
        parsed_findings = parse_semgrep_findings(raw_findings, company.deployment_exposure, repo_path)
        
        # 4. AI-Enhanced Risk Engine
        api_key = os.getenv("GEMINI_API_KEY") or os.getenv("gemini_api_key")
        
        print(f" -> Analyzing {len(parsed_findings)} findings...")
        results, chains, filtered_count = run_risk_engine(parsed_findings, company, api_key)
        
        # AI Reduction Calculation
        filtered_results = [r for r in results if r.effective_probability > 0.01]
        verified_count = len(filtered_results)
        reduction_count = raw_count - verified_count
        reduction_pct = (reduction_count / raw_count * 100) if raw_count > 0 else 0
        
        # 5. Save Artifacts (JSON)
        print(" -> Saving artifacts...")
        with open(os.path.join(artifact_dir, "company_context.json"), "w") as f:
            f.write(company.json(indent=2)) if hasattr(company, 'json') else json.dump(company_data, f, indent=2)
            
        with open(os.path.join(artifact_dir, "semgrep_raw.json"), "w") as f:
            json.dump(raw_findings, f, indent=2)
            
        with open(os.path.join(artifact_dir, "risk_results.json"), "w") as f:
            json.dump([r.dict() for r in results], f, indent=2)
            
        with open(os.path.join(artifact_dir, "attack_chains.json"), "w") as f:
            json.dump([c.dict() for c in chains], f, indent=2)

        # 6. Save Markdown Report
        report_filename = f"report_{timestamp}.md"
        output_path = os.path.join(experiment_dir, report_filename)
        
        summary_text = generate_executive_summary(results, company, chains)
        
        report_content = [
            f"# Experiment Report: {company.company_name}",
            f"- **Date**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
            f"- **Repository**: [{repo_url}]({repo_url})",
            f"- **Branch**: `{branch}`",
            "",
            "## 🔍 Scan Metrics",
            f"- **Total Raw Findings (Semgrep)**: {raw_count}",
            f"- **AI-Verified Exploitability Count**: {verified_count}",
            f"- **AI-Assisted Reduction**: **{reduction_count}** ({reduction_pct:.1f}%)",
            "",
            "## 💰 Top Financial Risks (Ranked by ROI)",
            "| Rank | Type | Expected Loss | Priority (EL/Hour) | File |",
            "| :--- | :--- | :--- | :--- | :--- |"
        ]
        
        for i, r in enumerate(results[:10]):
            report_content.append(f"| {i+1} | {r.bug_type} | ${r.expected_loss:,.2f} | {r.priority_score:,.2f} | `{r.file}` |")
            
        report_content.append("\n## 📝 Executive Summary")
        report_content.append(summary_text)
        
        with open(output_path, 'w') as f:
            f.write("\n".join(report_content))
            
        # Create a 'latest_report.md' symlink/copy in the company dir for easy access
        shutil.copy2(output_path, os.path.join(experiment_dir, "latest_report.md"))
            
        print(f" -> Success: {output_path}")
        
        return {
            "timestamp": timestamp,
            "company": company.company_name,
            "repo": repo_url,
            "raw": raw_count,
            "verified": verified_count,
            "reduction": f"{reduction_pct:.1f}%",
            "loss": f"${sum(r.expected_loss for r in results):,.0f}",
            "status": "Success",
            "report_path": output_path
        }
        
    except Exception as e:
        print(f" -> Error: {e}")
        import traceback
        traceback.print_exc()
        return {
            "timestamp": timestamp,
            "company": company.company_name,
            "repo": repo_url,
            "status": f"Failed: {str(e)}"
        }
    finally:
        if repo_path and os.path.exists(repo_path):
            shutil.rmtree(repo_path)

def update_global_summaries(summary_data: Dict[str, Any]):
    """Update CSV and Markdown global trackers."""
    import csv
    
    # CSV Update
    file_exists = os.path.isfile(SUMMARY_CSV)
    headers = ["timestamp", "company", "repo", "raw", "verified", "reduction", "loss", "status"]
    
    with open(SUMMARY_CSV, 'a', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=headers, extrasaction='ignore')
        if not file_exists:
            writer.writeheader()
        writer.writerow(summary_data)
    
    # Markdown Update (Performance Dashboard)
    md_exists = os.path.isfile(SUMMARY_MD)
    
    if not md_exists:
        with open(SUMMARY_MD, 'w') as f:
            f.write("# 🧪 FinRisk Experiment Dashboard\n\n")
            f.write("| Timestamp | Company | Raw | Verified | Reduction | Est. Loss | Status |\n")
            f.write("| :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n")
    
    with open(SUMMARY_MD, 'a') as f:
        row = [
            summary_data.get("timestamp", ""),
            summary_data.get("company", ""),
            str(summary_data.get("raw", 0)),
            str(summary_data.get("verified", 0)),
            summary_data.get("reduction", ""),
            summary_data.get("loss", ""),
            summary_data.get("status", "")
        ]
        f.write("| " + " | ".join(row) + " |\n")

if __name__ == "__main__":
    from dotenv import load_dotenv
    load_dotenv()
    
    ensure_dirs = lambda: os.makedirs(RUNS_DIR, exist_ok=True)
    ensure_dirs()
    
    experiments = parse_repo_json(INPUT_FILE)
    if not experiments:
        print(f"No experiments found in {INPUT_FILE}.")
        sys.exit(0)
    
    # Create a unique directory for this execution run
    run_timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    current_run_dir = os.path.join(RUNS_DIR, f"RUN_{run_timestamp}")
    os.makedirs(current_run_dir, exist_ok=True)
    
    # Add a run summary to the run directory
    run_summary_path = os.path.join(current_run_dir, "run_summary.md")
    with open(run_summary_path, "w") as f:
        f.write(f"# Run Summary: {run_timestamp}\n\n")
    
    targets = []
    if len(sys.argv) > 1:
        arg = sys.argv[1].lower()
        if arg == "all":
            targets = experiments
        else:
            targets = [e for e in experiments if arg in e["company"]["company_name"].lower()]
    else:
        # Default to first experiment if no args
        targets = [experiments[0]]
        
    if not targets:
        print("No matching experiments found.")
        sys.exit(0)
        
    print(f"Starting execution run: {run_timestamp}")
    print(f"Total experiments to run: {len(targets)}")
    
    for exp in targets:
        summary = run_experiment(exp, current_run_dir)
        update_global_summaries(summary)
        
        # Also update the run-specific summary
        with open(run_summary_path, "a") as f:
            if "| Company |" not in open(run_summary_path).read():
                f.write("| Company | Raw | Verified | Status |\n")
                f.write("| :--- | :--- | :--- | :--- |\n")
            f.write(f"| {summary['company']} | {summary.get('raw',0)} | {summary.get('verified',0)} | {summary['status']} |\n")

    print(f"\n[DONE] Execution run complete.")
    print(f"Results stored in: {current_run_dir}")
    print(f"Global dashboard updated: {SUMMARY_MD}")

