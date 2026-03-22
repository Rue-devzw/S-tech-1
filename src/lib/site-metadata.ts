import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/env";

const siteUrl = getSiteUrl();
const siteName = "S-Tech Studios";
const defaultDescription =
  "S-Tech Studios designs and delivers secure digital products, AI-powered systems, and scalable platforms for growth-focused teams.";
const defaultOgImage = `${siteUrl}/images/hero-image.webp`;

export function createCanonicalUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}

export function createPageMetadata(input: {
  title: string;
  description: string;
  path: string;
  image?: string;
  keywords?: string[];
}): Metadata {
  const image = input.image ?? defaultOgImage;
  const canonical = createCanonicalUrl(input.path);

  return {
    title: input.title,
    description: input.description,
    keywords: input.keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      url: canonical,
      siteName,
      title: `${input.title} | ${siteName}`,
      description: input.description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${input.title} preview image`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${input.title} | ${siteName}`,
      description: input.description,
      images: [image],
    },
  };
}

export function createOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: siteUrl,
    logo: `${siteUrl}/images/hero-image.webp`,
    email: "hello@s-tech.africa",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Harare",
      addressCountry: "ZW",
    },
  };
}

export function createWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/store?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function getDefaultSiteMetadata() {
  return createPageMetadata({
    title: siteName,
    description: defaultDescription,
    path: "/",
    image: defaultOgImage,
    keywords: [
      "digital product studio",
      "product engineering",
      "AI systems",
      "Zimbabwe software studio",
      "secure web platforms",
    ],
  });
}
