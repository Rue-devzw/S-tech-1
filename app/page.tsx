import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageShell } from "@/components/site-shell";
import { CTASection, HeroSection, SectionHeader, ServiceCard, TestimonialGrid } from "@/components/public-sections";
import { audienceSegments, createdBrands, projects, publicServices, serviceHighlights, testimonials, trustStats, workScenes } from "@/lib/public-content";
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

      <section className="bg-ink text-white">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <SectionHeader tone="dark" eyebrow="Work in motion" title="Real service environments, not abstract promises" body="From careful diagnostics to field installs and digital builds, OmniTech treats every job as practical work that needs evidence, handover and support." />
          <div className="mt-8 grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
            {workScenes.map((scene, index) => (
              <figure key={scene.title} className={`group relative min-h-72 overflow-hidden rounded-lg border border-white/12 bg-white/10 shadow-lift ${index === 0 ? "md:row-span-2 md:min-h-[34rem]" : ""}`}>
                <img src={scene.imageSrc} alt={scene.imageAlt} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/82 via-ink/20 to-transparent" />
                <figcaption className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-copper">{scene.label}</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">{scene.title}</h3>
                </figcaption>
              </figure>
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

      <section className="border-y border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <SectionHeader eyebrow="Brands created" title="Real websites and apps we have launched" />
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {createdBrands.map((brand) => (
              <a key={brand.href} href={brand.href} className="group omni-card rounded-lg p-5 transition hover:-translate-y-0.5 hover:border-teal/40 hover:shadow-lift">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-4">
                    <span className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-md border border-line bg-white p-2 shadow-sm">
                      <img src={brand.logoSrc} alt={`${brand.name} logo`} className="max-h-full max-w-full object-contain" />
                    </span>
                    <span className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-copper">{brand.type}</p>
                    <h3 className="mt-2 text-2xl font-semibold text-ink">{brand.name}</h3>
                    <p className="mt-2 text-sm font-semibold text-slate-500">{brand.domain}</p>
                    </span>
                  </div>
                  <span className="grid size-10 shrink-0 place-items-center rounded-md bg-cloud text-teal transition group-hover:bg-teal group-hover:text-white">
                    <ArrowRight size={18} />
                  </span>
                </div>
              </a>
            ))}
          </div>
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
