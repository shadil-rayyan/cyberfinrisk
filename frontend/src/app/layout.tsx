import { createMetadata } from "@/lib/metadata";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { jsonLd } from "@/lib/metadata";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata = createMetadata({
  siteUrl: "https://example.com",
  title: "MyApp",
  description: "A modern web app",
  appName: "MyApp",
  category: "Productivity",
  keywords: ["app", "nextjs", "productivity"],
  twitterHandle: "@myapp",
});

<Script
  id="json-ld"
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd({
    siteUrl: "https://example.com",
    title: "MyApp",
    description: "Best productivity app",
  })) }}
/>


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
