"use client";

import { BellRing, FileText, Mail, MessageSquareText, RefreshCw, Send, Smartphone } from "lucide-react";
import { useMemo, useState } from "react";
import { LoadingButtonContent } from "@/components/brand-loader";

const triggers = [
  "REQUEST_RECEIVED",
  "JOB_CREATED",
  "DIAGNOSIS_COMPLETE",
  "QUOTATION_SENT",
  "QUOTATION_APPROVED",
  "PARTS_ORDERED",
  "REPAIR_IN_PROGRESS",
  "READY_FOR_COLLECTION",
  "INVOICE_ISSUED",
  "PAYMENT_RECEIVED",
  "WARRANTY_EXPIRING",
  "FOLLOW_UP_REMINDER"
] as const;

const channels = ["EMAIL", "WHATSAPP", "SMS", "IN_APP"] as const;

const starterTemplates = [
  { trigger: "REQUEST_RECEIVED", channel: "EMAIL", status: "Active", variables: "customerName, requestNumber" },
  { trigger: "QUOTATION_SENT", channel: "WHATSAPP", status: "Active", variables: "customerName, quotationNumber, total" },
  { trigger: "READY_FOR_COLLECTION", channel: "SMS", status: "Ready", variables: "customerName, jobNumber" },
  { trigger: "WARRANTY_EXPIRING", channel: "EMAIL", status: "Active", variables: "customerName, warrantyNumber, expiryDate" }
];

const recentLogs = [
  { trigger: "REQUEST_RECEIVED", channel: "EMAIL", recipient: "customer@example.com", status: "QUEUED" },
  { trigger: "QUOTATION_SENT", channel: "WHATSAPP", recipient: "+263 718 704 505", status: "SENT" },
  { trigger: "FOLLOW_UP_REMINDER", channel: "IN_APP", recipient: "manager@omnitech.local", status: "QUEUED" }
];

