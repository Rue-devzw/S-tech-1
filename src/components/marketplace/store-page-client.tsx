"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Filter, Search } from "lucide-react";
import { ListingCard } from "@/components/marketplace/listing-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES, type Listing } from "@/lib/mock-data";

const COLLABORATION_PATHS = [
  {
    name: "Portfolio Website",
    description:
      "A clean, modern site for a brand, founder, or small business that needs a stronger online presence.",
    cta: "Start a project",
    href: "/contact?topic=platforms",
  },
  {
    name: "Agency Platform",
    description:
      "A service-led website that explains what you do clearly and guides visitors toward inquiries.",
    cta: "Start a project",
    featured: true,
    href: "/contact?topic=platforms",
  },
  {
    name: "Content Collection",
    description:
      "A structured digital experience for collections, archives, or content that needs to be easier to browse.",
    cta: "Talk about your idea",
    href: "/contact?topic=ai",
  },
];

export function StorePageClient({
  initialListings,
  initialQuery,
}: {
  initialListings: Listing[];
  initialQuery: string;
}) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  const filteredListings = useMemo(
    () =>
      initialListings.filter((listing) => {
        const matchesCategory =
          activeCategory === "All" || listing.category === activeCategory;
        const q = searchQuery.trim().toLowerCase();
        const matchesQuery =
          q.length === 0 ||
          listing.name.toLowerCase().includes(q) ||
          listing.shortDescription.toLowerCase().includes(q) ||
          listing.client.toLowerCase().includes(q) ||
          listing.industry.toLowerCase().includes(q) ||
          listing.technologies.some((tech) => tech.toLowerCase().includes(q)) ||
          listing.features.some((feature) => feature.toLowerCase().includes(q));

        return matchesCategory && matchesQuery;
      }),
    [activeCategory, initialListings, searchQuery]
  );

  return (
    <>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Badge className="border-none bg-cyan-100 text-cyan-700">
              Selected Work
            </Badge>
            <h1 className="mt-3 text-3xl font-headline font-semibold text-slate-900 md:text-4xl">
              Real projects and case studies
            </h1>
            <p className="mt-2 text-slate-600">
              Browse websites, agency platforms, and digital collections that
              reflect the kind of work we design and build.
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <Button
                className="bg-slate-900 text-white hover:bg-slate-800"
                asChild
              >
                <Link href="/contact">Start a project</Link>
              </Button>
              <Button variant="outline" className="border-slate-300" asChild>
                <Link href="/services">
                  View services
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative w-full lg:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              aria-label="Search listings"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search work by name, feature, or domain"
              className="h-10 border-slate-300 pl-9"
            />
          </div>
        </div>

        <div className="md:hidden">
          <Select value={activeCategory} onValueChange={setActiveCategory}>
            <SelectTrigger aria-label="Filter work by category">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="hidden flex-wrap gap-2 md:flex">
          {CATEGORIES.map((category) => (
            <Button
              key={category}
              onClick={() => setActiveCategory(category)}
              aria-pressed={activeCategory === category}
              variant={activeCategory === category ? "default" : "outline"}
              className={
                activeCategory === category
                  ? "bg-slate-900 text-white hover:bg-slate-800"
                  : "border-slate-300 text-slate-700 hover:bg-slate-50"
              }
            >
              {category}
            </Button>
          ))}
        </div>
      </section>

      <section className="py-8">
        <div
          className="mb-4 flex flex-col items-start gap-2 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between"
          aria-live="polite"
        >
          <span>
            Showing{" "}
            <span className="font-semibold text-slate-900">
              {filteredListings.length}
            </span>{" "}
            results
          </span>
          <span className="inline-flex items-center gap-1">
            <Filter className="h-3.5 w-3.5" />
            Filter: {activeCategory}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {filteredListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>

        {filteredListings.length === 0 && (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <h3 className="text-lg font-headline font-semibold text-slate-900">
              No matching projects
            </h3>
            <p className="mt-2 text-slate-500">
              Adjust your search or switch categories to discover more work.
            </p>
          </div>
        )}
      </section>

      <section className="pb-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-headline font-semibold text-slate-900">
              Need something in this style?
            </h2>
            <p className="mt-2 text-slate-600">
              These are a few directions we can take if you want a site,
              platform, or collection built around your own work.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {COLLABORATION_PATHS.map((plan) => (
              <div
                key={plan.name}
                className={
                  plan.featured
                    ? "rounded-2xl border border-cyan-300 bg-cyan-50 p-5"
                    : "rounded-2xl border border-slate-200 bg-slate-50 p-5"
                }
              >
                <p className="text-sm font-medium uppercase tracking-[0.12em] text-slate-500">
                  {plan.name}
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  {plan.description}
                </p>
                <p className="mt-4 inline-flex items-start gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-700" />
                  Scoped around your content, audience, and goals
                </p>
                <Button
                  className={
                    plan.featured
                      ? "mt-5 w-full bg-slate-900 text-white hover:bg-slate-800"
                      : "mt-5 w-full bg-cyan-400 text-slate-950 hover:bg-cyan-300"
                  }
                  asChild
                >
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
