import type { Metadata } from "next";
import { PageShell } from "@/components/site-shell";
import { FieldServiceDashboard } from "@/components/field-service-dashboard";
import { makeMetadata } from "@/lib/seo";

export const metadata: Metadata = makeMetadata({
  title: "Field Service Scheduling",
  description: "Schedule and manage OmniTech field visits for Starlink, networking, onsite support, CCTV/network support and ICT maintenance.",
  path: "/admin/field-service",
  noIndex: true
});

export default function FieldServicePage() {
  return (
    <PageShell>
      <FieldServiceDashboard />
    </PageShell>
  );
}
