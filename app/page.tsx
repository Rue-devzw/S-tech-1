import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Code2,
  Database,
  MapPin,
  Quote,
  Sparkles,
  Star,
  Workflow,
} from "lucide-react";
import { MainNav } from "@/components/layout/main-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { AnalyticsTracker } from "@/components/analytics/analytics-tracker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createCanonicalUrl, createPageMetadata } from "@/lib/site-metadata";
import { getListings } from "@/lib/server/data-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createPageMetadata({
  title: "Websites, Platforms, and Mobile Products",
  description:
    "S-Tech Studios is a Harare-based digital studio creating premium websites, service platforms, and mobile products including Valley Farm Secrets, Mussyconsultation Agency, and AFC Hymns Collection.",
  path: "/",
  keywords: [
    "web design Harare Zimbabwe",
    "frontend developer Zimbabwe",
    "website design portfolio Harare",
    "agency website design Zimbabwe",
    "mobile app portfolio Zimbabwe",
    "Valley Farm Secrets website",
    "Mussy Consultancy website",
    "AFC Hymns Collection app",
  ],
});

const VALUE_POINTS = [
  {
    icon: Code2,
    title: "Brand and portfolio websites",
    description:
      "Clean, story-led websites that help a brand feel credible, easier to understand, and stronger at first glance.",
  },
  {
    icon: Workflow,
    title: "Agency and service platforms",
    description:
      "Service-focused digital experiences that move from positioning and trust to inquiry and action without wasted friction.",
  },
  {
    icon: Database,
    title: "Mobile apps and digital collections",
    description:
      "Readable, structured experiences for hymn collections, archives, and lightweight mobile products that need clarity and access.",
  },
];

const ENGAGEMENT_MODELS = [
  {
    name: "Project Discovery",
    timeline: "Clarity first",
    summary:
      "We define the structure, audience, and direction before moving into the build.",
    cta: "Start a conversation",
    bullets: [
      "Content and section planning",
      "Visual direction and priorities",
      "Recommended build approach",
    ],
  },
  {
    name: "Website Build",
    timeline: "Design to launch",
    summary:
      "End-to-end frontend and content presentation work for a polished public-facing experience.",
    cta: "Browse the work",
    bullets: [
      "Responsive design and implementation",
      "Clear calls to action",
      "Maintainable handoff",
    ],
    featured: true,
  },
  {
    name: "Content Expansion",
    timeline: "Grow over time",
    summary:
      "A good fit when the first version needs to become a larger collection, archive, or service platform later.",
    cta: "Talk about your idea",
    bullets: [
      "Collection and archive structure",
      "New sections and refinements",
      "Planned future updates",
    ],
  },
];

const HERO_PROJECTS = [
  {
    name: "Valley Farm Secrets",
    eyebrow: "Freshness. Quality. Convenience.",
    description:
      "Farm-fresh produce, wholesale enquiries, online store access, and community partnership surfaced from the first screen.",
    imageUrl: "/images/dev-project-2.webp",
    href: "/listing/st-001",
  },
  {
    name: "Mussyconsultation Agency",
    eyebrow: "Trusted study abroad partner since 2012",
    description:
      "A consultancy homepage built around confidence, destinations, proof metrics, and guided advisor conversations.",
    imageUrl: "/images/dev-project-1.webp",
    href: "/listing/st-002",
  },
  {
    name: "AFC Hymns Collection",
    eyebrow: "Offline hymnbooks for everyday access",
    description:
      "A lightweight Android app centered on readable hymn access, clearer fonts, and updates when new hymns are added.",
    imageUrl: "/images/dev-project-3.webp",
    href: "/listing/st-003",
  },
];

const PORTFOLIO_METRICS = [
  { value: "3", label: "Live case studies" },
  { value: "2", label: "Public websites" },
  { value: "1", label: "Published Android app" },
  { value: "Harare", label: "Studio base" },
];

const TRUST_SIGNALS = [
  "Built from live websites and a published mobile app",
  "Designed for clarity, trust, and fast understanding",
  "Shaped around real audiences and real service journeys",
];

