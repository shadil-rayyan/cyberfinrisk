import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FinRisk — Security Risk to Financial Intelligence",
  description:
    "Translate software vulnerabilities into financial risk metrics. Scan GitHub repos, detect vulnerabilities, and get board-ready risk assessments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
