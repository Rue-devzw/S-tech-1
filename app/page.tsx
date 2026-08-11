import type { Metadata } from "next";
import { StorefrontPage } from "@/components/storefront-page";
import { makeMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  ...makeMetadata({
    title: "Phones, Laptops & PlayStation Store",
    description: "Shop quality-checked phones, laptops, PlayStation consoles and accessories in Zimbabwe, with clear condition labels, local warranty and formal pre-order options.",
    path: "/",
    keywords: ["phone shop Zimbabwe", "laptop shop Harare", "PlayStation 5 Zimbabwe", "electronics store Zimbabwe"]
  }),
  title: { absolute: "Phones, Laptops & PlayStation Store | OmniTech Solutions" }
};

export default function HomePage() {
  return <StorefrontPage route="home" />;
}
