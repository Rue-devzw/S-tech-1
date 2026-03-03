"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, Search, Shield, Sparkles, TrendingUp } from "lucide-react";
import { MainNav } from "@/components/layout/main-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { ListingCard } from "@/components/marketplace/listing-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useListings } from "@/lib/use-listings";

const VALUE_POINTS = [
  {
    icon: Shield,
    title: "Security by default",
    description: "Threat-aware architecture, clear auditability, and production hardening from day one.",
  },
  {
    icon: TrendingUp,
    title: "Business outcomes",
    description: "Every build is tied to measurable KPI improvements, not just delivery milestones.",
  },
  {
    icon: Sparkles,
    title: "Premium execution",
    description: "Modern interfaces, reliable performance, and high-quality engineering standards.",
  },
];

const PRICING_PLANS = [
  {
    name: "Starter Build",
    price: "$1,200",
    summary: "Best for small teams launching their first production workflow.",
    cta: "Start Starter Plan",
    bullets: ["2-week implementation", "Core dashboard + automation", "30-day post-launch support"],
  },
  {
    name: "Growth Platform",
    price: "$3,500",
    summary: "For scaling teams that need stronger workflows, data, and integrations.",
    cta: "Choose Growth Plan",
    bullets: ["6-week implementation", "Advanced integrations", "Quarterly optimization advisory"],
    featured: true,
  },
  {
    name: "Enterprise Program",
    price: "Custom",
    summary: "For regulated, multi-team environments requiring security and governance.",
    cta: "Book Enterprise Call",
    bullets: ["Phased delivery roadmap", "Security architecture review", "Dedicated technical lead"],
  },
];

export default function HomePage() {
  const { listings } = useListings();
  const router = useRouter();
  const [query, setQuery] = useState("");

  const featuredListings = useMemo(
    () => listings.filter((item) => item.featured).slice(0, 4),
    [listings]
  );

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      router.push("/store");
      return;
    }
    router.push(`/store?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <MainNav />

      <main>
        <section className="relative isolate overflow-hidden bg-slate-950 pb-20 pt-16 text-white md:pb-28 md:pt-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(34,211,238,0.25),transparent_35%),radial-gradient(circle_at_85%_25%,rgba(56,189,248,0.2),transparent_40%)]" />
          <div className="container relative mx-auto px-4">
            <Badge className="mb-6 border-none bg-cyan-400/20 text-cyan-200">Boutique Digital Product Studio</Badge>
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <h1 className="max-w-xl text-4xl font-headline font-semibold leading-tight md:text-6xl">
                  Build market-leading digital products with premium delivery discipline.
                </h1>
                <p className="mt-6 max-w-lg text-slate-300">
                  S-Tech designs and ships secure platforms, AI-powered systems, and polished product experiences for ambitious teams across Africa.
                </p>

                <form onSubmit={submitSearch} className="mt-8 flex w-full max-w-xl flex-col gap-3 sm:flex-row">
                  <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search projects, platforms, and solutions"
                      className="h-12 border-slate-700 bg-slate-900/80 pl-9 text-slate-100 placeholder:text-slate-400"
                    />
                  </div>
                  <Button type="submit" className="h-12 bg-cyan-400 px-6 text-slate-950 hover:bg-cyan-300">
                    Explore Store
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>

                <div className="mt-6 flex flex-wrap gap-6 text-sm text-slate-300">
                  <span className="inline-flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-cyan-300" />
                    Delivery-focused sprint cadence
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-cyan-300" />
                    Enterprise security controls
                  </span>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-300">Current Performance</p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {[
                    ["38", "Active engagements"],
                    ["97%", "Client renewal rate"],
                    ["11", "Countries served"],
                    ["2.3x", "Avg. velocity boost"],
                  ].map(([value, label]) => (
                    <div key={label} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                      <p className="text-2xl font-headline font-semibold text-cyan-300">{value}</p>
                      <p className="mt-1 text-sm text-slate-300">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16 md:py-20">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-cyan-700">Curated Store</p>
              <h2 className="mt-2 text-3xl font-headline font-semibold text-slate-900">Featured production-ready projects</h2>
            </div>
            <Link href="/store">
              <Button variant="outline" className="border-slate-300">
                View full store
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {featuredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white/70 py-16">
          <div className="container mx-auto grid gap-6 px-4 md:grid-cols-3">
            {VALUE_POINTS.map((point) => (
              <div key={point.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700">
                  <point.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-headline font-semibold text-slate-900">{point.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{point.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 py-16 md:py-20">
          <div className="mb-8 text-center">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-cyan-700">Pricing</p>
            <h2 className="mt-2 text-3xl font-headline font-semibold text-slate-900">Clear engagement tiers for faster decisions</h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-600">
              Pick a delivery model that matches your current stage. Every plan includes architecture review and a measurable launch target.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {PRICING_PLANS.map((plan) => (
              <div
                key={plan.name}
                className={
                  plan.featured
                    ? "rounded-2xl border border-cyan-300 bg-cyan-50 p-6 shadow-lg shadow-cyan-900/10"
                    : "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                }
              >
                <h3 className="text-xl font-headline font-semibold text-slate-900">{plan.name}</h3>
                <p className="mt-2 text-3xl font-headline font-semibold text-slate-900">{plan.price}</p>
                <p className="mt-3 text-sm text-slate-600">{plan.summary}</p>
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
                  <Link href={plan.name === "Enterprise Program" ? "/services" : "/store"}>{plan.cta}</Link>
                </Button>
              </div>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
