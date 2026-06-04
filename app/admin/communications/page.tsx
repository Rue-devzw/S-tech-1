import type { Metadata } from "next";
import { CommunicationsDashboard } from "@/components/communications-dashboard";
import { PageShell } from "@/components/site-shell";
import { makeMetadata } from "@/lib/seo";

export const metadata: Metadata = makeMetadata({
  title: "Communications",
  description: "Manage OmniTech notification templates, automated workflow triggers, manual customer messages and delivery logs.",
  path: "/admin/communications",
  noIndex: true
});

export default function CommunicationsPage() {
  return (
    <PageShell>
      <CommunicationsDashboard />
    </PageShell>
  );
}
