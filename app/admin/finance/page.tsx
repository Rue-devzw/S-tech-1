import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, Banknote, CircleDollarSign, FileCheck2, FileClock, ReceiptText, WalletCards } from "lucide-react";
import { FinanceActions } from "@/components/admin/finance-actions";
import { PageShell } from "@/components/site-shell";
import { makeMetadata } from "@/lib/seo";
import { getFinanceDashboard } from "@/server/services/finance";
import { requireAnyPermission } from "@/server/rbac";

export const dynamic = "force-dynamic";

export const metadata: Metadata = makeMetadata({
  title: "Finance",
  description: "OmniTech finance workspace for quotations, invoices, payments, receipts, expenses, receivables and cash position.",
  path: "/admin/finance",
  noIndex: true
});

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function money(value: unknown) {
  return new Intl.NumberFormat("en", { style: "currency", currency: "USD" }).format(Number(value ?? 0));
}

function date(value: string | Date | null | undefined) {
  if (!value) return "Not set";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value));
}

function label(value: string) {
  return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
}

const statuses = [
  ["", "All statuses"],
  ["DRAFT", "Draft"],
  ["SENT", "Sent"],
  ["ACCEPTED", "Accepted"],
  ["PARTIALLY_PAID", "Partially paid"],
  ["PAID", "Paid"],
  ["OVERDUE", "Overdue"],
  ["VOID", "Void"]
];

