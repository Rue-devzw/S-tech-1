import type { Metadata } from "next";
import { PageShell } from "@/components/site-shell";
import { CTASection, Checklist, HeroSection, SectionHeader } from "@/components/public-sections";
import { ictSupportItems, publicServices } from "@/lib/public-content";
import { breadcrumbJsonLd, makeMetadata, serviceJsonLd } from "@/lib/seo";

const service = publicServices.find((item) => item.slug === "ict-support")!;

export const metadata: Metadata = makeMetadata({
  title: "ICT Support for Homes and Organisations",
  description: "ICT support for homes, schools, churches, clinics, farms, lodges, SMEs and corporate teams in Zimbabwe.",
  path: "/ict-support",
  keywords: ["ICT support Zimbabwe", "IT support Harare", "computer support", "business ICT maintenance"]
});

export default function IctSupportPage() {
  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([serviceJsonLd(service.slug), breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }, { name: service.title, path: `/${service.slug}` }])]) }} />
      <HeroSection eyebrow={service.eyebrow} title={service.title} body={service.description} primaryLabel={service.cta} visualImage={service.imageSrc} visualAlt={service.imageAlt} visualCaption={service.visualNote} />
      <section className="mx-auto max-w-7xl px-4 py-12">
        <SectionHeader title="Support that keeps everyday technology moving" body="OmniTech helps teams reduce downtime, clean up recurring issues and maintain essential devices and systems." />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {ictSupportItems.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="rounded-lg border border-line bg-white p-5">
                <Icon className="text-teal" size={24} />
                <h2 className="mt-4 text-lg font-semibold text-ink">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
              </article>
            );
          })}
        </div>
      </section>
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-2">
          <div><SectionHeader title="What we support" /><div className="mt-6"><Checklist items={service.outcomes} /></div></div>
          <div><SectionHeader title="How support works" /><div className="mt-6"><Checklist items={service.process} /></div></div>
        </div>
      </section>
      <CTASection />
    </PageShell>
  );
}