const FEATURED_CARD_DETAILS: Record<
  string,
  {
    sectionLabel: string;
    sectionTitle: string;
    keyMoments: string[];
  }
> = {
  "st-001": {
    sectionLabel: "Live Site Structure",
    sectionTitle:
      "Our Services, Why Choose Valley Farm Secrets?, and Let’s Make an Impact Together",
    keyMoments: [
      "Leads with farm-fresh produce and a direct Shop Online path",
      "Groups fruit and vegetables, butchery, grocery, wholesale, pre-pack, sourcing, and digital services",
      "Connects supply work to food security, farmer development, and youth employment in Zimbabwe",
    ],
  },
  "st-002": {
    sectionLabel: "Live Site Structure",
    sectionTitle:
      "Your journey, expertly orchestrated, Strategic guidance at every milestone, and A proven journey to your dream campus",
    keyMoments: [
      "Anchors trust with 4,500+ students placed, 120+ partner universities, 98% visa success rate, and $3M in scholarship awards",
      "Moves from counseling and university selection into applications, visas, and pre-departure support",
      "Ends with a consultation-driven acceptance strategy and clear urgency around booking slots",
    ],
  },
  "st-003": {
    sectionLabel: "Play Store Positioning",
    sectionTitle: "About this app, What’s new, and Data safety",
    keyMoments: [
      "Describes the app as an offline version of AFC SEAR hymnbook collections",
      "Highlights clearer reading through an improved offline font library",
      "Reinforces trust with no data shared and no data collected on the Play listing",
    ],
  },
};

const FAQS = [
  {
    question: "What kind of projects does S-Tech Studios build?",
    answer:
      "S-Tech Studios focuses on premium websites, agency and service platforms, and lightweight mobile or content-rich digital experiences.",
  },
  {
    question: "Is S-Tech Studios based in Harare, Zimbabwe?",
    answer:
      "Yes. The studio is based in Harare and works on digital products intended for local and international audiences.",
  },
  {
    question: "Can I hire S-Tech Studios for a business website or portfolio redesign?",
    answer:
      "Yes. Projects can start with discovery, a full website build, or an expansion pass for an existing site or collection.",
  },
];

