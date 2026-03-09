

## 🔍 What is Lighthouse?

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) is an open-source tool from Google that analyzes web applications and generates a detailed report across five categories:

* **Performance**: Page load speed and optimization
* **Accessibility**: How well your site works with screen readers and assistive technologies
* **Best Practices**: Security and coding standards
* **SEO**: Search engine discoverability
* **PWA**: Progressive Web App features

---

## 🚀 How Lighthouse CI Works in GitHub Actions

In your workflow, the Lighthouse step looks like this:

```yaml
- name: Run Lighthouse Audit
  uses: treosh/lighthouse-ci-action@v12
  with:
    urls: |
      http://localhost:3000
    uploadArtifacts: true
```

### Breakdown

* **`uses: treosh/lighthouse-ci-action`**
  Runs Lighthouse as part of CI.

* **`urls`**
  The URL to audit. Here, it points to the locally running Next.js app.

* **`uploadArtifacts: true`**
  Stores the Lighthouse report as a downloadable artifact in GitHub Actions.

### Outputs

* A `.html` Lighthouse report is generated and uploaded as an artifact.
* You can download the report directly from the GitHub Actions run to inspect detailed results.

---

## 📦 Benefits of This Setup

* ✅ Prevents performance regressions
* ✅ Ensures accessibility compliance
* ✅ Detects SEO issues early
* ✅ Automates testing before merging PRs
* ✅ Provides reproducible, automated quality checks

