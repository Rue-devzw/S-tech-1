import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Code2,
  Database,
  Shield,
  Workflow,
} from "lucide-react";
import { MainNav } from "@/components/layout/main-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Services",
  description:
    "Explore S-Tech Studios services across portfolio websites, agency platforms, and digital collection builds.",
  path: "/services",
});

const SERVICES = [
  {
    icon: Code2,
    title: "Portfolio Websites",
    description:
      "Design and build polished websites for founders, brands, and growing ventures that need a stronger online presence.",
    bullets: [
      "Homepage and inner-page structure",
      "Responsive frontend implementation",
      "Reusable sections for future updates",
    ],
  },
  {
    icon: Shield,
    title: "Agency Platforms",
    description:
      "Create service-led sites that explain what your agency does clearly and guide visitors toward trust and inquiry.",
    bullets: [
      "Service positioning and page hierarchy",
      "Lead capture and inquiry flows",
      "Professional presentation across devices",
    ],
  },
  {
    icon: Workflow,
    title: "Content and Mobile Collections",
    description:
      "Organize hymns, archives, libraries, or lightweight mobile content experiences into products that are easier to browse and maintain.",
    bullets: [
      "Structured content layouts",
      "Readable mobile-first presentation",
      "Foundations for search and categorization",
    ],
  },
  {
    icon: Database,
    title: "Ongoing Improvements",
    description:
      "Refine the experience after launch with updates, cleanup, and feature additions that fit the project as it grows.",
    bullets: ["Content updates", "UI refinements", "Feature extensions"],
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <MainNav />

      <main id="main-content">
        <section className="bg-slate-950 py-20 text-white">
          <div className="container mx-auto px-4 text-center">
            <Badge className="border-none bg-cyan-400/20 text-cyan-200">
              Services
            </Badge>
            <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-headline font-semibold leading-tight md:text-5xl">
              Services for people who want their real work presented clearly
              online.
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-slate-300">
              We help shape websites, service platforms, and digital
              collections that feel professional, usable, and ready to grow.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-14 md:py-20">
          <div className="grid gap-6 md:grid-cols-2">
            {SERVICES.map((service) => (
              <Card key={service.title} className="border-slate-200">
                <CardHeader>
                  <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700">
                    <service.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="font-headline text-2xl">
                    {service.title}
                  </CardTitle>
                  <p className="text-sm text-slate-600">
                    {service.description}
                  </p>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-slate-600">
                  {service.bullets.map((bullet) => (
                    <p key={bullet} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-700" />
                      {bullet}
                    </p>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm md:p-10">
            <h2 className="text-3xl font-headline font-semibold text-slate-900">
              Need your own project shaped like this?
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-600">
              We can scope the right mix of structure, design, and development
              based on your content, audience, and the kind of experience you
              want people to have.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button
                asChild
                className="bg-slate-900 text-white hover:bg-slate-800"
              >
                <Link href="/contact">
                  Start a project
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-slate-300">
                <Link href="/store">
                  Browse recent work
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
