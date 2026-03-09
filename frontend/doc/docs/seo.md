Perfect ✅ You want a **documentation page** that explains how to use **`next-sitemap`**, **SEO metadata**, and **PWA integration** in your Next.js project, using the `lib/metadata.ts` file you shared.

Here’s a polished doc you can drop into your Docusaurus or `docs/seo.md`:

---

# 🌐 SEO, Sitemap & PWA Setup

This project uses a **unified metadata system**, automated **sitemap generation**, and **PWA (Progressive Web App) features** to improve search engine visibility and user experience.

---

## ⚡ 1. Metadata Factory (`lib/metadata.ts`)

We centralize SEO configuration inside `lib/metadata.ts`.
This ensures **consistent metadata** across all routes.

### Example

```ts title="lib/metadata.ts"
import { createMetadata } from "@/lib/metadata";

export const siteMetadata = createMetadata({
  siteUrl: "https://example.com",
  title: "My Next.js App",
  description: "A modern Next.js app with SEO & PWA.",
  keywords: ["Next.js", "SEO", "PWA"],
  twitterHandle: "@myhandle",
});
```

### Usage in Layout

```tsx title="app/layout.tsx"
import { siteMetadata } from "@/lib/metadata";

export const metadata = siteMetadata;
```

✅ This automatically sets:

* Title & description
* Canonical URL
* Open Graph (OG) tags for social media
* Twitter card
* App icons & PWA manifest

---

## ⚡ 2. JSON-LD Structured Data

To improve SEO further, we generate **schema.org structured data**.

```tsx title="app/layout.tsx"
import { jsonLd } from "@/lib/metadata";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              jsonLd({
                siteUrl: "https://example.com",
                title: "My Next.js App",
                description: "A modern Next.js app with SEO & PWA.",
                creator: "My Company",
              })
            ),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

---

## ⚡ 3. Sitemap with `next-sitemap`

We use [`next-sitemap`](https://github.com/iamvishnusankar/next-sitemap) to automatically generate `sitemap.xml` and `robots.txt`.

### Install

```bash
npm install next-sitemap
```

### Config (`next-sitemap.config.js`)

```js
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://example.com",
  generateRobotsTxt: true,
  sitemapSize: 5000,
};
```

### Add Script in `package.json`

```json
{
  "scripts": {
    "postbuild": "next-sitemap"
  }
}
```

✅ After each build, `sitemap.xml` and `robots.txt` will be available at:

* `https://example.com/sitemap.xml`
* `https://example.com/robots.txt`

---

## ⚡ 4. Progressive Web App (PWA)

We enable **offline support** and **installable app behavior** with a PWA manifest.

### Manifest (`public/manifest.webmanifest`)

```json
{
  "name": "My Next.js App",
  "short_name": "NextApp",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#000000",
  "theme_color": "#000000",
  "icons": [
    { "src": "/favicon-192x192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/favicon-512x512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

### Add `next-pwa` (optional)

```bash
npm install next-pwa
```

```js title="next.config.js"
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
});

module.exports = withPWA({
  reactStrictMode: true,
});
```

