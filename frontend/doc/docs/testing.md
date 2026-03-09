

# 🧪 Testing Setup: Playwright, Jest & React Testing Library

This project includes a **full testing stack**:

* **Jest** → Unit & integration tests
* **React Testing Library (RTL)** → Component testing with real DOM interactions
* **Playwright** → End-to-end (E2E) browser testing

---

## ⚡ 1. Unit & Integration Tests with Jest + RTL



### Jest Setup (`jest.setup.js`)

```js
import "@testing-library/jest-dom";
```

### Example Test

```tsx title="__tests__/Button.test.tsx"
import { render, screen, fireEvent } from "@testing-library/react";
import Button from "@/components/Button";

test("renders a button and clicks", () => {
  render(<Button>Click Me</Button>);
  
  const btn = screen.getByText("Click Me");
  fireEvent.click(btn);

  expect(btn).toBeInTheDocument();
});
```

✅ Run with:

```bash
npm run test:unit
```

---

## ⚡ 2. End-to-End (E2E) Testing with Playwright


### Example Test

```ts title="e2e/home.spec.ts"
import { test, expect } from "@playwright/test";

test("home page loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toContainText("Hello World");
});
```

✅ Run with:

```bash
npm run test:e2e
```

---

## ⚡ 3. How They Work Together

| Tool       | Purpose           | Example                                   |
| ---------- | ----------------- | ----------------------------------------- |
| Jest       | Unit tests        | Utility functions, reducers               |
| RTL        | Integration tests | Components with user interaction          |
| Playwright | E2E tests         | Full pages, routing, authentication flows |

---

## ⚡ 4. GitHub Actions Integration

In `.github/workflows/ci.yml`:

```yaml
- name: Unit tests with Jest
  run: npm run test:unit -- --runInBand

- name: Build app
  run: npm run build

- name: E2E tests with Playwright
  env:
    NEXT_PUBLIC_SITE_URL: http://localhost:3000
  run: npm run test:e2e
```

