

# ⚡ Continuous Integration with GitHub Actions

This project uses **GitHub Actions** for automated testing, building, and quality checks.
---

## 🔄 How GitHub Actions Workflow Works

The workflow file (`.github/workflows/ci.yml`) defines automated steps that run whenever you push to `main` or open a pull request.

### Workflow Overview

1. **Checkout Code**
   Uses `actions/checkout` to pull the repository code into the runner.

2. **Setup Node.js**
   Installs Node.js (version 20.x) and caches `node_modules` for faster builds.

3. **Install Dependencies**
   Runs `npm ci` to install dependencies in a clean environment.

4. **Type Checking**
   Ensures all TypeScript files compile without type errors.

5. **Unit Tests with Jest**
   Runs `npm run test:unit` with coverage reporting.

6. **End-to-End Tests with Playwright**
   Spins up the Next.js app and runs browser-based tests.

7. **Lighthouse Audit**
   Runs automated audits of the deployed app (locally served at `http://localhost:3000`).

8. **Bundle Size Check**
   Ensures the app bundle does not exceed defined size thresholds.

---