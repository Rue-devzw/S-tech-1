import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/site-shell";
import { brand } from "@/lib/constants";
import { whatsappChannelHref, whatsappHref } from "@/lib/public-content";
import { breadcrumbJsonLd, makeMetadata, organizationJsonLd } from "@/lib/seo";

export const metadata: Metadata = makeMetadata({
  title: "Impressum",
  description: "Legal notice and company information for OmniTech Solutions.",
  path: "/impressum",
  keywords: ["OmniTech Solutions Impressum", "OmniTech legal notice", "OmniTech company information"]
});

const sections = [
  {
    title: "Company Information",
    rows: [
      ["Business name", brand.name],
      ["Trading name", brand.name],
      ["Location", brand.location],
      ["Country", "Zimbabwe"]
    ]
  },
  {
    title: "Contact",
    rows: [
      ["Email", brand.email],
      ["Phone / WhatsApp", brand.phone],
      ["WhatsApp channel", brand.whatsappChannel],
      ["Website", "https://omnitech.io"]
    ]
  },
  {
    title: "Responsible For Content",
    rows: [
      ["Publisher", brand.name],
      ["Contact email", brand.email],
      ["Editorial responsibility", "OmniTech Solutions management"]
    ]
  }
];

export default function ImpressumPage() {
  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            organizationJsonLd(),
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Impressum", path: "/impressum" }
            ])
          ])
        }}
      />
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-4 py-14">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal">Legal notice</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-ink md:text-6xl">Impressum</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700">
            This page provides company and contact information for {brand.name}, the operator of this website and platform.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-5 px-4 pb-14">
        {sections.map((section) => (
          <div key={section.title} className="rounded-lg border border-line bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-ink">{section.title}</h2>
            <dl className="mt-5 grid gap-4">
              {section.rows.map(([label, value]) => (
                <div key={label} className="grid gap-1 border-t border-line pt-4 sm:grid-cols-[180px_1fr]">
                  <dt className="text-sm font-semibold text-slate-500">{label}</dt>
                  <dd className="text-sm font-semibold text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}

        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-lg border border-line bg-cloud p-6">
            <h2 className="text-xl font-bold text-ink">Service Scope</h2>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              {brand.name} provides electronics repairs, ICT support, networking, Starlink installation support, web development, software systems and AI automation services.
            </p>
          </div>
          <div className="rounded-lg border border-line bg-cloud p-6">
            <h2 className="text-xl font-bold text-ink">Registration Details</h2>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              Business registration, tax identification and regulatory numbers should be added here once confirmed by the company&apos;s official records.
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-line bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-ink">Disclaimers</h2>
          <div className="mt-4 space-y-4 text-sm leading-6 text-slate-700">
            <p>
              Information on this website is provided for general business and service communication. While {brand.name} works to keep information accurate and current, service availability, pricing, timelines and technical recommendations may vary by diagnosis, site conditions, supplier availability and customer approvals.
            </p>
            <p>
              External links, including WhatsApp and other third-party services, are provided for convenience. {brand.name} is not responsible for the content, policies or availability of external platforms.
            </p>
            <p>
              For service requests, quotes, warranties, invoices or data-related questions, contact us directly through the channels below.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={`mailto:${brand.email}`} className="rounded-md bg-copper px-4 py-2 text-sm font-semibold text-ink shadow-lift">
              Email {brand.email}
            </a>
            <a href={whatsappHref} className="rounded-md border border-teal/30 bg-white px-4 py-2 text-sm font-semibold text-ink">
              Chat on WhatsApp
            </a>
            <a href={whatsappChannelHref} className="rounded-md border border-line bg-white px-4 py-2 text-sm font-semibold text-ink">
              WhatsApp channel
            </a>
          </div>
        </div>

        <p className="text-xs leading-5 text-slate-500">
          Last updated: June 5, 2026. This Impressum is not a substitute for legal advice. For privacy or customer account matters, contact{" "}
          <Link href="/contact" className="font-semibold text-teal hover:text-ink">
            {brand.name}
          </Link>
          .
        </p>
      </section>
    </PageShell>
  );
}
