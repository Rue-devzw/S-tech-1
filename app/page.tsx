import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageShell } from "@/components/site-shell";
import { CTASection, HeroSection, SectionHeader, ServiceCard, TestimonialGrid } from "@/components/public-sections";
import { audienceSegments, projects, publicServices, serviceHighlights, testimonials, trustStats } from "@/lib/public-content";
import { breadcrumbJsonLd, makeMetadata, organizationJsonLd, websiteJsonLd } from "@/lib/seo";

export const metadata: Metadata = makeMetadata({
  title: "Technology Repairs, Connectivity, Software and AI Automation",
  description:
    "OmniTech Solutions repairs electronics, connects homes and businesses, installs Starlink and networks, builds websites and software, and automates workflows with AI.",
  path: "/",
  keywords: ["technology services Harare", "electronics repairs", "Starlink installers", "business automation"]
});

export default function HomePage() {
  const jsonLd = [organizationJsonLd(), websiteJsonLd(), breadcrumbJsonLd([{ name: "Home", path: "/" }])];

  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HeroSection
        eyebrow="Modern technology services"
        title="OmniTech Solutions"
        body="A full-spectrum technology company for electronics repairs, ICT support, networking, Starlink installations, web development, software engineering and AI automation."
      />

      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-3 md:grid-cols-4">
          {trustStats.map((stat, index) => (
            <div key={stat.label} className="status-burst omni-card rounded-lg p-5">
              <span className={`mb-4 block h-1.5 w-12 rounded-full ${index === 0 ? "bg-teal" : index === 1 ? "bg-copper" : index === 2 ? "bg-sky" : "bg-violet"}`} />
              <p className="text-sm text-slate-500">{stat.label}</p>
              <p className="mt-2 text-2xl font-semibold text-ink">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <SectionHeader
          eyebrow="Services"
          title="One partner for repair, connectivity, building and automation"
          body="OmniTech serves walk-in customers, homes, schools, churches, farms, lodges, clinics, SMEs and corporate teams with practical technology support."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {publicServices.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </section>

      <section className="bg-mesh-radial">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <SectionHeader eyebrow="How we work" title="Structured service, clear communication" />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {serviceHighlights.map((item, index) => (
              <article key={item.title} className="omni-card rounded-lg p-5">
                <span className={`mb-4 grid size-10 place-items-center rounded-md text-sm font-bold text-white ${index === 0 ? "bg-copper" : index === 1 ? "bg-teal" : "bg-violet"}`}>{index + 1}</span>
                <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {audienceSegments.map((segment) => (
              <span key={segment} className="omni-chip rounded-full px-3 py-1 text-sm font-semibold text-slate-700">
                {segment}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeader eyebrow="Project highlights" title="Built for real operational environments" />
          <Link href="/portfolio" className="inline-flex items-center gap-2 text-sm font-semibold text-teal">
            View portfolio
            <ArrowRight size={16} />
          </Link>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {projects.map((project) => (
            <article key={project.title} className="omni-card rounded-lg p-5">
              <p className="text-sm font-semibold text-copper">{project.category}</p>
              <h3 className="mt-2 text-xl font-semibold text-ink">{project.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{project.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <SectionHeader eyebrow="Testimonials" title="Trusted by people who need technology to work" />
          <div className="mt-8">
            <TestimonialGrid testimonials={testimonials} />
          </div>
        </div>
      </section>

      <CTASection />
    </PageShell>
  );
}
