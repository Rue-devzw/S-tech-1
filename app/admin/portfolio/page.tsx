import type { Metadata } from "next";
import { PageShell } from "@/components/site-shell";
import { PortfolioAdminDashboard } from "@/components/portfolio-admin-dashboard";
import { makeMetadata } from "@/lib/seo";

export const metadata: Metadata = makeMetadata({
  title: "Portfolio CMS",
  description: "Publish OmniTech repair, website, app, network, Starlink and AI system case studies with testimonials.",
  path: "/admin/portfolio",
  noIndex: true
});

export default function AdminPortfolioPage() {
  return (
    <PageShell>
      <PortfolioAdminDashboard />
    </PageShell>
  );
}
