import type { Metadata } from "next";
import { PageShell } from "@/components/site-shell";
import { CTASection, Checklist, HeroSection, SectionHeader } from "@/components/public-sections";
import { publicServices } from "@/lib/public-content";
import { breadcrumbJsonLd, makeMetadata, serviceJsonLd } from "@/lib/seo";

const service = publicServices.find((item) => item.slug === "networking")!;

export const metadata: Metadata = makeMetadata({
  title: "Networking, Wi-Fi and Structured Cabling",
  description: "Network infrastructure, Wi-Fi coverage, routers, switching, structured cabling and network maintenance services from OmniTech Solutions.",
  path: "/networking",
  keywords: ["networking services Harare", "Wi-Fi installation Zimbabwe", "structured cabling", "router configuration"]
});

export default function NetworkingPage() {
  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([serviceJsonLd(service.slug), breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }, { name: service.title, path: `/${service.slug}` }])]) }} />
      <HeroSection eyebrow={service.eyebrow} title={service.title} body={service.description} primaryLabel={service.cta} />
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-2">
        <div><SectionHeader title="Networking outcomes" body="Good networks are planned, labelled, tested and documented." /><div className="mt-6"><Checklist items={service.outcomes} /></div></div>
        <div><SectionHeader title="Implementation process" /><div className="mt-6"><Checklist items={service.process} /></div></div>
      </section>
      <CTASection />
    </PageShell>
  );
}
