"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Clock3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { type Listing } from "@/lib/mock-data";

export function ListingCard({ listing }: { listing: Listing }) {
  const router = useRouter();

  function onView() {
    router.push(`/listing/${listing.id}`);
  }

  return (
    <Card className="group overflow-hidden border border-slate-200/80 bg-white/90 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-900/10">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={listing.imageUrl}
          alt={`${listing.name} preview`}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent" />

        <div className="absolute left-3 top-3 flex items-center gap-2">
          <Badge className="border-none bg-slate-950/85 text-slate-100">
            {listing.category}
          </Badge>
          {listing.featured && (
            <Badge className="border-none bg-cyan-400 text-slate-950">
              Featured
            </Badge>
          )}
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-100">
          <span className="inline-flex items-center gap-1 rounded-full bg-black/35 px-2.5 py-1">
            <Clock3 className="h-3.5 w-3.5" />
            {listing.deliveryTimeline}
          </span>
          <span className="rounded-full bg-black/35 px-2.5 py-1">
            {listing.industry}
          </span>
        </div>
      </div>

      <CardHeader className="space-y-3 p-5 pb-2">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 text-lg font-headline font-semibold leading-tight text-slate-900">
            {listing.name}
          </h3>
          <span className="shrink-0 rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700">
            Case Study
          </span>
        </div>
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
          {listing.client}
        </p>
        <p className="line-clamp-2 text-sm text-slate-600">
          {listing.shortDescription}
        </p>
      </CardHeader>

      <CardContent className="px-5 pb-4 pt-1">
        <div className="flex flex-wrap gap-1.5">
          {listing.technologies.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
            >
              {tech}
            </span>
          ))}
        </div>
      </CardContent>

      <CardFooter className="border-t border-slate-100 px-5 py-4">
        <Button
          size="sm"
          className="h-9 w-full bg-slate-900 text-white hover:bg-slate-800"
          onClick={onView}
          aria-label={`View details for ${listing.name}`}
        >
          View case study
          <ArrowUpRight className="ml-1.5 h-4 w-4" />
        </Button>
        <Link
          href={`/listing/${listing.id}`}
          className="sr-only"
          aria-label={`Open ${listing.name}`}
        >
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </CardFooter>
    </Card>
  );
}
