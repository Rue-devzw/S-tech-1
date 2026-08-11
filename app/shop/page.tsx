import type { Metadata } from "next";
import { StorefrontPage } from "@/components/storefront-page";
import { makeMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  ...makeMetadata({
    title: "Shop Phones, Laptops & PlayStation",
    description: "Browse OmniTech phones, laptops, PlayStation consoles and accessories with transparent USD prices, clear condition labels and formal pre-order terms.",
    path: "/shop",
    keywords: ["gadget shop Zimbabwe", "phones Harare", "PlayStation Zimbabwe", "laptops Zimbabwe"]
  }),
  title: { absolute: "Shop Gadgets | OmniTech Solutions" }
};

export default async function ShopPage({
  searchParams
}: {
  searchParams: Promise<{ query?: string | string[] }>;
}) {
  const rawQuery = (await searchParams).query;
  const query = Array.isArray(rawQuery) ? rawQuery[0] : rawQuery;

  return <StorefrontPage route="shop" query={query} />;
}
