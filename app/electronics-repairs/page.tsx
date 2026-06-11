import type { Metadata } from "next";
import { PageShell } from "@/components/site-shell";
import { CTASection, Checklist, HeroSection, SectionHeader } from "@/components/public-sections";
import { publicServices, repairTypes } from "@/lib/public-content";
import { breadcrumbJsonLd, makeMetadata, serviceJsonLd } from "@/lib/seo";

const service = publicServices.find((item) => item.slug === "electronics-repairs")!;

export const metadata: Metadata = makeMetadata({
  title: "Electronics Repairs in Harare",
  description: "Phone, tablet, laptop, PC, TV and electronics repairs with diagnostics, quotes, receipts and warranty-ready records from OmniTech Solutions.",
  path: "/electronics-repairs",
  keywords: ["electronics repairs Harare", "phone repairs Harare", "laptop repairs Zimbabwe", "TV repairs"]
});

export default function ElectronicsRepairsPage() {
  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([serviceJsonLd(service.slug), breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }, { name: service.title, path: `/${service.slug}` }])]) }} />
      <HeroSection eyebrow={service.eyebrow} title={service.title} body={service.description} primaryLabel={service.cta} visualImage={service.imageSrc} visualAlt={service.imageAlt} visualCaption={service.visualNote} />
      <section className="mx-auto max-w-7xl px-4 py-12">
        <SectionHeader title="Repair services with structure and accountability" body="From walk-in device intake to final handover, OmniTech keeps the process clear, documented and practical." />
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {repairTypes.map((item) => {
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
          <div>
            <SectionHeader title="Typical outcomes" />
            <div className="mt-6"><Checklist items={service.outcomes} /></div>
          </div>
          <div>
            <SectionHeader title="Repair process" />
            <div className="mt-6"><Checklist items={service.process} /></div>
          </div>
        </div>
      </section>
      <CTASection />
    </PageShell>
  );
}