export default async function HomePage() {
  const listings = await getListings();
  const featuredListings = listings.filter((item) => item.featured).slice(0, 4);
  const proofListings = featuredListings.slice(0, 3);
  const homeJsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "S-Tech Studios",
      url: createCanonicalUrl("/"),
      description:
        "Harare-based digital studio featuring Valley Farm Secrets, Mussyconsultation Agency, and AFC Hymns Collection.",
      primaryImageOfPage: createCanonicalUrl("/images/hero-image.webp"),
    },
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "S-Tech Studios Portfolio",
      url: createCanonicalUrl("/"),
      about: [
        "Web design portfolio in Harare",
        "Agency website case studies",
        "Mobile app and digital collection projects",
      ],
      mainEntity: {
        "@type": "ItemList",
        itemListElement: featuredListings.map((listing, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: createCanonicalUrl(`/listing/${listing.id}`),
          name: listing.name,
        })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Website design and frontend development",
      provider: {
        "@type": "Organization",
        name: "S-Tech Studios",
      },
      areaServed: ["Zimbabwe", "Africa"],
      serviceType: [
        "Website design",
        "Frontend development",
        "Agency website design",
        "Mobile app and content experience design",
      ],
      url: createCanonicalUrl("/services"),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: createCanonicalUrl("/"),
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQS.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <AnalyticsTracker
        eventType="home_view"
        route="/"
        metadata={{ page: "home" }}
      />
      <MainNav />

      <main id="main-content">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(homeJsonLd),
          }}
        />

        <section className="relative isolate overflow-hidden bg-[linear-gradient(160deg,#020617_0%,#0f172a_38%,#082f49_100%)] pb-20 pt-16 text-white md:pb-28 md:pt-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(45,212,191,0.18),transparent_30%),radial-gradient(circle_at_78%_12%,rgba(56,189,248,0.22),transparent_34%),radial-gradient(circle_at_60%_72%,rgba(250,204,21,0.12),transparent_26%)]" />
          <div className="absolute inset-x-0 top-0 h-px bg-white/15" />
          <div className="container relative mx-auto px-4">
            <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div className="max-w-2xl">
                <Badge className="mb-6 border border-white/10 bg-white/8 text-cyan-100 backdrop-blur">
                  <MapPin className="mr-2 h-3.5 w-3.5" />
                  S-Tech Studios • Harare, Zimbabwe
                </Badge>
                <h1 className="max-w-3xl text-4xl font-headline font-semibold leading-[1.05] tracking-tight md:text-6xl">
                  Digital experiences that feel sharp, trusted, and ready for
                  real use.
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
                  S-Tech Studios creates polished websites, service platforms,
                  and mobile products for brands, agencies, and organizations
                  that need a stronger digital presence and a clearer path from
                  attention to action.
                </p>

                <div className="mt-8 flex w-full max-w-xl flex-col gap-3 sm:flex-row">
                  <Button
                    asChild
                    className="h-12 bg-cyan-400 px-6 text-slate-950 hover:bg-cyan-300"
                  >
                    <Link href="/contact">
                      Start a project
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="h-12 border-white/15 bg-white/5 px-6 text-white hover:bg-white/10"
                  >
                    <Link href="/store">Browse the work</Link>
                  </Button>
                </div>

                <div className="mt-10 grid gap-3 sm:grid-cols-2">
                  {TRUST_SIGNALS.map((signal) => (
                    <div
                      key={signal}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 backdrop-blur"
                    >
                      <span className="inline-flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                        {signal}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-10 grid gap-3 sm:grid-cols-4">
                  {PORTFOLIO_METRICS.map((metric) => (
                    <div
                      key={metric.label}
                      className="rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-4 backdrop-blur"
                    >
                      <p className="text-2xl font-headline font-semibold text-white">
                        {metric.value}
                      </p>
                      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400">
                        {metric.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-10 top-8 hidden h-32 w-32 rounded-full bg-cyan-400/20 blur-3xl lg:block" />
                <div className="absolute -right-6 bottom-10 hidden h-28 w-28 rounded-full bg-amber-300/15 blur-3xl lg:block" />
                <div className="relative rounded-[2rem] border border-white/10 bg-white/6 p-4 shadow-[0_30px_120px_rgba(2,6,23,0.45)] backdrop-blur-xl md:p-5">
                  <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">
                          Selected Work
                        </p>
                        <p className="mt-1 text-sm text-slate-300">
                          Real products, live launches, and refined digital
                          presentation
                        </p>
                      </div>
                      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                        <Star className="h-3.5 w-3.5 text-amber-300" />
                        Live projects
                      </div>
                    </div>

                    <div className="mt-5 grid gap-4">
                      {HERO_PROJECTS.map((project, index) => (
                        <Link
                          key={project.name}
                          href={project.href}
                          className="group grid gap-4 rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-4 transition hover:border-cyan-300/40 hover:bg-white/[0.07] md:grid-cols-[112px_1fr]"
                        >
                          <div className="relative h-28 overflow-hidden rounded-2xl border border-white/10">
                            <Image
                              src={project.imageUrl}
                              alt={`${project.name} project preview`}
                              fill
                              className="object-cover transition duration-500 group-hover:scale-105"
                              sizes="112px"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
                            <span className="absolute left-3 top-3 rounded-full bg-black/45 px-2 py-1 text-[11px] uppercase tracking-[0.16em] text-slate-100">
                              0{index + 1}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">
                              {project.eyebrow}
                            </p>
                            <h2 className="mt-2 text-xl font-headline font-semibold text-white">
                              {project.name}
                            </h2>
                            <p className="mt-2 text-sm leading-6 text-slate-300">
                              {project.description}
                            </p>
                            <p className="mt-3 inline-flex items-center text-sm font-medium text-white">
                              View case study
                              <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" />
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-b border-slate-200 bg-white py-14">
          <div className="absolute inset-x-0 top-0 h-full bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.07),transparent_50%)]" />
          <div className="container relative mx-auto px-4">
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-cyan-700">
                  Why People Stay
                </p>
                <h2 className="mt-2 max-w-2xl text-3xl font-headline font-semibold text-slate-900">
                  Clear stories, stronger trust, and interfaces that make the
                  next step feel natural.
                </h2>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  {
                    title: "Clear first impression",
                    description:
                      "The offer becomes understandable quickly, without burying the visitor in noise.",
                  },
                  {
                    title: "Stronger conversion flow",
                    description:
                      "Navigation, section order, and calls to action work together instead of competing.",
                  },
                  {
                    title: "Built to last",
                    description:
                      "The structure stays usable and easy to extend as content, services, or products grow.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm"
                  >
                    <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
                      {item.title}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {proofListings.length > 0 ? (
          <section className="container mx-auto px-4 py-16 md:py-20">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-cyan-700">
                  Proof In Practice
                </p>
                <h2 className="mt-2 text-3xl font-headline font-semibold text-slate-900">
                  Website and app case studies grounded in real product
                  structure
                </h2>
                <p className="mt-3 max-w-2xl text-slate-600">
                  These featured projects connect the homepage visuals to real
                  delivery work: business web design, agency UX, and a published
                  Android app with practical usability goals.
                </p>
              </div>
              <Link href="/store">
                <Button variant="outline" className="border-slate-300">
                  Browse all work
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="mb-8 flex flex-wrap gap-2">
              {Array.from(new Set(proofListings.map((listing) => listing.industry))).map(
                (industry) => (
                  <span
                    key={industry}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-600"
                  >
                    {industry}
                  </span>
                )
              )}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {proofListings.map((listing) => (
                <article
                  key={listing.id}
                  className="overflow-hidden rounded-[1.9rem] border border-slate-200 bg-white shadow-[0_18px_65px_rgba(15,23,42,0.08)]"
                >
                  <div className="relative aspect-[16/10] border-b border-slate-200">
                    <Image
                      src={listing.imageUrl}
                      alt={`${listing.name} project cover`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
                    <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-[0.14em]">
                      <span className="rounded-full bg-white/90 px-2.5 py-1 text-slate-900">
                        {listing.industry}
                      </span>
                      <span className="rounded-full bg-black/35 px-2.5 py-1 text-slate-100">
                        {listing.deliveryTimeline}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-sm font-medium text-cyan-200">
                        {listing.client}
                      </p>
                      <h3 className="mt-1 text-2xl font-headline font-semibold text-white">
                        {listing.name}
                      </h3>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        {FEATURED_CARD_DETAILS[listing.id]?.sectionLabel ??
                          "Live structure"}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-slate-700">
                        {FEATURED_CARD_DETAILS[listing.id]?.sectionTitle ??
                          listing.shortDescription}
                      </p>
                    </div>

                    <div className="mt-4 space-y-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                          What the experience leads with
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-slate-600">
                          {listing.approach ?? listing.description}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                          Specific live-page signals
                        </p>
                        <div className="mt-3 space-y-2">
                          {(FEATURED_CARD_DETAILS[listing.id]?.keyMoments ??
                            listing.features.slice(0, 3)
                          ).map((item) => (
                            <p
                              key={item}
                              className="flex items-start gap-2 text-sm text-slate-600"
                            >
                              <Quote className="mt-0.5 h-4 w-4 shrink-0 text-cyan-700" />
                              {item}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        What changed
                      </p>
                      <div className="mt-3 space-y-2">
                        {listing.outcomes.slice(0, 2).map((outcome) => (
                          <p
                            key={outcome}
                            className="flex items-start gap-2 text-sm text-slate-600"
                          >
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-700" />
                            {outcome}
                          </p>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {listing.technologies.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="mt-6">
                      <Button
                        asChild
                        variant="outline"
                        className="border-slate-300"
                      >
                        <Link href={`/listing/${listing.id}`}>
                          View case details
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <section className="border-y border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,252,0.96))] py-16">
          <div className="container mx-auto mb-8 px-4">
            <div className="max-w-3xl">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-cyan-700">
                What We Build
              </p>
              <h2 className="mt-2 text-3xl font-headline font-semibold text-slate-900">
                Digital products that look polished and feel easy to trust.
              </h2>
              <p className="mt-3 text-slate-600">
                The strongest work combines visual confidence, clean structure,
                and messaging that helps people understand what matters without
                working for it.
              </p>
            </div>
          </div>
          <div className="container mx-auto grid gap-6 px-4 md:grid-cols-3">
            {VALUE_POINTS.map((point) => (
              <div
                key={point.title}
                className="rounded-[1.7rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)]"
              >
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700">
                  <point.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-headline font-semibold text-slate-900">
                  {point.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {point.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 py-16 md:py-20">
          <div className="mb-8 text-center">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-cyan-700">
              Engagement Model
            </p>
            <h2 className="mt-2 text-3xl font-headline font-semibold text-slate-900">
              Start with the path that fits your project
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-600">
              Some projects need initial direction, some need a full website
              build, and some need a flexible structure that can expand later.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {ENGAGEMENT_MODELS.map((plan) => (
              <div
                key={plan.name}
                className={
                  plan.featured
                    ? "rounded-[1.7rem] border border-cyan-300 bg-cyan-50 p-6 shadow-lg shadow-cyan-900/10"
                    : "rounded-[1.7rem] border border-slate-200 bg-white p-6 shadow-sm"
                }
              >
                <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs uppercase tracking-[0.14em] text-cyan-700">
                  <Sparkles className="h-3.5 w-3.5" />
                  {plan.timeline}
                </div>
                <h3 className="mt-4 text-xl font-headline font-semibold text-slate-900">
                  {plan.name}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {plan.summary}
                </p>
                <div className="mt-5 space-y-2 text-sm text-slate-600">
                  {plan.bullets.map((bullet) => (
                    <p key={bullet} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-700" />
                      {bullet}
                    </p>
                  ))}
                </div>
                <Button
                  className={
                    plan.featured
                      ? "mt-6 w-full bg-slate-900 text-white hover:bg-slate-800"
                      : "mt-6 w-full bg-cyan-400 text-slate-950 hover:bg-cyan-300"
                  }
                  asChild
                >
                  {plan.name === "Project Discovery" ? (
                    <Link href="/contact?topic=strategy">{plan.cta}</Link>
                  ) : (
                    <Link
                      href={plan.name === "Website Build" ? "/store" : "/contact"}
                    >
                      {plan.cta}
                    </Link>
                  )}
                </Button>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-slate-200 bg-slate-950 py-16 text-white">
          <div className="container mx-auto px-4">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-cyan-300">
                  Working Style
                </p>
                <h2 className="mt-2 text-3xl font-headline font-semibold">
                  Practical, structured delivery from first direction to final
                  launch.
                </h2>
                <p className="mt-4 max-w-xl text-slate-300">
                  Projects are shaped around the audience, the content, and the
                  decision path the product needs to support. The result is
                  work that feels composed, confident, and ready for use.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  {
                    title: "Direction",
                    detail:
                      "Start by clarifying the structure, audience, and message before polishing the interface.",
                  },
                  {
                    title: "Execution",
                    detail:
                      "Move into responsive layouts, visual hierarchy, and frontend implementation with fewer weak spots.",
                  },
                  {
                    title: "Growth",
                    detail:
                      "Leave behind a foundation that can support more content, more features, and future refinement.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-white/10 bg-white/5 p-5"
                  >
                    <p className="text-sm font-semibold uppercase tracking-[0.14em] text-cyan-200">
                      {item.title}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16 md:py-20">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-cyan-700">
              Frequently Asked Questions
            </p>
            <h2 className="mt-2 text-3xl font-headline font-semibold text-slate-900">
              Common questions about the studio and the kinds of projects we
              take on.
            </h2>
          </div>
          <div className="mx-auto mt-10 grid max-w-4xl gap-4">
            {FAQS.map((faq) => (
              <article
                key={faq.question}
                className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h3 className="text-lg font-headline font-semibold text-slate-900">
                  {faq.question}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {faq.answer}
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