function label(value: string) {
  return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function CommunicationsDashboard() {
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState("");
  const coveredTriggers = useMemo(() => new Set(starterTemplates.map((item) => item.trigger)), []);

  function flash(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 4500);
  }

  async function post(path: string, body: Record<string, unknown>, message: string) {
    const busyKey = `${path}:${String(body.trigger ?? body.key ?? body.recipient ?? "action")}`;
    setBusy(busyKey);
    const response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    setBusy("");
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      flash(payload.error ?? "The communication action could not be completed.");
      return;
    }
    flash(message);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal">Communication engine</p>
          <h1 className="mt-2 text-3xl font-bold text-ink">Templates, triggers and delivery logs</h1>
          <p className="mt-2 max-w-3xl text-slate-600">
            Keep customers informed through email, WhatsApp-ready flows, SMS-ready providers and internal updates across the full service lifecycle.
          </p>
        </div>
        <button
          onClick={() => post("/api/admin/communications/dispatch", { limit: 25 }, "Queued notifications dispatched through configured providers.")}
          disabled={busy === "/api/admin/communications/dispatch:action"}
          className="inline-flex items-center gap-2 bg-ink px-4 py-2 text-sm font-semibold text-white"
        >
          {busy === "/api/admin/communications/dispatch:action" ? (
            <LoadingButtonContent loading loadingLabel="Dispatching">Dispatch queue</LoadingButtonContent>
          ) : (
            <>
              <RefreshCw size={16} />
              Dispatch queue
            </>
          )}
        </button>
      </div>

      {notice ? <div className="mt-5 rounded-lg border border-teal/30 bg-teal/10 p-4 text-sm font-semibold text-teal">{notice}</div> : null}

      <section className="mt-6 grid gap-4 md:grid-cols-4">
        <Metric icon={Mail} label="Email" value="Provider-ready" />
        <Metric icon={MessageSquareText} label="WhatsApp" value="Workflow-ready" />
        <Metric icon={Smartphone} label="SMS" value="Provider-ready" />
        <Metric icon={BellRing} label="Triggers" value={`${triggers.length} automated`} />
      </section>

      <div className="mt-6 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-lg border border-line bg-white p-5">
          <div className="mb-4 flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-md bg-cloud text-teal"><FileText size={20} /></span>
            <h2 className="text-xl font-semibold text-ink">Template editor</h2>
          </div>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              post(
                "/api/admin/communications/templates",
                {
                  key: String(form.get("key")),
                  name: String(form.get("name")),
                  trigger: String(form.get("trigger")),
                  channel: String(form.get("channel")),
                  subject: String(form.get("subject")),
                  body: String(form.get("body")),
                  variables: String(form.get("variables") ?? "").split(",").map((item) => item.trim()).filter(Boolean),
                  isActive: true
                },
                "Message template saved and audit logged."
              );
            }}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <label>Template key<input name="key" required placeholder="quotation.sent.whatsapp" /></label>
              <label>Name<input name="name" required placeholder="Quotation sent WhatsApp" /></label>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label>Trigger<select name="trigger" defaultValue="QUOTATION_SENT">{triggers.map((item) => <option key={item} value={item}>{label(item)}</option>)}</select></label>
              <label>Channel<select name="channel" defaultValue="WHATSAPP">{channels.map((item) => <option key={item} value={item}>{label(item)}</option>)}</select></label>
            </div>
            <label className="mt-4">Subject<input name="subject" placeholder="Quotation ready: {{quotationNumber}}" /></label>
            <label className="mt-4">Variables<input name="variables" placeholder="customerName, quotationNumber, total" /></label>
            <label className="mt-4">Message body<textarea name="body" required rows={5} placeholder="Hello {{customerName}}, your OmniTech quotation {{quotationNumber}} is ready." /></label>
            <button disabled={busy.startsWith("/api/admin/communications/templates:")} className="mt-5 w-full bg-copper px-5 py-3 text-sm font-semibold text-ink disabled:opacity-70">
              <LoadingButtonContent loading={busy.startsWith("/api/admin/communications/templates:")} loadingLabel="Saving template">
                Save template
              </LoadingButtonContent>
            </button>
          </form>
        </section>

        <section className="rounded-lg border border-line bg-white p-5">
          <h2 className="text-xl font-semibold text-ink">Automated triggers</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {triggers.map((item) => (
              <button
                key={item}
                onClick={() =>
                  post(
                    "/api/admin/communications/triggers",
                    { trigger: item, channels: ["EMAIL"], data: { customerName: "Customer", jobNumber: "JOB-0001", quotationNumber: "QT-0001" } },
                    `${label(item)} notification queued when a customer or user recipient is supplied.`
                  )
                }
                disabled={busy === `/api/admin/communications/triggers:${item}`}
                className="flex items-center justify-between rounded-lg border border-line bg-cloud p-3 text-left text-sm font-semibold text-ink"
              >
                <span>{label(item)}</span>
                {busy === `/api/admin/communications/triggers:${item}` ? (
                  <LoadingButtonContent loading loadingLabel="Queueing">Queue</LoadingButtonContent>
                ) : (
                  <span className={`rounded-full px-2 py-1 text-xs ${coveredTriggers.has(item) ? "bg-teal/10 text-teal" : "bg-white text-slate-500"}`}>
                    {coveredTriggers.has(item) ? "Seeded" : "Default"}
                  </span>
                )}
              </button>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <section className="rounded-lg border border-line bg-white p-5">
          <div className="mb-4 flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-md bg-cloud text-teal"><Send size={20} /></span>
            <h2 className="text-xl font-semibold text-ink">Manual message</h2>
          </div>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              post(
                "/api/admin/communications/manual-messages",
                {
                  channel: String(form.get("channel")),
                  recipient: String(form.get("recipient")),
                  subject: String(form.get("subject")),
                  body: String(form.get("body"))
                },
                "Manual message queued and linked to the delivery log."
              );
            }}
          >
            <label>Channel<select name="channel" defaultValue="EMAIL">{channels.map((item) => <option key={item} value={item}>{label(item)}</option>)}</select></label>
            <label className="mt-4">Recipient<input name="recipient" required placeholder="email, phone or internal user" /></label>
            <label className="mt-4">Subject<input name="subject" placeholder="Message from OmniTech Solutions" /></label>
            <label className="mt-4">Message<textarea name="body" required rows={5} placeholder="Write a clear customer update..." /></label>
            <button disabled={busy.startsWith("/api/admin/communications/manual-messages:")} className="mt-5 w-full bg-ink px-5 py-3 text-sm font-semibold text-white disabled:opacity-70">
              <LoadingButtonContent loading={busy.startsWith("/api/admin/communications/manual-messages:")} loadingLabel="Queueing message">
                Queue message
              </LoadingButtonContent>
            </button>
          </form>
        </section>

        <section className="rounded-lg border border-line bg-white p-5">
          <h2 className="text-xl font-semibold text-ink">Recent delivery activity</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="border-b border-line text-xs uppercase text-slate-500">
                <tr>
                  <th className="py-3">Trigger</th>
                  <th>Channel</th>
                  <th>Recipient</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentLogs.map((item) => (
                  <tr key={`${item.trigger}-${item.channel}`} className="border-b border-line last:border-0">
                    <td className="py-3 font-semibold text-ink">{label(item.trigger)}</td>
                    <td>{label(item.channel)}</td>
                    <td>{item.recipient}</td>
                    <td><span className="rounded-full bg-cloud px-3 py-1 text-xs font-semibold text-slate-700">{item.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            onClick={() => flash("Delivery log API: GET /api/admin/communications/logs")}
            className="mt-4 border border-line bg-white px-4 py-2 text-sm font-semibold text-ink"
          >
            Refresh logs
          </button>
        </section>
      </div>
    </div>
  );
}

function Metric({ icon: Icon, label: title, value }: { icon: typeof Mail; label: string; value: string }) {
  return (
    <article className="rounded-lg border border-line bg-white p-5">
      <Icon className="text-teal" size={22} />
      <p className="mt-4 text-sm font-semibold text-slate-500">{title}</p>
      <p className="mt-1 text-xl font-bold text-ink">{value}</p>
    </article>
  );
}
