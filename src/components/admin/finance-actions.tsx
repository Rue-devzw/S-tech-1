"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingButtonContent } from "@/components/brand-loader";

type InvoiceOption = {
  id: string;
  invoiceNumber: string;
  customerName: string;
  balanceDue: number;
};

type QuotationOption = {
  id: string;
  quotationNumber: string;
  status: string;
  hasInvoice: boolean;
};

const paymentMethods = [
  ["CASH", "Cash"],
  ["BANK_TRANSFER", "Bank transfer"],
  ["ECOCASH", "EcoCash"],
  ["CARD", "Card"],
  ["PAYNOW", "Paynow"],
  ["STRIPE", "Stripe"],
  ["OTHER", "Other"]
];

function label(value: string) {
  return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
}

async function parseResponse(response: Response) {
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error ?? "Request failed.");
  return body;
}

export function FinanceActions({ invoices, quotations }: { invoices: InvoiceOption[]; quotations: QuotationOption[] }) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <PaymentForm invoices={invoices} />
      <ExpenseForm />
      <QuotationActions quotations={quotations} />
    </div>
  );
}

function PaymentForm({ invoices }: { invoices: InvoiceOption[] }) {
  const router = useRouter();
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(invoices[0]?.id ?? "");
  const [state, setState] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const selectedInvoice = invoices.find((invoice) => invoice.id === selectedInvoiceId);

  async function submit(formData: FormData) {
    setState("saving");
    setMessage("");
    try {
      await parseResponse(
        await fetch("/api/admin/billing/payments", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            invoiceId: String(formData.get("invoiceId") ?? ""),
            amount: Number(formData.get("amount") ?? 0),
            method: String(formData.get("method") ?? "CASH"),
            providerReference: String(formData.get("providerReference") ?? "")
          })
        })
      );
      setState("success");
      setMessage("Payment recorded and receipt generated.");
      router.refresh();
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Could not record payment.");
    }
  }

  return (
    <section className="omni-card rounded-lg p-5">
      <h2 className="text-xl font-semibold text-ink">Record payment</h2>
      {invoices.length ? (
        <form action={submit} className="mt-4 grid gap-3">
          <label>
            Invoice
            <select name="invoiceId" value={selectedInvoiceId} onChange={(event) => setSelectedInvoiceId(event.target.value)}>
              {invoices.map((invoice) => (
                <option key={invoice.id} value={invoice.id}>
                  {invoice.invoiceNumber} - {invoice.customerName}
                </option>
              ))}
            </select>
          </label>
          <div className="grid gap-3 md:grid-cols-2">
            <label>
              Amount
              <input name="amount" required type="number" min="0.01" step="0.01" defaultValue={selectedInvoice?.balanceDue.toFixed(2) ?? ""} />
            </label>
            <label>
              Method
              <select name="method" defaultValue="CASH">
                {paymentMethods.map(([value, text]) => <option key={value} value={value}>{text}</option>)}
              </select>
            </label>
          </div>
          <label>Reference<input name="providerReference" placeholder="Bank ref, EcoCash code, card ref..." /></label>
          <button disabled={state === "saving"} className="rounded-md bg-copper px-4 py-3 text-sm font-semibold text-ink shadow-lift disabled:opacity-70">
            <LoadingButtonContent loading={state === "saving"} loadingLabel="Recording payment">
              Record payment
            </LoadingButtonContent>
          </button>
          {message ? <p className={`text-sm font-semibold ${state === "error" ? "text-red-700" : "text-teal"}`}>{message}</p> : null}
        </form>
      ) : (
        <p className="mt-4 text-sm text-slate-600">No unpaid invoices are available for payment capture.</p>
      )}
    </section>
  );
}

