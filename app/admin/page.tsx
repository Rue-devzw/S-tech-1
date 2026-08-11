import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, CalendarDays, CircleDollarSign, ClipboardList, Clock, PackageSearch, Smile, Sparkles, Wrench } from "lucide-react";
import { PageShell } from "@/components/site-shell";
import { JobStatusAction, RequestReviewAction } from "@/components/admin/admin-operations-actions";
import { getAdminDashboard } from "@/server/services/admin-dashboard";
import { makeMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = makeMetadata({
  title: "Admin Dashboard",
  description: "OmniTech operations dashboard for requests, jobs, field visits, stock, revenue, warranties, campaigns and satisfaction.",
  path: "/admin",
  noIndex: true
});

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function money(value: number) {
  return new Intl.NumberFormat("en", { style: "currency", currency: "USD" }).format(value);
}

function label(value: string) {
  return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
}

const allStatuses = [
  "NEW",
  "TRIAGED",
  "QUOTED",
  "APPROVED",
  "IN_PROGRESS",
  "WAITING_PARTS",
  "READY",
  "CREATED",
  "ASSIGNED",
  "DIAGNOSING",
  "WAITING_CUSTOMER",
  "QUALITY_CHECK",
  "READY_FOR_COLLECTION",
  "PAYMENT_PENDING",
  "COMPLETED",
  "CANCELLED"
];

export default async function AdminDashboardPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const dashboard = await getAdminDashboard({
    from: first(params.from),
    to: first(params.to),
    serviceCategoryId: first(params.serviceCategoryId),
    technicianId: first(params.technicianId),
    status: first(params.status)
  }).catch(() => null);

  if (!dashboard) {
    return (
      <PageShell>
        <section className="mx-auto max-w-4xl px-4 py-14">
          <h1 className="text-3xl font-bold text-ink">Admin dashboard</h1>
          <p className="mt-4 text-slate-600">Dashboard data is unavailable because the database connection is not ready.</p>
        </section>
      </PageShell>
    );
  }

  const { widgets } = dashboard;

  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="rounded-lg bg-brand-band p-6 text-white shadow-glow">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-100">Admin operations</p>
            <h1 className="mt-2 text-3xl font-bold text-white">Operations dashboard</h1>
            <p className="mt-2 max-w-3xl text-white/82">
              Monitor requests, jobs, visits, stock, revenue, campaigns, warranties and customer satisfaction across OmniTech services.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <AdminLink href="/admin/field-service" label="Field service" />
            <AdminLink href="/admin/finance" label="Finance" />
            <AdminLink href="/admin/communications" label="Communications" />
            <AdminLink href="/admin/portfolio" label="Portfolio" />
            <AdminLink href="/admin/blog" label="Blog" />
            <AdminLink href="/admin/products" label="Products" />
            <AdminLink href="/admin/ai" label="AI" />
            <AdminLink href="/admin/users" label="Users" />
          </div>
        </div>
        </div>

        <form className="omni-card mt-6 grid gap-4 rounded-lg p-4 md:grid-cols-5">
          <label>From<input name="from" type="date" defaultValue={dashboard.filters.from} /></label>
          <label>To<input name="to" type="date" defaultValue={dashboard.filters.to} /></label>
          <label>
            Service category
            <select name="serviceCategoryId" defaultValue={dashboard.filters.serviceCategoryId}>
              <option value="">All categories</option>
              {dashboard.serviceCategories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
          </label>
          <label>
            Technician
            <select name="technicianId" defaultValue={dashboard.filters.technicianId}>
              <option value="">All technicians</option>
              {dashboard.technicians.map((technician) => <option key={technician.id} value={technician.id}>{technician.name}</option>)}
            </select>
          </label>
          <label>
            Status
            <select name="status" defaultValue={dashboard.filters.status}>
              <option value="">All statuses</option>
              {allStatuses.map((status) => <option key={status} value={status}>{label(status)}</option>)}
            </select>
          </label>
          <div className="md:col-span-5 flex flex-wrap gap-3">
            <button className="bg-ink px-5 py-3 text-sm font-semibold text-white shadow-lift">Apply filters</button>
            <Link href="/admin" className="border border-line bg-white px-5 py-3 text-sm font-semibold text-ink">Reset</Link>
          </div>
        </form>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Widget icon={ClipboardList} label="New requests" value={widgets.newRequests} tone="teal" />
          <Widget icon={Wrench} label="Active jobs" value={widgets.activeJobs} tone="ink" />
          <Widget icon={AlertTriangle} label="Overdue jobs" value={widgets.overdueJobs} tone="copper" />
          <Widget icon={ClipboardList} label="Awaiting quotation" value={widgets.awaitingQuotation} tone="teal" />
          <Widget icon={Clock} label="Awaiting approval" value={widgets.awaitingApproval} tone="copper" />
          <Widget icon={CalendarDays} label="Field visits today" value={widgets.fieldVisitsToday} tone="ink" />
          <Widget icon={PackageSearch} label="Low stock" value={widgets.lowStock} tone="copper" />
          <Widget icon={CircleDollarSign} label="Monthly revenue" value={money(widgets.monthlyRevenue)} tone="teal" />
          <Widget icon={Sparkles} label="Campaign enquiries" value={widgets.campaignEnquiries} detail={`${widgets.activePromotions} active promos`} tone="ink" />
          <Widget icon={AlertTriangle} label="Warranty claims" value={widgets.warrantyClaims} tone="copper" />
          <Widget icon={Smile} label="Customer satisfaction" value={widgets.customerSatisfaction ? `${widgets.customerSatisfaction}/5` : "N/A"} detail={`${widgets.satisfactionCount} ratings`} tone="teal" />
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="omni-card rounded-lg p-5">
            <h2 className="text-xl font-semibold text-ink">Service category performance</h2>
            <div className="mt-4 grid gap-3">
              {dashboard.categoryPerformance.length ? dashboard.categoryPerformance.map((item) => (
                <div key={`${item.name}-${item.service}`} className="rounded-lg border border-line bg-white/78 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-teal">{item.name}</p>
                      <p className="mt-1 font-semibold text-ink">{item.service}</p>
                    </div>
                    <span className="text-2xl font-bold text-ink">{item.count}</span>
                  </div>
                </div>
              )) : <p className="text-sm text-slate-600">No service activity found for this filter.</p>}
            </div>
          </section>

          <section className="omni-card rounded-lg p-5">
            <h2 className="text-xl font-semibold text-ink">Recent jobs</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="border-b border-line text-xs uppercase text-slate-500">
                  <tr><th className="py-3">Job</th><th>Customer</th><th>Service</th><th>Technician</th><th>Status</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {dashboard.recentJobs.map((job) => (
                    <tr key={job.id} className="border-b border-line last:border-0">
                      <td className="py-3 font-semibold text-ink">{job.jobNumber}</td>
                      <td>{job.customer.name}</td>
                      <td>{job.request?.service.name ?? label(job.type)}</td>
                      <td>{job.assignedTo?.name ?? "Unassigned"}</td>
                      <td><StatusPill value={job.status} /></td>
                      <td>
                        <JobStatusAction job={{ id: job.id, jobNumber: job.jobNumber, status: job.status }} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <section className="omni-card rounded-lg p-5">
            <h2 className="text-xl font-semibold text-ink">Recent requests</h2>
            <div className="mt-4 grid gap-3">
              {dashboard.recentRequests.map((request) => (
                <article key={request.id} className="rounded-lg border border-line bg-white/78 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-teal">{request.requestNumber}</p>
                      <h3 className="mt-1 font-semibold text-ink">{request.title}</h3>
                      <p className="mt-1 text-sm text-slate-600">{request.customer.name} · {request.service.category.name}</p>
                      <p className="mt-2 max-w-xl text-sm text-slate-500">{request.description}</p>
                    </div>
                    <StatusPill value={request.status} />
                  </div>
                  <RequestReviewAction
                    request={{
                      id: request.id,
                      requestNumber: request.requestNumber,
                      title: request.title,
                      description: request.description,
                      priority: request.priority,
                      locationNote: request.locationNote,
                      status: request.status,
                      hasJobCard: Boolean(request.jobCard)
                    }}
                    technicians={dashboard.technicians}
                  />
                </article>
              ))}
            </div>
          </section>

          <section className="omni-card rounded-lg p-5">
            <h2 className="text-xl font-semibold text-ink">Low stock watch</h2>
            <div className="mt-4 grid gap-3">
              {dashboard.lowStock.length ? dashboard.lowStock.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-lg border border-line bg-white/78 p-4">
                  <div>
                    <p className="font-semibold text-ink">{item.name}</p>
                    <p className="text-sm text-slate-600">{item.sku} · reorder at {item.reorderLevel}</p>
                  </div>
                  <span className="text-2xl font-bold text-copper">{item.quantityOnHand}</span>
                </div>
              )) : <p className="text-sm text-slate-600">No stock items are below reorder level.</p>}
            </div>
          </section>
        </div>
      </section>
    </PageShell>
  );
}

function AdminLink({ href, label: text }: { href: string; label: string }) {
  return <Link href={href} className="border border-white/25 bg-white/14 px-3 py-2 text-sm font-semibold text-white backdrop-blur hover:bg-white/22">{text}</Link>;
}

function Widget({ icon: Icon, label: text, value, detail, tone }: { icon: typeof ClipboardList; label: string; value: string | number; detail?: string; tone: "teal" | "ink" | "copper" }) {
  const style =
    tone === "teal"
      ? "from-teal/18 to-sky/10 text-teal"
      : tone === "copper"
        ? "from-copper/20 to-sun/14 text-copper"
        : "from-violet/16 to-ink/8 text-ink";
  return (
    <article className={`status-burst omni-card rounded-lg bg-gradient-to-br ${style} p-5`}>
      <span className="grid size-10 place-items-center rounded-md bg-white/84 shadow-sm">
        <Icon size={22} />
      </span>
      <p className="mt-4 text-sm font-semibold text-slate-500">{text}</p>
      <p className="mt-1 text-2xl font-bold text-ink">{value}</p>
      {detail ? <p className="mt-1 text-xs font-semibold text-slate-500">{detail}</p> : null}
    </article>
  );
}

function StatusPill({ value }: { value: string }) {
  const hot = ["URGENT", "OVERDUE", "CANCELLED", "PAYMENT_PENDING"].includes(value);
  const active = ["IN_PROGRESS", "ASSIGNED", "DIAGNOSING", "QUALITY_CHECK"].includes(value);
  const done = ["COMPLETED", "READY", "READY_FOR_COLLECTION", "PAID"].includes(value);
  const tone = hot ? "bg-copper/12 text-copper" : active ? "bg-teal/12 text-teal" : done ? "bg-success/12 text-success" : "bg-sky/10 text-sky";
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tone}`}>{label(value)}</span>;
}
