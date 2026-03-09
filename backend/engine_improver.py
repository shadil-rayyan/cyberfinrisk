import json
import os
import re
import sys
import shutil
import google.generativeai as genai
from datetime import datetime
from typing import Dict, Any, List

# Add current dir to sys.path for internal imports
sys.path.append(os.getcwd())

# Ensure venv/bin is in PATH for subprocess calls (like semgrep)
venv_bin = os.path.join(os.getcwd(), "venv", "bin")
os.environ["PATH"] = venv_bin + os.pathsep + os.environ.get("PATH", "")

from models.company import CompanyContext
from engine.scanner import clone_repo, run_semgrep, parse_semgrep_findings
from main import run_risk_engine

def parse_repo_json(file_path: str) -> List[Dict[str, Any]]:
    """Parse the markdown file and extract company info + JSON."""
    if not os.path.exists(file_path):
        return []
    
    with open(file_path, 'r') as f:
        content = f.read()
    
    sections = re.split(r'## \d+\.', content)[1:]
    experiments = []
    
    for section in sections:
        github_match = re.search(r'- \*\*GitHub\*\*: (https://github\.com/\S+)', section)
        branch_match = re.search(r'- \*\*Branch\*\*: (\S+)', section)
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

def analyze_engine_shortcomings(results: list, company: CompanyContext, raw_findings: list):
    """Ask Gemini to identify gaps in the engine's logic for this scan."""
    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("gemini_api_key")
    if not api_key:
        return "Critical Error: Gemini API key missing. Cannot perform self-improvement analysis."

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-2.5-flash")

    # Prepare a summary for the LLM
    results_summary = []
    for r in results[:15]: # Top 15 findings
        results_summary.append({
            "type": r.bug_type,
            "impact": r.total_impact,
            "el": r.expected_loss,
            "roi": r.roi_of_fixing,
            "file": r.file
        })

    prompt = f"""You are an Expert Software Architect and Security Lead. You are auditing the 'FinRisk Engine', which translates technical security finds into business risk.

COMPANY CONTEXT:
- Name: {company.company_name}
- Industry: {company.industry}
- Tech Stack: {company.stack_description or 'Unknown'}

ANALYSIS PERFORMED:
The engine found {len(results)} vulnerabilities across the codebase.
Top Findings (JSON):
{json.dumps(results_summary, indent=2)}

TASK:
Identify the shortcomings, logical gaps, or systemic failures of the FinRisk software and core engine based on these results. 

Consider:
1. Classification Accuracy: Did we map Semgrep rules correctly to high-level bug types?
2. Financial Realism: Are the dollar amounts ($Impact) too generic or unrealistic for this specific industry/stack?
3. Detection Blindspots: Based on the tech stack ({company.stack_description}), what categories of vulnerabilities is Semgrep + our Classifier likely missing?
4. Logic Gaps: Is the Expected Loss (EL) calculation missing critical variables?
5. Software Performance: Any obvious bottlenecks in the scanner or risk modeler pipeline?

Format your response as a professional 'Engine Diagnostic Report' with sections:
- Executive Critique
- Specific Shortcomings
- Data/Model Gaps
- Actionable Engineering Roadmap (to improve the software)
"""

    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Self-improvement analysis failed: {str(e)}"

def run_self_improvement(exp: Dict[str, Any], base_output_dir: str):
    repo_url = exp["repo_url"]
    branch = exp["branch"]
    company_data = exp["company"]
    company = CompanyContext(**company_data)
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    company_slug = company.company_name.replace(' ', '_').lower()
    company_dir = os.path.join(base_output_dir, company_slug)
    os.makedirs(company_dir, exist_ok=True)
    
    output_path = os.path.join(company_dir, f"diagnostic_{timestamp}.md")

    print(f"--- Improving Engine: {company.company_name} ---")
    
    repo_path = None
    try:
        print(f"Cloning repository {repo_url}...")
        try:
            repo_path = clone_repo(repo_url, branch)
        except Exception as e:
            fallback = "master" if branch == "main" else "main"
            print(f"Failed to clone branch {branch}, trying fallback {fallback}...")
            repo_path = clone_repo(repo_url, fallback)
            branch = fallback
        
        print("Running Semgrep scan...")
        raw_findings = run_semgrep(repo_path)
        
        print("Running Risk Analysis...")
        parsed_findings = parse_semgrep_findings(raw_findings, company.deployment_exposure, repo_path)
        api_key = os.getenv("GEMINI_API_KEY") or os.getenv("gemini_api_key")
        results, chains, filtered = run_risk_engine(parsed_findings, company, api_key)
        
        print("Performing Diagnostic Deep Dive...")
        diagnostic_report = analyze_engine_shortcomings(results, company, raw_findings)
        
        # Save results
        output_path = os.path.join(target_dir, "result.md")
        with open(output_path, 'w') as f:
            f.write(f"# Professional Analysis: {company.company_name}\n")
            f.write(f"**Timestamp**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write(f"**Repository**: {repo_url}\n\n")
            f.write(diagnostic_report)
            
        print(f"Diagnostics saved to: {output_path}")

    except Exception as e:
        print(f"Error in self-improvement run: {e}")
    finally:
        if repo_path and os.path.exists(repo_path):
            shutil.rmtree(repo_path)

if __name__ == "__main__":
    from dotenv import load_dotenv
    load_dotenv()
    
    INPUT_FILE = "/home/shadil/code/personal/test/finrisk/Doc/test_self_improve/repo_json.md"
    OUTPUT_DIR = "/home/shadil/code/personal/test/finrisk/Doc/test_self_improve/repo"
    
    experiments = parse_repo_json(INPUT_FILE)
    if not experiments:
        print("No targets found.")
        sys.exit(0)

    # Run based on arguments or first one
    if len(sys.argv) > 1:
        target = sys.argv[1].lower()
        if target == "all":
            for exp in experiments:
                run_self_improvement(exp, OUTPUT_DIR)
        else:
            found = False
            for exp in experiments:
                if target in exp["company"]["company_name"].lower():
                    run_self_improvement(exp, OUTPUT_DIR)
                    found = True
                    break
            if not found:
                 print(f"Could not find target matching: {target}")
    else:
        # Run first one
        run_self_improvement(experiments[0], OUTPUT_DIR)
