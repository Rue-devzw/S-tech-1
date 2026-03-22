import type { Metadata } from "next";
import { MainNav } from "@/components/layout/main-nav";
import { AnalyticsTracker } from "@/components/analytics/analytics-tracker";
import { SiteFooter } from "@/components/layout/site-footer";
import { StorePageClient } from "@/components/marketplace/store-page-client";
import {
  createCanonicalUrl,
  createPageMetadata,
} from "@/lib/site-metadata";
import { getListings } from "@/lib/server/data-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createPageMetadata({
  title: "Store",
  description:
    "Browse S-Tech Studios productized platforms, accelerators, and delivery-ready digital solutions with clear business outcomes and pricing anchors.",
  path: "/store",
  keywords: [
    "software templates",
    "productized services",
    "digital accelerators",
    "premium project catalog",
  ],
});

export default async function StorePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const listings = await getListings();
  const params = await searchParams;
  const initialQuery = params.q?.trim() ?? "";
  const storeJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "S-Tech Studios Store",
    url: createCanonicalUrl("/store"),
    description:
      "Browse S-Tech Studios productized platforms, accelerators, and delivery-ready digital solutions with clear business outcomes and pricing anchors.",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: listings.slice(0, 12).map((listing, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: createCanonicalUrl(`/listing/${listing.id}`),
        name: listing.name,
      })),
    },
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <AnalyticsTracker
        eventType="store_view"
        route="/store"
        metadata={{ query: initialQuery || null }}
      />
      <MainNav />
      <main id="main-content" className="container mx-auto px-4 py-10">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(storeJsonLd),
          }}
        />
        <StorePageClient
          initialListings={listings}
          initialQuery={initialQuery}
        />
      </main>
      <SiteFooter />
    </div>
  );
}
