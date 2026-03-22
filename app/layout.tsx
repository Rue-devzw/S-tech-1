import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Sora } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { getSiteUrl } from "@/lib/env";
import {
  createOrganizationJsonLd,
  createWebsiteJsonLd,
  getDefaultSiteMetadata,
} from "@/lib/site-metadata";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-headline",
  display: "swap",
});

const defaultMetadata = getDefaultSiteMetadata();

export const metadata: Metadata = {
  ...defaultMetadata,
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "S-Tech Studios",
    template: "%s | S-Tech Studios",
  },
  applicationName: "S-Tech Studios",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationJsonLd = createOrganizationJsonLd();
  const websiteJsonLd = createWebsiteJsonLd();

  return (
    <html lang="en">
      <body
        className={`${plusJakarta.variable} ${sora.variable} font-body antialiased`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-slate-900 focus:shadow-lg"
        >
          Skip to content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd),
          }}
        />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
