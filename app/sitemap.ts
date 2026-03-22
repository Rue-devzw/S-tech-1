import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/env";
import { getListings } from "@/lib/server/data-store";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const now = new Date();
  const listings = await getListings();

  const staticRoutes = ["", "/store", "/services", "/about"].map((route) => {
    const changeFrequency: "weekly" | "monthly" =
      route === "" ? "weekly" : "monthly";

    return {
      url: `${siteUrl}${route}`,
      lastModified: now,
      changeFrequency,
      priority: route === "" ? 1 : route === "/store" ? 0.9 : 0.7,
    };
  });

  const listingRoutes = listings.map((listing) => ({
    url: `${siteUrl}/listing/${listing.id}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: listing.featured ? 0.8 : 0.7,
  }));

  return [...staticRoutes, ...listingRoutes];
}
