import type { Metadata } from "next";
import { PageShell } from "@/components/site-shell";
import { CTASection, Checklist, HeroSection, SectionHeader } from "@/components/public-sections";
import { publicServices } from "@/lib/public-content";
import { breadcrumbJsonLd, makeMetadata, serviceJsonLd } from "@/lib/seo";

const service = publicServices.find((item) => item.slug === "starlink-installations")!;

export const metadata: Metadata = makeMetadata({
  title: "Starlink Installations in Zimbabwe",
  description: "Professional Starlink installation support including site survey, mounting, cable routing, router setup, Wi-Fi configuration and commissioning.",
  path: "/starlink-installations",
  keywords: ["Starlink installation Zimbabwe", "Starlink installer Harare", "Starlink mounting", "rural internet Zimbabwe"]
});

export default function StarlinkPage() {
  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([serviceJsonLd(service.slug), breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }, { name: service.title, path: `/${service.slug}` }])]) }} />
      <HeroSection eyebrow={service.eyebrow} title={service.title} body={service.description} primaryLabel={service.cta} visualImage={service.imageSrc} visualAlt={service.imageAlt} visualCaption={service.visualNote} />
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-2">
        <div><SectionHeader title="Starlink installation includes" /><div className="mt-6"><Checklist items={service.outcomes} /></div></div>
        <div><SectionHeader title="Commissioning workflow" /><div className="mt-6"><Checklist items={service.process} /></div></div>
      </section>
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <SectionHeader title="Designed for rural and business connectivity" body="Useful for farms, lodges, schools, clinics, churches, homes and businesses that need dependable internet where traditional providers are limited." />
        </div>
      </section>
      <CTASection />
    </PageShell>
  );
}
