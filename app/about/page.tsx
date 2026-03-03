import { Globe2, Target, Users } from "lucide-react";
import { MainNav } from "@/components/layout/main-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const PRINCIPLES = [
  {
    icon: Target,
    title: "Outcome-focused",
    description: "We treat every engagement as a business performance problem, not just a code delivery task.",
  },
  {
    icon: Users,
    title: "Execution partners",
    description: "Our teams collaborate deeply with clients and transfer capabilities, not dependency.",
  },
  {
    icon: Globe2,
    title: "African context, global quality",
    description: "We build for real market constraints while maintaining international engineering standards.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <MainNav />

      <main>
        <section className="bg-white py-16 md:py-20">
          <div className="container mx-auto px-4">
            <Badge className="border-none bg-cyan-100 text-cyan-700">About S-Tech Studios</Badge>
            <h1 className="mt-4 max-w-3xl text-4xl font-headline font-semibold leading-tight text-slate-900 md:text-5xl">
              We build resilient digital products for teams that care about quality and momentum.
            </h1>
            <p className="mt-5 max-w-2xl text-slate-600">
              Founded in Harare, S-Tech Studios helps organizations design and deliver modern platforms, data systems, and customer-facing products with clear execution standards and measurable outcomes.
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
                  <h2 className="text-xl font-headline font-semibold text-slate-900">{principle.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{principle.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 pb-16 md:pb-24">
          <div className="rounded-3xl border border-slate-200 bg-slate-900 p-8 text-white md:p-10">
            <h2 className="text-3xl font-headline font-semibold">What to expect when working with us</h2>
            <div className="mt-6 grid gap-4 text-sm text-slate-300 md:grid-cols-2">
              <p>1. Discovery and architecture planning tied to concrete metrics.</p>
              <p>2. Transparent sprint delivery with weekly demos and risk logs.</p>
              <p>3. Security and quality gates integrated into each release cycle.</p>
              <p>4. Operational handover with documentation and team enablement.</p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