function ExpenseForm() {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(formData: FormData) {
    setState("saving");
    setMessage("");
    try {
      await parseResponse(
        await fetch("/api/admin/finance/expenses", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            category: String(formData.get("category") ?? ""),
            vendorName: String(formData.get("vendorName") ?? ""),
            description: String(formData.get("description") ?? ""),
            amount: Number(formData.get("amount") ?? 0),
            currency: String(formData.get("currency") ?? "USD"),
            method: String(formData.get("method") ?? ""),
            status: String(formData.get("status") ?? "PAID"),
            expenseDate: String(formData.get("expenseDate") ?? ""),
            reference: String(formData.get("reference") ?? ""),
            notes: String(formData.get("notes") ?? "")
          })
        })
      );
      setState("success");
      setMessage("Expense recorded.");
      router.refresh();
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Could not record expense.");
    }
  }

  return (
    <section className="omni-card rounded-lg p-5">
      <h2 className="text-xl font-semibold text-ink">Record expense</h2>
      <form action={submit} className="mt-4 grid gap-3">
        <div className="grid gap-3 md:grid-cols-2">
          <label>Category<input name="category" required placeholder="Parts, fuel, hosting..." /></label>
          <label>Vendor<input name="vendorName" placeholder="Supplier or payee" /></label>
        </div>
        <label>Description<input name="description" required placeholder="What was paid for?" /></label>
        <div className="grid gap-3 md:grid-cols-3">
          <label>Amount<input name="amount" required type="number" min="0.01" step="0.01" /></label>
          <label>Currency<input name="currency" defaultValue="USD" maxLength={3} /></label>
          <label>
            Status
            <select name="status" defaultValue="PAID">
              <option value="PAID">Paid</option>
              <option value="APPROVED">Approved</option>
              <option value="DRAFT">Draft</option>
              <option value="VOID">Void</option>
            </select>
          </label>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <label>
            Method
            <select name="method" defaultValue="">
              <option value="">Not specified</option>
              {paymentMethods.map(([value, text]) => <option key={value} value={value}>{text}</option>)}
            </select>
          </label>
          <label>Date<input name="expenseDate" type="date" /></label>
        </div>
        <label>Reference<input name="reference" placeholder="Receipt, invoice or transaction reference" /></label>
        <label>Notes<textarea name="notes" rows={2} placeholder="Optional accounting note" /></label>
        <button disabled={state === "saving"} className="rounded-md bg-ink px-4 py-3 text-sm font-semibold text-white shadow-sm disabled:opacity-70">
          <LoadingButtonContent loading={state === "saving"} loadingLabel="Recording expense">
            Record expense
          </LoadingButtonContent>
        </button>
        {message ? <p className={`text-sm font-semibold ${state === "error" ? "text-red-700" : "text-teal"}`}>{message}</p> : null}
      </form>
    </section>
  );
}

function QuotationActions({ quotations }: { quotations: QuotationOption[] }) {
  const router = useRouter();
  const [stateById, setStateById] = useState<Record<string, "idle" | "saving" | "success" | "error">>({});
  const [messageById, setMessageById] = useState<Record<string, string>>({});
  const actionable = quotations.filter((quote) => quote.status === "DRAFT" || (quote.status === "ACCEPTED" && !quote.hasInvoice));

  async function run(quotation: QuotationOption, action: "send" | "convert") {
    setStateById((values) => ({ ...values, [quotation.id]: "saving" }));
    setMessageById((values) => ({ ...values, [quotation.id]: "" }));
    const endpoint =
      action === "send"
        ? `/api/admin/billing/quotations/${quotation.id}/send`
        : `/api/admin/billing/quotations/${quotation.id}/convert-to-invoice`;

    try {
      await parseResponse(
        await fetch(endpoint, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: action === "convert" ? JSON.stringify({}) : undefined
        })
      );
      setStateById((values) => ({ ...values, [quotation.id]: "success" }));
      setMessageById((values) => ({ ...values, [quotation.id]: action === "send" ? "Quotation sent." : "Invoice created." }));
      router.refresh();
    } catch (error) {
      setStateById((values) => ({ ...values, [quotation.id]: "error" }));
      setMessageById((values) => ({ ...values, [quotation.id]: error instanceof Error ? error.message : "Action failed." }));
    }
  }

  return (
    <section className="omni-card rounded-lg p-5 lg:col-span-2">
      <h2 className="text-xl font-semibold text-ink">Quotation actions</h2>
      {actionable.length ? (
        <div className="mt-4 grid gap-3">
          {actionable.map((quotation) => {
            const action = quotation.status === "DRAFT" ? "send" : "convert";
            const saving = stateById[quotation.id] === "saving";
            const message = messageById[quotation.id];
            return (
              <div key={quotation.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-white p-4">
                <div>
                  <p className="font-semibold text-ink">{quotation.quotationNumber}</p>
                  <p className="text-sm text-slate-600">{label(quotation.status)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => run(quotation, action)}
                  disabled={saving}
                  className="rounded-md bg-copper px-4 py-2 text-sm font-semibold text-ink disabled:opacity-70"
                >
                  <LoadingButtonContent loading={saving} loadingLabel={action === "send" ? "Sending" : "Creating invoice"}>
                    {action === "send" ? "Send quote" : "Create invoice"}
                  </LoadingButtonContent>
                </button>
                {message ? <p className={`basis-full text-sm font-semibold ${stateById[quotation.id] === "error" ? "text-red-700" : "text-teal"}`}>{message}</p> : null}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="mt-4 text-sm text-slate-600">No draft or accepted quotations need action right now.</p>
      )}
    </section>
  );
}
