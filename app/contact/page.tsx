import type { Metadata } from "next";
import {
  Clock3,
  Globe2,
  Mail,
  MessagesSquare,
  PhoneCall,
  ShieldCheck,
  Users,
} from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import { MainNav } from "@/components/layout/main-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { isContactTopicValue } from "@/lib/contact-topics";
import { createPageMetadata } from "@/lib/site-metadata";
import { getListingById } from "@/lib/server/data-store";

export const metadata: Metadata = createPageMetadata({
  title: "Contact",
  description:
    "Start a conversation with S-Tech Studios about websites, digital platforms, and curated content experiences.",
  path: "/contact",
});

const CONTACT_NOTES = [
  {
    icon: Clock3,
    title: "Fast first response",
    description: "Expect a response within one business day with the next best step.",
  },
  {
    icon: MessagesSquare,
    title: "Clear scoping",
    description: "We focus on goals, constraints, delivery risks, and the right starting path.",
  },
  {
    icon: ShieldCheck,
    title: "Practical guidance",
    description: "You will get a realistic recommendation, not a generic sales handoff.",
  },
];

const DIRECT_CONTACTS = [
  {
    icon: Mail,
    title: "Support Email",
    value: "help@s-techsolution.org",
    href: "mailto:help@s-techsolution.org",
    helper: "Best for project support, updates, and general help.",
    iconClassName: "bg-sky-100 text-sky-700",
    borderClassName: "border-sky-200",
    bgClassName: "bg-sky-50/70",
  },
  {
    icon: Mail,
    title: "Direct Email",
    value: "strive@s-techsolutions.org",
    href: "mailto:strive@s-techsolutions.org",
    helper: "Best for direct conversations and project lead contact.",
    iconClassName: "bg-violet-100 text-violet-700",
    borderClassName: "border-violet-200",
    bgClassName: "bg-violet-50/70",
  },
  {
    icon: Globe2,
    title: "Facebook",
    value: "facebook.com/Stechsolutions",
    href: "https://www.facebook.com/Stechsolutions",
    helper: "Follow updates and public posts from the studio.",
    iconClassName: "bg-blue-100 text-blue-700",
    borderClassName: "border-blue-200",
    bgClassName: "bg-blue-50/70",
  },
  {
    icon: MessagesSquare,
    title: "WhatsApp Channel",
    value: "Open channel",
    href: "https://whatsapp.com/channel/0029VaE4TMq545v0wnXxRL0F",
    helper: "Join the public WhatsApp channel for announcements.",
    iconClassName: "bg-emerald-100 text-emerald-700",
    borderClassName: "border-emerald-200",
    bgClassName: "bg-emerald-50/70",
  },
  {
    icon: Users,
    title: "WhatsApp Group",
    value: "Join group",
    href: "https://chat.whatsapp.com/HmI8N3xz1RZDwKoRztaJYe?mode=gi_t",
    helper: "Join the WhatsApp group for direct community access.",
    iconClassName: "bg-orange-100 text-orange-700",
    borderClassName: "border-orange-200",
    bgClassName: "bg-orange-50/70",
  },
];

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ listing?: string; topic?: string }>;
}) {
  const params = await searchParams;
  const selectedListing = params.listing
    ? await getListingById(params.listing)
    : null;
  const initialTopic = isContactTopicValue(params.topic)
    ? params.topic
    : "strategy";

  return (
    <div className="min-h-screen bg-slate-50">
      <MainNav />

      <main id="main-content">
        <section className="bg-slate-950 py-20 text-white">
          <div className="container mx-auto px-4">
            <Badge className="border-none bg-cyan-400/20 text-cyan-200">
              Contact
            </Badge>
            <h1 className="mt-5 max-w-3xl text-4xl font-headline font-semibold leading-tight md:text-5xl">
              Start the conversation around the project you want people to see
              more clearly.
            </h1>
            <p className="mt-4 max-w-2xl text-slate-300">
              Tell us what you are building, what feels unclear right now, and
              the kind of experience you want people to have. We will help you
              choose a practical next step.
            </p>
          </div>
        </section>

        <section className="container mx-auto grid gap-8 px-4 py-14 md:py-20 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="border-slate-200">
            <CardContent className="p-6 md:p-8">
              <ContactForm
                initialTopic={initialTopic}
                selectedListing={selectedListing}
              />
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="overflow-hidden border-slate-200 shadow-sm">
              <CardContent className="p-0">
                <div className="bg-[linear-gradient(135deg,rgba(6,182,212,0.12),rgba(34,197,94,0.12),rgba(99,102,241,0.12))] p-6">
                  <div className="mb-5 flex items-start gap-4 rounded-3xl border border-emerald-200 bg-white/85 p-5 backdrop-blur">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                      <PhoneCall className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium uppercase tracking-[0.16em] text-emerald-700">
                        WhatsApp and Calls
                      </p>
                      <p className="mt-2 break-all text-xl font-headline font-semibold text-slate-900">
                        +263718704505
                      </p>
                      <p className="mt-2 text-sm text-slate-600">
                        Reach us directly for a fast call, chat, or follow-up.
                      </p>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <Button
                          asChild
                          className="bg-emerald-600 text-white hover:bg-emerald-500"
                        >
                          <a
                            href="https://wa.me/263718704505"
                            target="_blank"
                            rel="noreferrer noopener"
                          >
                            Open WhatsApp
                          </a>
                        </Button>
                        <Button asChild variant="outline" className="border-emerald-200">
                          <a href="tel:+263718704505">Call now</a>
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    {DIRECT_CONTACTS.map((contact) => (
                      <a
                        key={contact.title}
                        href={contact.href}
                        target={contact.href.startsWith("http") ? "_blank" : undefined}
                        rel={
                          contact.href.startsWith("http")
                            ? "noreferrer noopener"
                            : undefined
                        }
                        className={`block rounded-2xl border ${contact.borderClassName} ${contact.bgClassName} p-5 transition hover:-translate-y-0.5 hover:shadow-lg`}
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${contact.iconClassName}`}
                          >
                            <contact.icon className="h-5 w-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium uppercase tracking-[0.14em] text-slate-500">
                              {contact.title}
                            </p>
                            <p className="mt-1 break-all text-base font-semibold text-slate-900">
                              {contact.value}
                            </p>
                            <p className="mt-2 text-sm leading-relaxed text-slate-600">
                              {contact.helper}
                            </p>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {CONTACT_NOTES.map((note) => (
              <Card key={note.title} className="border-slate-200">
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700">
                    <note.icon className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-headline font-semibold text-slate-900">
                    {note.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {note.description}
                  </p>
                </CardContent>
              </Card>
            ))}

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium uppercase tracking-[0.16em] text-cyan-700">
                Prefer email?
              </p>
              <p className="mt-3 text-sm text-slate-600">
                You can reach us directly at help@s-techsolution.org or
                strive@s-techsolutions.org, but the contact form is still the
                fastest way to give us enough context to help well.
              </p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
