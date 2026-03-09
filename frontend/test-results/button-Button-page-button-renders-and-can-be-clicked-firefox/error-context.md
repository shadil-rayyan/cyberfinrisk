# Page snapshot

```yaml
- generic [ref=e2]:
  - region "Skip to main content":
    - link "Skip to main content" [ref=e3] [cursor=pointer]:
      - /url: "#__docusaurus_skipToContent_fallback"
  - navigation "Main" [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]:
        - link "My Docs Logo My Docs" [ref=e7] [cursor=pointer]:
          - /url: /
          - img "My Docs Logo" [ref=e9] [cursor=pointer]
          - generic [ref=e10] [cursor=pointer]: My Docs
        - link "Docs" [ref=e11] [cursor=pointer]:
          - /url: /PWA
      - generic [ref=e12]:
        - link "GitHub" [ref=e13] [cursor=pointer]:
          - /url: https://github.com/your-org/your-repo
          - text: GitHub
          - img [ref=e14] [cursor=pointer]
        - button "Switch between dark and light mode (currently light mode)" [ref=e17] [cursor=pointer]:
          - img [ref=e18] [cursor=pointer]
  - main [ref=e21]:
    - generic [ref=e23]:
      - heading "Page Not Found" [level=1] [ref=e24]
      - paragraph [ref=e25]: We could not find what you were looking for.
      - paragraph [ref=e26]: Please contact the owner of the site that linked you to the original URL and let them know their link is broken.
  - contentinfo [ref=e27]:
    - generic [ref=e30]: Copyright © 2025 My Docs.
```