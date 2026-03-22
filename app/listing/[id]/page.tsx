import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AnalyticsTracker } from "@/components/analytics/analytics-tracker";
import { ListingDetailClient } from "@/components/marketplace/listing-detail-client";
import { createCanonicalUrl } from "@/lib/site-metadata";
import { getListingById } from "@/lib/server/data-store";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const listing = await getListingById(id);

  if (!listing) {
    return {
      title: "Listing Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const canonical = createCanonicalUrl(`/listing/${listing.id}`);
  const description = `${listing.shortDescription} Starting from $${listing.price.toLocaleString()} with delivery timeline ${listing.deliveryTimeline}.`;

  return {
    title: listing.name,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      url: canonical,
      title: `${listing.name} | S-Tech Studios`,
      description,
      images: [
        {
          url: listing.imageUrl,
          alt: listing.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${listing.name} | S-Tech Studios`,
      description,
      images: [listing.imageUrl],
    },
  };
}

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await getListingById(id);

  if (!listing) {
    notFound();
  }

  const listingJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: listing.name,
    description: listing.shortDescription,
    serviceType: listing.category,
    provider: {
      "@type": "Organization",
      name: "S-Tech Studios",
    },
    areaServed: "Africa",
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: listing.price,
      availability: "https://schema.org/InStock",
      url: createCanonicalUrl(`/listing/${listing.id}`),
    },
    image: createCanonicalUrl(listing.imageUrl),
  };

  return (
    <>
      <AnalyticsTracker
        eventType="listing_view"
        route={`/listing/${listing.id}`}
        subject={listing.id}
        metadata={{
          listingId: listing.id,
          listingName: listing.name,
          category: listing.category,
          price: listing.price,
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(listingJsonLd),
        }}
      />
      <ListingDetailClient listing={listing} />
    </>
  );
}
