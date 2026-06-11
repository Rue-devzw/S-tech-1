import type { Metadata } from "next";
import { PageShell } from "@/components/site-shell";
import { CTASection, Checklist, HeroSection, SectionHeader } from "@/components/public-sections";
import { publicServices } from "@/lib/public-content";
import { breadcrumbJsonLd, makeMetadata, serviceJsonLd } from "@/lib/seo";

const service = publicServices.find((item) => item.slug === "software-ai-systems")!;

export const metadata: Metadata = makeMetadata({
  title: "Software and AI Automation Systems",
  description: "Custom software, mobile app backends, dashboards, AI assistants and workflow automation systems for Zimbabwean organisations.",
  path: "/software-ai-systems",
  keywords: ["software development Zimbabwe", "AI automation Zimbabwe", "custom dashboards", "workflow automation"]
});

export default function SoftwareAiSystemsPage() {
  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([serviceJsonLd(service.slug), breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }, { name: service.title, path: `/${service.slug}` }])]) }} />
      <HeroSection eyebrow={service.eyebrow} title={service.title} body={service.description} primaryLabel={service.cta} visualImage={service.imageSrc} visualAlt={service.imageAlt} visualCaption={service.visualNote} />
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-2">
        <div><SectionHeader title="Systems we build" /><div className="mt-6"><Checklist items={service.outcomes} /></div></div>
        <div><SectionHeader title="Automation process" /><div className="mt-6"><Checklist items={service.process} /></div></div>
      </section>
      <CTASection />
    </PageShell>
  );
}
