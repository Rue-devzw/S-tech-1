import type { Metadata } from "next";
import { PageShell } from "@/components/site-shell";
import { CTASection, SectionHeader, ServiceCard } from "@/components/public-sections";
import { publicServices } from "@/lib/public-content";
import { breadcrumbJsonLd, makeMetadata, organizationJsonLd } from "@/lib/seo";

export const metadata: Metadata = makeMetadata({
  title: "Technology Services in Zimbabwe",
  description: "Explore OmniTech services: electronics repairs, ICT support, networking, Starlink installations, web development, software and AI automation.",
  path: "/services",
  keywords: ["technology services Zimbabwe", "ICT services Harare", "electronics repairs", "Starlink installation"]
});

export default function ServicesPage() {
  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([organizationJsonLd(), breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }])]) }} />
      <section className="mx-auto max-w-7xl px-4 py-14">
        <SectionHeader
          eyebrow="Services"
          title="Repair, connectivity, software and automation services"
          body="Choose the service lane that matches your immediate need. OmniTech can support once-off requests, field visits, structured projects and ongoing maintenance."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {publicServices.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </section>
      <CTASection />
    </PageShell>
  );
}
