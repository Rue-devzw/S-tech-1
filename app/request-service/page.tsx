import type { Metadata } from "next";
import { PageShell } from "@/components/site-shell";
import { PublicServiceRequestForm } from "@/components/public-forms";
import { SectionHeader } from "@/components/public-sections";
import { breadcrumbJsonLd, makeMetadata } from "@/lib/seo";

export const metadata: Metadata = makeMetadata({
  title: "Request Technology Service",
  description: "Request electronics repairs, ICT support, networking, Starlink installation, web development, software or AI automation from OmniTech Solutions.",
  path: "/request-service",
  keywords: ["request repair Harare", "book ICT support", "book Starlink installation Zimbabwe"]
});

export default function RequestServicePage() {
  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Request Service", path: "/request-service" }])) }} />
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <SectionHeader
            eyebrow="Request service"
            title="Tell us what needs to be repaired, connected, built or automated"
            body="Submit enough detail for OmniTech to triage the work correctly. For repairs, include device model and symptoms. For field work, include the location and preferred time."
          />
          <div className="mt-6 rounded-lg border border-line bg-white p-5 text-sm leading-6 text-slate-600">
            For urgent work, submit the form and also send a WhatsApp message with photos, location and contact person.
          </div>
        </div>
        <PublicServiceRequestForm />
      </section>
    </PageShell>
  );
}
