// lib/metadata.ts
import type { Metadata } from "next";

interface ProjectMetadataOptions {
  siteUrl: string;
  title: string;
  description: string;
  appName?: string;
  category?: string;
  keywords?: string[];
  twitterHandle?: string;
  ogImage?: string;
}

export function createMetadata({
  siteUrl,
  title,
  description,
  appName = title,
  category = "Website",
  keywords = [],
  twitterHandle = "",
  ogImage = "/api/og?title=" + encodeURIComponent(title),
}: ProjectMetadataOptions): Metadata {
  return {
    title,
    description,
    manifest: "/manifest.webmanifest",
    themeColor: "#000000",
    applicationName: appName,
    category,
    keywords,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      url: `${siteUrl}/`,
      siteName: appName,
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      site: twitterHandle,
      creator: twitterHandle,
      title,
      description,
      images: [ogImage],
    },
    verification: {
      google: "",
      other: {
        "msvalidate.01": [""],
      },
    },
    icons: {
      icon: [
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "black-translucent",
      title: appName,
    },
  };
}

// inside Metadata factory (or inject via a component <Script>)
export const jsonLd = (options: {
  siteUrl: string;
  title: string;
  description: string;
  logo?: string;
  creator?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  url: options.siteUrl,
  name: options.title,
  description: options.description,
  publisher: {
    "@type": "Organization",
    name: options.creator || options.title,
    logo: {
      "@type": "ImageObject",
      url: options.logo || `${options.siteUrl}/favicon-512x512.png`,
    },
  },
});

