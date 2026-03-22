"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Star,
} from "lucide-react";
import { MainNav } from "@/components/layout/main-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { type Listing } from "@/lib/mock-data";

export function ListingDetailClient({ listing }: { listing: Listing }) {
  const { toast } = useToast();
  const [requestOpen, setRequestOpen] = useState(false);
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [requestForm, setRequestForm] = useState({
    fullName: "",
    workEmail: "",
    timeline: "",
    goals: "",
    website: "",
  });

  async function submitRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmittingRequest(true);

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listingId: listing.id,
          userName: requestForm.fullName,
          userEmail: requestForm.workEmail,
          message: `Timeline: ${requestForm.timeline || "Not specified"}\n\nGoals: ${requestForm.goals}`,
          website: requestForm.website,
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(data?.error || "Unable to send request.");
      }

      setRequestOpen(false);
      setRequestForm({
        fullName: "",
        workEmail: "",
        timeline: "",
        goals: "",
        website: "",
      });
      toast({
        title: "Request sent",
        description:
          "Our delivery team will contact you within one business day.",
      });
    } catch (caughtError) {
      toast({
        title: "Request failed",
        description:
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to send request.",
        variant: "destructive",
      });
    } finally {
      setSubmittingRequest(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <MainNav />

      <main className="container mx-auto px-4 py-10">
        <Link
          href="/store"
          className="mb-6 inline-flex items-center text-sm font-medium text-slate-600 transition hover:text-slate-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to store
        </Link>

        <div className="mb-8 max-w-3xl">
          <h1 className="text-4xl font-headline font-semibold text-slate-900">
            {listing.name}
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            {listing.shortDescription}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          <section className="space-y-6 lg:col-span-8">
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="relative aspect-[16/9]">
                <Image
                  src={listing.imageUrl}
                  alt={`${listing.name} showcase image`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 70vw"
                  priority
                />
              </div>
              <div className="absolute left-4 top-4 flex gap-2">
                <Badge className="border-none bg-slate-900 text-white">
                  {listing.category}
                </Badge>
                {listing.featured && (
                  <Badge className="border-none bg-cyan-400 text-slate-950">
                    Featured
                  </Badge>
                )}
              </div>
            </div>

            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-2xl font-headline">
                  Project overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-slate-600">
                <p>{listing.description}</p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl bg-slate-100 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Client
                    </p>
                    <p className="mt-1 font-medium text-slate-900">
                      {listing.client}
                    </p>
                  </div>
                  <div className="rounded-xl bg-slate-100 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Industry
                    </p>
                    <p className="mt-1 font-medium text-slate-900">
                      {listing.industry}
                    </p>
                  </div>
                  <div className="rounded-xl bg-slate-100 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Delivery timeline
                    </p>
                    <p className="mt-1 font-medium text-slate-900">
                      {listing.deliveryTimeline}
                    </p>
                  </div>
                  <div className="rounded-xl bg-slate-100 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Support window
                    </p>
                    <p className="mt-1 font-medium text-slate-900">
                      {listing.supportWindow}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="font-headline text-xl">
                    Feature set
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-slate-600">
                  {listing.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-700" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="font-headline text-xl">
                    Measured outcomes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-slate-600">
                  {listing.outcomes.map((outcome) => (
                    <div key={outcome} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      <span>{outcome}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </section>

          <aside className="space-y-6 lg:col-span-4">
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-slate-900">
                    {listing.rating.toFixed(1)}
                  </span>
                  <span>from {listing.salesCount} projects</span>
                </div>
                <CardTitle className="text-3xl font-headline">
                  ${listing.price.toLocaleString()}
                </CardTitle>
                <p className="text-sm text-slate-600">
                  {listing.shortDescription}
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-3 text-xs text-slate-700">
                  <p className="font-medium text-slate-900">
                    Transparent pricing starts at $
                    {listing.price.toLocaleString()}
                  </p>
                  <p className="mt-1">
                    Final quote adjusts to integrations, security requirements,
                    and rollout complexity.
                  </p>
                </div>
                <Button
                  className="w-full bg-slate-900 text-white hover:bg-slate-800"
                  onClick={() => setRequestOpen(true)}
                >
                  Request this project
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-slate-300"
                  asChild
                >
                  <a href="mailto:hello@s-tech.africa?subject=Schedule%20a%20call%20with%20S-Tech">
                    Schedule a call
                  </a>
                </Button>
                {listing.previewUrl && (
                  <Button
                    variant="outline"
                    className="w-full border-slate-300"
                    asChild
                  >
                    <a
                      href={listing.previewUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      Live walkthrough
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                )}
                <div className="rounded-xl bg-slate-100 p-3 text-xs text-slate-600">
                  <p className="inline-flex items-center gap-2 font-medium text-slate-800">
                    <ShieldCheck className="h-4 w-4 text-cyan-700" />
                    Security and compliance review included
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="font-headline text-xl">
                  Technology stack
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {listing.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
                  >
                    {tech}
                  </span>
                ))}
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 p-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-xl items-center justify-between gap-3">
          <div>
            <p className="text-xs text-slate-500">Starting from</p>
            <p className="text-lg font-headline font-semibold text-slate-900">
              ${listing.price.toLocaleString()}
            </p>
          </div>
          <Button
            className="bg-slate-900 text-white hover:bg-slate-800"
            onClick={() => setRequestOpen(true)}
          >
            Request Proposal
          </Button>
        </div>
      </div>

      <Dialog open={requestOpen} onOpenChange={setRequestOpen}>
        <DialogContent className="sm:max-w-lg">
          <form onSubmit={submitRequest} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Request proposal for {listing.name}</DialogTitle>
              <DialogDescription>
                Share your project context and we will send a recommended scope,
                timeline, and delivery estimate.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <Label htmlFor="full-name">Full name</Label>
              <Input
                id="full-name"
                required
                value={requestForm.fullName}
                onChange={(event) =>
                  setRequestForm((prev) => ({
                    ...prev,
                    fullName: event.target.value,
                  }))
                }
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="work-email">Work email</Label>
              <Input
                id="work-email"
                type="email"
                required
                value={requestForm.workEmail}
                onChange={(event) =>
                  setRequestForm((prev) => ({
                    ...prev,
                    workEmail: event.target.value,
                  }))
                }
                placeholder="name@company.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeline">Preferred timeline</Label>
              <Input
                id="timeline"
                value={requestForm.timeline}
                onChange={(event) =>
                  setRequestForm((prev) => ({
                    ...prev,
                    timeline: event.target.value,
                  }))
                }
                placeholder="e.g. Kickoff next month"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goals">Project goals</Label>
              <Textarea
                id="goals"
                required
                value={requestForm.goals}
                onChange={(event) =>
                  setRequestForm((prev) => ({
                    ...prev,
                    goals: event.target.value,
                  }))
                }
                placeholder="What should this solution improve in your business?"
              />
            </div>
            <div className="hidden" aria-hidden="true">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={requestForm.website}
                onChange={(event) =>
                  setRequestForm((prev) => ({
                    ...prev,
                    website: event.target.value,
                  }))
                }
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setRequestOpen(false)}
                disabled={submittingRequest}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submittingRequest}
                className="bg-slate-900 text-white hover:bg-slate-800"
              >
                {submittingRequest ? "Sending..." : "Submit Request"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <SiteFooter />
    </div>
  );
}
