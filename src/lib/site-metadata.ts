import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/env";

const siteUrl = getSiteUrl();
const siteName = "S-Tech Studios";
const defaultDescription =
  "S-Tech Studios showcases real digital work from Harare, including brand websites, agency platforms, and curated content experiences.";
const defaultOgImage = `${siteUrl}/images/hero-image.webp`;
const logoImage = `${siteUrl}/images/logo.webp`;

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
    logo: logoImage,
    email: "help@s-techsolution.org",
    telephone: "+263718704505",
    sameAs: [
      "https://www.facebook.com/Stechsolutions",
      "https://whatsapp.com/channel/0029VaE4TMq545v0wnXxRL0F",
      "https://chat.whatsapp.com/HmI8N3xz1RZDwKoRztaJYe?mode=gi_t",
    ],
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
      "portfolio website Zimbabwe",
      "Harare web design",
      "agency website development",
      "digital collection platform",
      "S-Tech Studios work",
    ],
  });
}
