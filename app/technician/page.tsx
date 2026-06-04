import type { Metadata } from "next";
import { PageShell } from "@/components/site-shell";
import { TechnicianDashboard } from "@/components/technician-dashboard";
import { currentUser } from "@/server/auth";
import { getTechnicianDashboard } from "@/server/services/technician-dashboard";
import { makeMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = makeMetadata({
  title: "Technician Dashboard",
  description: "Assigned OmniTech jobs, diagnosis queue, repair notes, parts, checklists and technician status updates.",
  path: "/technician",
  noIndex: true
});

export default async function TechnicianPage() {
  const user = await currentUser();
  const dashboard = user ? await getTechnicianDashboard(user).catch(() => null) : null;

  return (
    <PageShell>
      {dashboard ? (
        <TechnicianDashboard technicianName={user?.name ?? "Technician"} stats={dashboard.stats} jobs={dashboard.jobs} />
      ) : (
        <section className="mx-auto max-w-4xl px-4 py-14">
          <h1 className="text-3xl font-bold text-ink">Technician dashboard</h1>
          <p className="mt-4 text-slate-600">Your assigned job queue is unavailable right now.</p>
        </section>
      )}
    </PageShell>
  );
}
