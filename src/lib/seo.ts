import type { Metadata } from "next";
import { brand } from "@/lib/constants";
import { publicServices } from "@/lib/public-content";

const fallbackSiteUrl = "https://omnitechsolutions.co.zw";
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || process.env.APP_URL || fallbackSiteUrl).replace(/\/$/, "");

export const seoConfig = {
  siteUrl,
  defaultImage: "/brand/omnitech-logo.png",
  locale: "en_ZW",
  siteName: brand.name,
  description:
    "OmniTech Solutions provides electronics repairs, ICT support, networking, Starlink installations, web development, software systems and AI automation in Zimbabwe.",
  keywords: [
    "OmniTech Solutions",
    "electronics repairs Zimbabwe",
    "phone repairs Harare",
    "laptop repairs Harare",
    "ICT support Zimbabwe",
    "Starlink installation Zimbabwe",
    "networking services Harare",
    "web development Zimbabwe",
    "software development Zimbabwe",
    "AI automation Zimbabwe"
  ]
};

export function absoluteUrl(path = "/") {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${seoConfig.siteUrl}${cleanPath}`;
}

export function makeMetadata({
  title,
  description = seoConfig.description,
  path = "/",
  keywords = [],
  image = seoConfig.defaultImage,
  type = "website",
  noIndex = false
}: {
  title: string;
  description?: string;
  path?: string;
  keywords?: string[];
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
}): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = image.startsWith("http") ? image : absoluteUrl(image);

  return {
    title,
    description,
    keywords: [...seoConfig.keywords, ...keywords],
    alternates: {
      canonical: path
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: { index: false, follow: false }
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1
          }
        },
    openGraph: {
      title: `${title} | ${brand.name}`,
      description,
      url,
      siteName: brand.name,
      locale: seoConfig.locale,
      type,
      images: [{ url: imageUrl, width: 1280, height: 1370, alt: `${brand.name} logo` }]
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${brand.name}`,
      description,
      images: [imageUrl]
    }
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${seoConfig.siteUrl}/#organization`,
    name: brand.name,
    url: seoConfig.siteUrl,
    logo: absoluteUrl("/brand/omnitech-logo.png"),
    image: absoluteUrl("/brand/omnitech-logo.png"),
    slogan: brand.tagline,
    telephone: brand.phone,
    email: brand.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Harare",
      addressCountry: "ZW"
    },
    areaServed: [
      { "@type": "Country", name: "Zimbabwe" },
      { "@type": "City", name: "Harare" }
    ],
    sameAs: [brand.whatsappChannel],
    makesOffer: publicServices.map((service) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: service.title,
        description: service.summary,
        url: absoluteUrl(`/${service.slug}`)
      }
    }))
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${seoConfig.siteUrl}/#website`,
    name: brand.name,
    url: seoConfig.siteUrl,
    publisher: { "@id": `${seoConfig.siteUrl}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: `${seoConfig.siteUrl}/blog?search={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
}

export function serviceJsonLd(slug: string) {
  const service = publicServices.find((item) => item.slug === slug);
  if (!service) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${absoluteUrl(`/${slug}`)}#service`,
    name: service.title,
    description: service.description,
    provider: { "@id": `${seoConfig.siteUrl}/#organization` },
    areaServed: { "@type": "Country", name: "Zimbabwe" },
    serviceType: service.title,
    url: absoluteUrl(`/${slug}`),
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      url: absoluteUrl("/request-service")
    }
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path)
    }))
  };
}
