import type { Metadata } from "next";
import { PageShell } from "@/components/site-shell";
import { TrackRepairForm } from "@/components/public-forms";
import { Checklist, SectionHeader } from "@/components/public-sections";
import { repairTrackingSteps } from "@/lib/public-content";
import { breadcrumbJsonLd, makeMetadata } from "@/lib/seo";

export const metadata: Metadata = makeMetadata({
  title: "Track Repair or Job Status",
  description: "Track an OmniTech repair request or job card by reference and check status, updates, quotation, invoice and warranty information.",
  path: "/track-repair",
  keywords: ["track repair status", "OmniTech job card", "repair tracking Zimbabwe"]
});

export default function TrackRepairPage() {
  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Track Repair", path: "/track-repair" }])) }} />
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <SectionHeader eyebrow="Track repair" title="Follow your repair or job status" body="Use your OmniTech request or job reference to check current status, latest updates, quotation, invoice and warranty information where available." />
          <div className="mt-6 rounded-lg border border-line bg-white p-5">
            <Checklist items={repairTrackingSteps} />
          </div>
        </div>
        <TrackRepairForm />
      </section>
    </PageShell>
  );
}
