import type { Metadata } from "next";
import { Globe2, Target, Users } from "lucide-react";
import { MainNav } from "@/components/layout/main-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "About",
  description:
    "Learn how S-Tech Studios turns real projects into clear, modern digital experiences from Harare.",
  path: "/about",
});

const PRINCIPLES = [
  {
    icon: Target,
    title: "Work that feels real",
    description:
      "We care about whether the final site or platform actually reflects the work behind it, not just whether it looks polished in isolation.",
  },
  {
    icon: Users,
    title: "Built with people in mind",
    description:
      "Every project is shaped around the audience that will use it, from first-time visitors on mobile to returning clients looking for clarity.",
  },
  {
    icon: Globe2,
    title: "Harare roots, modern delivery",
    description:
      "We build from a local context while aiming for clean execution, responsive interfaces, and maintainable handoff standards.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <MainNav />

      <main id="main-content">
        <section className="bg-white py-16 md:py-20">
          <div className="container mx-auto px-4">
            <Badge className="border-none bg-cyan-100 text-cyan-700">
              About S-Tech Studios
            </Badge>
            <h1 className="mt-4 max-w-3xl text-4xl font-headline font-semibold leading-tight text-slate-900 md:text-5xl">
              We are a Harare-based studio focused on turning real work into
              clear digital experiences.
            </h1>
            <p className="mt-5 max-w-2xl text-slate-600">
              S-Tech Studios helps brands, agencies, and organizations present
              what they do with more clarity through modern websites, structured
              content, and practical frontend builds.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-10 md:py-14">
          <div className="grid gap-6 md:grid-cols-3">
            {PRINCIPLES.map((principle) => (
              <Card key={principle.title} className="border-slate-200">
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700">
                    <principle.icon className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-headline font-semibold text-slate-900">
                    {principle.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {principle.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 pb-16 md:pb-24">
          <div className="rounded-3xl border border-slate-200 bg-slate-900 p-8 text-white md:p-10">
            <h2 className="text-3xl font-headline font-semibold">
              What to expect when working with us
            </h2>
            <div className="mt-6 grid gap-4 text-sm text-slate-300 md:grid-cols-2">
              <p>
                1. We start with the story, structure, and audience the project
                needs to serve.
              </p>
              <p>
                2. We shape the layout and content flow before polishing the
                final build.
              </p>
              <p>
                3. Responsive implementation keeps the experience usable across
                phones, tablets, and desktop screens.
              </p>
              <p>
                4. The finished project stays maintainable so it can keep
                growing after launch.
              </p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
