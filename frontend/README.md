
# 🚀 Next.js Template

A modern **Next.js 15 + React 19** starter template with batteries included.  
Designed for scalability, testing, performance, and developer experience.

---

## ✨ Features

- ⚡ **Next.js 15** (App Router, React 19, Server Components ready)
- 🎨 **Tailwind CSS 4** for styling
- 🧹 **ESLint + Prettier** for code quality
- 🔍 **SEO-ready** with `next-seo` and `next-sitemap`
- 📦 **PWA support** with `next-pwa`
- 📊 **Monitoring & Metrics** with Prometheus (`/api/metrics`)
- 📝 **Changelog automation** with `standard-version`
- 🧪 **Testing** stack:
  - **Jest + RTL** for unit tests
  - **Playwright** for end-to-end & UI testing
- 📚 **Docs-as-code** inside `/docs` (separate project)
- 🐳 **Docker-ready** for production deployments

---

## 📂 Project Structure

```

nextjs\_template/
│── app/               # Next.js app router
│── lib/               # Shared libraries (logger, metrics, etc.)
│── public/            # Static assets
│── docs/              # Documentation project (MkDocs / Docusaurus)
│── tests/             # Unit & E2E tests
│── .eslintrc.json     # Linting rules
│── tailwind.config.js # Tailwind setup
│── package.json

````

---

## 🛠️ Scripts

| Script             | Description                            |
|--------------------|----------------------------------------|
| `npm run dev`      | Start dev server (Next.js)             |
| `npm run build`    | Build production app                   |
| `npm run start`    | Run production build                   |
| `npm run lint`     | Run ESLint                             |
| `npm run prettier` | Format code with Prettier              |
| `npm run test`     | Run Jest tests                        |
| `npm run test:ui`  | Run Playwright tests                   |
| `npm run sitemap`  | Generate sitemap                       |
| `npm run release`  | Create a new release + changelog       |

---

## 📊 Observability

- **Prometheus metrics**: exposed at [`/api/metrics`](./app/api/metrics/route.ts)  
- **Grafana**: use Prometheus as a data source for dashboards  
- **Logging**: `pino` for structured logs (pretty logs in dev)

---

## 🧪 Testing

- **Jest**: for unit & integration tests  
- **React Testing Library**: for component testing  
- **Playwright**: for UI and end-to-end workflows

```bash
npm run test       # Run Jest tests
npm run test:ui    # Run Playwright tests
````

---

## 📦 Releasing

This template uses **[standard-version](https://github.com/conventional-changelog/standard-version)**:

```bash
npm run release           # Patch release
npm run release:minor     # Minor release
npm run release:major     # Major release
```

It auto-generates a `CHANGELOG.md`.

---

## 🐳 Docker

```bash
docker build -t nextjs-template .
docker run -p 3000:3000 nextjs-template
```

Optimized multi-stage build with `node:20-slim`.

---

## 📚 Documentation

Docs are managed as a **separate project** inside `/docs`.
Run it independently for architecture, API references, and developer guides.

---

## 🚀 Getting Started

```bash
git clone https://github.com/your-username/nextjs-template.git
cd nextjs-template
npm install
npm run dev
```

Visit 👉 [http://localhost:3000](http://localhost:3000)

---

## 📜 License

MIT

