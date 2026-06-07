import type { Metadata } from "next";
import { PageShell } from "@/components/site-shell";
import { ImageLoadingPlaceholder } from "@/components/brand-loader";
import { CTASection, SectionHeader, TestimonialGrid } from "@/components/public-sections";
import { projects as fallbackProjects, testimonials as fallbackTestimonials } from "@/lib/public-content";
import { breadcrumbJsonLd, makeMetadata, organizationJsonLd } from "@/lib/seo";
import { hasDatabaseUrl } from "@/server/env";
import { listPublishedPortfolioProjects, listPublishedTestimonials } from "@/server/services/portfolio-module";

export const dynamic = "force-dynamic";

export const metadata: Metadata = makeMetadata({
  title: "Technology Project Portfolio",
  description: "Project highlights from OmniTech Solutions across electronics repairs, Starlink, ICT support, networking, websites, software and AI automation.",
  path: "/portfolio",
  keywords: ["technology portfolio Zimbabwe", "Starlink project examples", "ICT support case studies", "software projects Zimbabwe"]
});

const fallbackImages = [
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80"
];

function label(value: string) {
  return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
}

async function getPortfolioContent() {
  if (!hasDatabaseUrl()) return { projects: [], testimonials: [] };

  try {
    const [projects, testimonials] = await Promise.all([listPublishedPortfolioProjects(), listPublishedTestimonials()]);
    if (projects.length) return { projects, testimonials };
  } catch {
    return { projects: [], testimonials: [] };
  }
  return { projects: [], testimonials: [] };
}

export default async function PortfolioPage() {
  const { projects, testimonials } = await getPortfolioContent();
  const publicProjects = projects.length
    ? projects
    : fallbackProjects.map((project, index) => ({
        id: project.title,
        title: project.title,
        category: project.category.toUpperCase().replaceAll(" ", "_"),
        clientName: null,
        clientSector: index === 0 ? "Hospitality" : index === 1 ? "Education" : "SME",
        summary: project.summary,
        challenge: "Manual, unreliable or undocumented technology workflows were slowing the organisation down.",
        solution: "OmniTech delivered a practical technical solution with clear communication, handover notes and support readiness.",
        toolsUsed: index === 0 ? ["Starlink", "Wi-Fi planning", "Installation checklist"] : index === 1 ? ["Diagnostics", "Networking", "ICT support"] : ["Next.js", "Prisma", "Automation"],
        outcome: "A cleaner, more reliable technology setup that the client can understand, maintain and grow.",
        imageUrl: fallbackImages[index % fallbackImages.length],
        beforeImageUrls: [],
        afterImageUrls: [],
        visibility: "ANONYMIZED",
        showClientName: false,
        testimonials: []
      }));

  const publicTestimonials = testimonials.length
    ? testimonials.map((testimonial) => ({
        quote: testimonial.quote,
        name: testimonial.privacyLabel || testimonial.name,
        company: testimonial.company || testimonial.clientSector || "OmniTech client"
      }))
    : fallbackTestimonials;

  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([organizationJsonLd(), breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Portfolio", path: "/portfolio" }])]) }} />
      <section className="mx-auto max-w-7xl px-4 py-14">
        <SectionHeader
          eyebrow="Portfolio"
          title="Proof of work across repair, connectivity, software and automation"
          body="Selected OmniTech projects are published with privacy controls, clear outcomes and practical context for customers deciding who to trust."
        />
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {publicProjects.map((project, index) => {
            const clientLabel = project.visibility === "PUBLIC" && project.showClientName && project.clientName ? project.clientName : project.clientSector;
            const beforeImage = project.beforeImageUrls[0] ?? project.imageUrl ?? fallbackImages[index % fallbackImages.length];
            const afterImage = project.afterImageUrls[0] ?? project.imageUrl ?? fallbackImages[(index + 1) % fallbackImages.length];
            return (
              <article key={project.id} className="overflow-hidden rounded-lg border border-line bg-white shadow-sm">
                <div className="grid grid-cols-2">
                  <figure className="relative h-40 overflow-hidden bg-cloud">
                    <ImageLoadingPlaceholder label="Loading image" className="absolute inset-0 rounded-none" />
                    <img src={beforeImage ?? fallbackImages[0]} alt={`${project.title} before`} className="relative h-full w-full object-cover" />
                    <figcaption className="absolute left-3 top-3 bg-ink px-2 py-1 text-xs font-semibold text-white">Before</figcaption>
                  </figure>
                  <figure className="relative h-40 overflow-hidden bg-cloud">
                    <ImageLoadingPlaceholder label="Loading image" className="absolute inset-0 rounded-none" />
                    <img src={afterImage ?? fallbackImages[1]} alt={`${project.title} after`} className="relative h-full w-full object-cover" />
                    <figcaption className="absolute left-3 top-3 bg-teal px-2 py-1 text-xs font-semibold text-white">After</figcaption>
                  </figure>
                </div>
                <div className="p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-cloud px-3 py-1 text-xs font-semibold text-teal">{label(project.category)}</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{clientLabel}</span>
                  </div>
                  <h2 className="mt-4 text-xl font-semibold text-ink">{project.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{project.summary}</p>
                  <dl className="mt-4 grid gap-3 text-sm">
                    <div>
                      <dt className="font-semibold text-ink">Challenge</dt>
                      <dd className="mt-1 text-slate-600">{project.challenge}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-ink">Solution</dt>
                      <dd className="mt-1 text-slate-600">{project.solution}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-ink">Outcome</dt>
                      <dd className="mt-1 text-slate-600">{project.outcome}</dd>
                    </div>
                  </dl>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.toolsUsed.slice(0, 5).map((tool) => (
                      <span key={tool} className="rounded-full border border-line px-3 py-1 text-xs font-semibold text-slate-600">{tool}</span>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <SectionHeader eyebrow="Testimonials" title="Customer confidence, published with consent" />
          <div className="mt-8"><TestimonialGrid testimonials={publicTestimonials} /></div>
        </div>
      </section>
      <CTASection />
    </PageShell>
  );
}
