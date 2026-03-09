# Research Paper: Automating Risk Analysis

The Research Paper module (`research_paper.py`) is designed for batch execution and benchmarking of the FinRisk engine. It allows researchers and developers to run the entire risk analysis pipeline across multiple real-world repositories to validate the engine's effectiveness.

## 🔬 Purpose

The primary goal of this module is to generate empirical data on how AI improves vulnerability triage. It specifically measures the **AI reduction rate**—the percentage of raw scanner findings (Semgrep) that are identified as non-exploitable or low-risk by the AI, thereby reducing developer fatigue.

## 📋 Input Structure (`repo_json.md`)

The module consumes a structured Markdown file at `Doc/experiment_log/repo_json.md`. Each experiment is defined by:
- **GitHub URL**: The target repository to scan.
- **Branch**: Specific branch to checkout.
- **Company Context**: A JSON block defining the industry, tech stack, and deployment exposure of the company.

## 🔄 Execution Workflow

1.  **Repository Management**:
    - Clones the target repository to a temporary local directory.
    - Automatically cleans up the repository after the experiment completes.
2.  **Multistage Scanning**:
    - **Raw Scan**: Runs a comprehensive Semgrep scan using the standard ruleset.
    - **Parsing**: Refines the raw findings based on the company's deployment exposure.
    - **AI Engine**: Feeds the parsed results into the AI-enhanced Risk Engine.
3.  **Metrics Calculation**:
    - **Raw Count**: Total number of findings from Semgrep.
    - **AI-Verified Count**: Number of findings that Gemini considers high-risk and exploitably viable.
    - **Reduction Percentage**: The efficiency gain calculated as `(Raw - AI_Verified) / Raw`.

## 📊 Experiment Reports

For every successful run, the module generates a detailed report in `Doc/experiment_log/`. These reports include:
- **Scan Metrics**: Clear visualization of the noise reduction achieved by AI.
- **Top Financial Risks**: A ranked table of the top 10 vulnerabilities by **Expected Loss (EL)** and **ROI**.
- **Executive Summary**: A human-readable narrative explaining the risk landscape for that specific repository.

## 🚀 How to Run

Navigate to the project root and execute the script:

```bash
# Run the first experiment in repo_json.md
python research_paper.py

# Run a specific experiment by company name substring
python research_paper.py "Stripe"

# Run all experiments in the file
python research_paper.py all
```
