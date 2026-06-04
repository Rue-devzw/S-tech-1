import type { Metadata } from "next";
import { PageShell } from "@/components/site-shell";
import { CTASection, Checklist, HeroSection, SectionHeader } from "@/components/public-sections";
import { publicServices } from "@/lib/public-content";
import { breadcrumbJsonLd, makeMetadata, serviceJsonLd } from "@/lib/seo";

const service = publicServices.find((item) => item.slug === "web-development")!;

export const metadata: Metadata = makeMetadata({
  title: "Web Development in Zimbabwe",
  description: "Professional web development for business websites, portals, landing pages, service pages and SEO-ready content structures.",
  path: "/web-development",
  keywords: ["web development Zimbabwe", "website design Harare", "business websites", "SEO web development"]
});

export default function WebDevelopmentPage() {
  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([serviceJsonLd(service.slug), breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }, { name: service.title, path: `/${service.slug}` }])]) }} />
      <HeroSection eyebrow={service.eyebrow} title={service.title} body={service.description} primaryLabel={service.cta} />
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-2">
        <div><SectionHeader title="What we build" /><div className="mt-6"><Checklist items={service.outcomes} /></div></div>
        <div><SectionHeader title="Delivery process" /><div className="mt-6"><Checklist items={service.process} /></div></div>
      </section>
      <CTASection />
    </PageShell>
  );
}
