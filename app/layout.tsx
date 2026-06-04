import type { Metadata } from "next";
import "./globals.css";
import { brand } from "@/lib/constants";
import { absoluteUrl, seoConfig } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(seoConfig.siteUrl),
  applicationName: brand.name,
  authors: [{ name: brand.name, url: seoConfig.siteUrl }],
  creator: brand.name,
  publisher: brand.name,
  category: "Technology services",
  title: {
    default: `${brand.name} | ${brand.tagline}`,
    template: `%s | ${brand.name}`
  },
  description: seoConfig.description,
  keywords: seoConfig.keywords,
  alternates: {
    canonical: "/"
  },
  icons: {
    icon: [
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" }
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }]
  },
  openGraph: {
    title: `${brand.name} | ${brand.tagline}`,
    description: seoConfig.description,
    url: seoConfig.siteUrl,
    siteName: brand.name,
    locale: seoConfig.locale,
    type: "website",
    images: [{ url: absoluteUrl("/brand/omnitech-logo.png"), width: 1280, height: 1370, alt: `${brand.name} logo` }]
  },
  twitter: {
    card: "summary_large_image",
    title: `${brand.name} | ${brand.tagline}`,
    description: seoConfig.description,
    images: [absoluteUrl("/brand/omnitech-logo.png")]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