export default async function AdminFinancePage({ searchParams }: PageProps) {
  const actor = await requireAnyPermission(["invoices:manage", "payments:record", "reports:view"]);

  if (!actor) {
    return (
      <PageShell>
        <section className="mx-auto max-w-4xl px-4 py-14">
          <h1 className="text-3xl font-bold text-ink">Finance</h1>
          <p className="mt-4 text-slate-600">You need finance or reporting permission to view this workspace.</p>
          <Link href="/admin" className="mt-6 inline-flex rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white">
            Back to admin
          </Link>
        </section>
      </PageShell>
    );
  }

  const params = await searchParams;
  const finance = await getFinanceDashboard({
    from: first(params.from),
    to: first(params.to),
    status: first(params.status),
    q: first(params.q)
  }).catch(() => null);

  if (!finance) {
    return (
      <PageShell>
        <section className="mx-auto max-w-4xl px-4 py-14">
          <h1 className="text-3xl font-bold text-ink">Finance</h1>
          <p className="mt-4 text-slate-600">Finance data is unavailable because the database connection is not ready.</p>
        </section>
      </PageShell>
    );
  }

  const unpaidInvoices = finance.invoices
    .filter((invoice) => Number(invoice.balanceDue) > 0 && !["PAID", "VOID"].includes(invoice.status))
    .map((invoice) => ({
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      customerName: invoice.customer.name,
      balanceDue: Number(invoice.balanceDue)
    }));

  const quotationActions = finance.quotations.map((quotation) => ({
    id: quotation.id,
    quotationNumber: quotation.quotationNumber,
    status: quotation.status,
    hasInvoice: quotation.invoices.length > 0
  }));

  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="rounded-lg bg-brand-band p-6 text-white shadow-glow">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-teal-100">Accounting</p>
              <h1 className="mt-2 text-3xl font-bold text-white">Finance workspace</h1>
              <p className="mt-2 max-w-3xl text-white/82">
                Track quotations, invoices, payments, receipts, expenses, receivables and net cash for OmniTech operations.
              </p>
            </div>
            <Link href="/admin" className="border border-white/25 bg-white/14 px-3 py-2 text-sm font-semibold text-white backdrop-blur hover:bg-white/22">
              Admin dashboard
            </Link>
          </div>
        </div>

        <form className="omni-card mt-6 grid gap-4 rounded-lg p-4 md:grid-cols-5">
          <label>From<input name="from" type="date" defaultValue={finance.filters.from} /></label>
          <label>To<input name="to" type="date" defaultValue={finance.filters.to} /></label>
          <label>
            Status
            <select name="status" defaultValue={finance.filters.status}>
              {statuses.map(([value, text]) => <option key={value || "all"} value={value}>{text}</option>)}
            </select>
          </label>
          <label className="md:col-span-2">Search<input name="q" defaultValue={finance.filters.q} placeholder="Customer, number, reference..." /></label>
          <div className="md:col-span-5 flex flex-wrap gap-3">
            <button className="rounded-md bg-ink px-5 py-3 text-sm font-semibold text-white shadow-lift">Apply filters</button>
            <Link href="/admin/finance" className="rounded-md border border-line bg-white px-5 py-3 text-sm font-semibold text-ink">Reset</Link>
          </div>
        </form>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Widget icon={CircleDollarSign} label="Invoiced" value={money(finance.widgets.invoiced)} tone="ink" />
          <Widget icon={Banknote} label="Cash collected" value={money(finance.widgets.collected)} tone="teal" />
          <Widget icon={WalletCards} label="Expenses" value={money(finance.widgets.expenses)} tone="silver" />
          <Widget icon={CircleDollarSign} label="Net cash" value={money(finance.widgets.netCash)} tone="gold" />
          <Widget icon={FileClock} label="Receivables" value={money(finance.widgets.receivables)} detail={`${finance.widgets.receivableCount} open invoices`} tone="ink" />
          <Widget icon={AlertTriangle} label="Overdue" value={money(finance.widgets.overdue)} detail={`${finance.widgets.overdueCount} invoices`} tone="gold" />
          <Widget icon={FileCheck2} label="Accepted quotes" value={finance.widgets.acceptedQuotes} detail={`${finance.widgets.sentQuotes} sent`} tone="teal" />
          <Widget icon={ReceiptText} label="Draft quotes" value={finance.widgets.draftQuotes} tone="silver" />
        </div>

        <div className="mt-6">
          <FinanceActions invoices={unpaidInvoices} quotations={quotationActions} />
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="omni-card rounded-lg p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-ink">Invoices</h2>
              <p className="text-sm font-semibold text-slate-500">{finance.invoices.length} shown</p>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="border-b border-line text-xs uppercase text-slate-500">
                  <tr><th className="py-3">Invoice</th><th>Customer</th><th>Status</th><th>Total</th><th>Paid</th><th>Balance</th><th>Due</th><th>Document</th></tr>
                </thead>
                <tbody>
                  {finance.invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-line last:border-0">
                      <td className="py-3 font-semibold text-ink">{invoice.invoiceNumber}</td>
                      <td>{invoice.customer.name}</td>
                      <td><StatusPill value={invoice.status} /></td>
                      <td>{money(invoice.total)}</td>
                      <td>{money(invoice.paidAmount)}</td>
                      <td className="font-semibold text-ink">{money(invoice.balanceDue)}</td>
                      <td>{date(invoice.dueAt)}</td>
                      <td>
                        <Link className="text-sm font-semibold text-teal hover:text-ink" href={`/api/billing/documents/invoice/${invoice.id}/pdf`} target="_blank">
                          PDF
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {!finance.invoices.length ? (
                    <tr><td colSpan={8} className="py-6 text-center text-slate-500">No invoices found for this filter.</td></tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </section>

          <section className="omni-card rounded-lg p-5">
            <h2 className="text-xl font-semibold text-ink">Expense categories</h2>
            <div className="mt-4 grid gap-3">
              {finance.expenseCategories.map((category) => (
                <div key={category.category} className="rounded-lg border border-line bg-white p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-ink">{category.category}</p>
                      <p className="text-sm text-slate-600">{category.count} entries</p>
                    </div>
                    <p className="text-lg font-bold text-ink">{money(category.amount)}</p>
                  </div>
                </div>
              ))}
              {!finance.expenseCategories.length ? <p className="text-sm text-slate-600">No expenses found for this filter.</p> : null}
            </div>
          </section>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <section className="omni-card rounded-lg p-5">
            <h2 className="text-xl font-semibold text-ink">Quotations</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="border-b border-line text-xs uppercase text-slate-500">
                  <tr><th className="py-3">Quote</th><th>Customer</th><th>Status</th><th>Total</th><th>Valid until</th><th>Document</th></tr>
                </thead>
                <tbody>
                  {finance.quotations.map((quotation) => (
                    <tr key={quotation.id} className="border-b border-line last:border-0">
                      <td className="py-3 font-semibold text-ink">{quotation.quotationNumber}</td>
                      <td>{quotation.customer.name}</td>
                      <td><StatusPill value={quotation.status} /></td>
                      <td>{money(quotation.total)}</td>
                      <td>{date(quotation.validUntil)}</td>
                      <td>
                        <Link className="text-sm font-semibold text-teal hover:text-ink" href={`/api/billing/documents/quotation/${quotation.id}/pdf`} target="_blank">
                          PDF
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {!finance.quotations.length ? (
                    <tr><td colSpan={6} className="py-6 text-center text-slate-500">No quotations found for this filter.</td></tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </section>

          <section className="omni-card rounded-lg p-5">
            <h2 className="text-xl font-semibold text-ink">Recent payments and receipts</h2>
            <div className="mt-4 grid gap-3">
              {finance.recentPayments.map((payment) => (
                <div key={payment.id} className="rounded-lg border border-line bg-white p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-ink">{payment.paymentNumber}</p>
                      <p className="text-sm text-slate-600">{payment.customer.name} · {label(payment.method)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-ink">{money(payment.amount)}</p>
                      <p className="text-xs text-slate-500">{date(payment.paidAt)}</p>
                    </div>
                  </div>
                  {payment.receipts[0] ? (
                    <Link className="mt-3 inline-flex text-sm font-semibold text-teal hover:text-ink" href={`/api/billing/documents/receipt/${payment.receipts[0].id}/pdf`} target="_blank">
                      Receipt PDF
                    </Link>
                  ) : null}
                </div>
              ))}
              {!finance.recentPayments.length ? <p className="text-sm text-slate-600">No payments found for this filter.</p> : null}
            </div>
          </section>
        </div>

        <section className="omni-card mt-6 rounded-lg p-5">
          <h2 className="text-xl font-semibold text-ink">Expenses</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="border-b border-line text-xs uppercase text-slate-500">
                <tr><th className="py-3">Expense</th><th>Date</th><th>Category</th><th>Vendor</th><th>Description</th><th>Status</th><th>Amount</th><th>Recorded by</th></tr>
              </thead>
              <tbody>
                {finance.recentExpenses.map((expense) => (
                  <tr key={expense.id} className="border-b border-line last:border-0">
                    <td className="py-3 font-semibold text-ink">{expense.expenseNumber}</td>
                    <td>{date(expense.expenseDate)}</td>
                    <td>{expense.category}</td>
                    <td>{expense.vendorName ?? "Not set"}</td>
                    <td>{expense.description}</td>
                    <td><StatusPill value={expense.status} /></td>
                    <td className="font-semibold text-ink">{money(expense.amount)}</td>
                    <td>{expense.recordedBy?.name ?? "System"}</td>
                  </tr>
                ))}
                {!finance.recentExpenses.length ? (
                  <tr><td colSpan={8} className="py-6 text-center text-slate-500">No expenses found for this filter.</td></tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </PageShell>
  );
}

function Widget({ icon: Icon, label: text, value, detail, tone }: { icon: typeof CircleDollarSign; label: string; value: string | number; detail?: string; tone: "teal" | "ink" | "gold" | "silver" }) {
  const style =
    tone === "teal"
      ? "from-teal/18 to-sky/10 text-teal"
      : tone === "gold"
        ? "from-copper/22 to-sun/18 text-copper"
        : tone === "silver"
          ? "from-slate-200 to-white text-slate-600"
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
  const tone = ["PAID", "ACCEPTED", "APPROVED"].includes(value)
    ? "bg-success/10 text-success"
    : ["OVERDUE", "VOID", "DECLINED"].includes(value)
      ? "bg-red-100 text-red-700"
      : ["SENT", "PARTIALLY_PAID"].includes(value)
        ? "bg-copper/15 text-copper"
        : "bg-slate-100 text-slate-600";

  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tone}`}>{label(value)}</span>;
}
