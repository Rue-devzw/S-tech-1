import Link from "next/link";
import { ArrowRight, CheckCircle2, Code2, Database, Shield, Workflow } from "lucide-react";
import { MainNav } from "@/components/layout/main-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SERVICES = [
  {
    icon: Code2,
    title: "Product Engineering",
    description: "Design and build full-stack products with robust architecture, QA, and production reliability.",
    bullets: ["Architecture and tech strategy", "Modern web app delivery", "CI/CD and observability"],
  },
  {
    icon: Shield,
    title: "Security Engineering",
    description: "Proactive security audits, app hardening, and threat-informed controls for modern products.",
    bullets: ["Vulnerability triage", "Policy and access controls", "Incident readiness playbooks"],
  },
  {
    icon: Workflow,
    title: "Automation and AI",
    description: "Deploy automation and AI workflows to remove operational bottlenecks and improve decision speed.",
    bullets: ["Workflow orchestration", "Model-assisted operations", "Human-in-the-loop safeguards"],
  },
  {
    icon: Database,
    title: "Data Platforms",
    description: "Build high-trust analytics systems that unify business data and power executive insights.",
    bullets: ["Data modeling", "ETL pipelines", "Executive dashboarding"],
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <MainNav />

      <main>
        <section className="bg-slate-950 py-20 text-white">
          <div className="container mx-auto px-4 text-center">
            <Badge className="border-none bg-cyan-400/20 text-cyan-200">Services</Badge>
            <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-headline font-semibold leading-tight md:text-5xl">
              End-to-end services for teams shipping high-impact digital products.
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-slate-300">
              Our engagement model combines product thinking, technical depth, and operational rigor to help businesses scale confidently.
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
                  <CardTitle className="font-headline text-2xl">{service.title}</CardTitle>
                  <p className="text-sm text-slate-600">{service.description}</p>
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
            <h2 className="text-3xl font-headline font-semibold text-slate-900">Need a tailored delivery plan?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-600">
              We can scope your project, map milestones, and provide a fixed execution roadmap aligned with your team capacity.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button asChild className="bg-slate-900 text-white hover:bg-slate-800">
                <a href="mailto:hello@s-tech.africa">Book a strategy call</a>
              </Button>
              <Button asChild variant="outline" className="border-slate-300">
                <Link href="/store">
                  Browse Store
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
