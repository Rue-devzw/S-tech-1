"use client";

import { Bot, CheckCircle2, DollarSign, FileText, Send, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { LoadingButtonContent } from "@/components/brand-loader";

const assistantTypes = [
  "CUSTOMER_ENQUIRY",
  "DIAGNOSTICS",
  "QUOTATION_DESCRIPTION",
  "REPORT_GENERATION",
  "ADVERT_DRAFT",
  "FAQ_ASSISTANT",
  "TECHNICIAN_TROUBLESHOOTING",
  "MANAGEMENT_INSIGHTS"
] as const;

function label(value: string) {
  return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function AIAssistantConsole() {
  const [notice, setNotice] = useState("");
  const [draft, setDraft] = useState("");
  const [interactionId, setInteractionId] = useState("");
  const [busy, setBusy] = useState<"" | "generate" | "approve" | "reject">("");

  function flash(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 4500);
  }

  async function runAssistant(form: HTMLFormElement) {
    setBusy("generate");
    const data = new FormData(form);
    const response = await fetch("/api/ai/assist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: String(data.get("type")),
        input: String(data.get("input")),
        context: {
          subject: String(data.get("subject") ?? ""),
          channel: String(data.get("channel") ?? "")
        }
      })
    });
    setBusy("");
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      flash(payload.error ?? "AI assistant could not run.");
      return;
    }
    setDraft(payload.interaction?.response ?? "");
    setInteractionId(payload.interaction?.id ?? "");
    flash(payload.interaction?.approvalStatus === "PENDING" ? "Draft generated and queued for human approval." : "Assistant output generated and logged.");
  }

  async function approve(decision: "APPROVED" | "REJECTED") {
    if (!interactionId) {
      flash("Generate a draft before reviewing it.");
      return;
    }
    setBusy(decision === "APPROVED" ? "approve" : "reject");
    const response = await fetch(`/api/admin/ai/interactions/${interactionId}/approval`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decision, finalResponse: draft, note: "Reviewed in AI console" })
    });
    setBusy("");
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      flash(payload.error ?? "Review could not be saved.");
      return;
    }
    flash(decision === "APPROVED" ? "AI draft approved for customer-facing use." : "AI draft rejected and retained for audit.");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal">AI assistant layer</p>
          <h1 className="mt-2 text-3xl font-bold text-ink">Provider-agnostic AI operations</h1>
          <p className="mt-2 max-w-3xl text-slate-600">
            Generate diagnostics, reports, quote descriptions, adverts, FAQ answers, troubleshooting guides and management summaries with guardrails and approval.
          </p>
        </div>
      </div>

      {notice ? <div className="mt-5 rounded-lg border border-teal/30 bg-teal/10 p-4 text-sm font-semibold text-teal">{notice}</div> : null}

      <section className="mt-6 grid gap-4 md:grid-cols-4">
        <Metric icon={Bot} label="Provider" value="Config-driven" />
        <Metric icon={ShieldCheck} label="Guardrails" value="Safety flagged" />
        <Metric icon={CheckCircle2} label="Approval" value="Human review" />
        <Metric icon={DollarSign} label="Cost" value="Token tracked" />
      </section>

      <div className="mt-6 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-lg border border-line bg-white p-5">
          <h2 className="text-xl font-semibold text-ink">Run assistant</h2>
          <form
            className="mt-4"
            onSubmit={(event) => {
              event.preventDefault();
              runAssistant(event.currentTarget);
            }}
          >
            <label>Function<select name="type" defaultValue="DIAGNOSTICS">{assistantTypes.map((item) => <option key={item} value={item}>{label(item)}</option>)}</select></label>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label>Subject<input name="subject" placeholder="Laptop no power, Starlink advert, monthly insights..." /></label>
              <label>Channel<input name="channel" placeholder="Internal, WhatsApp, email, report" /></label>
            </div>
            <label className="mt-4">Prompt<textarea name="input" required rows={9} placeholder="Paste notes, customer enquiry, technician findings or management data..." /></label>
            <button disabled={busy === "generate"} className="mt-5 inline-flex w-full items-center justify-center gap-2 bg-copper px-5 py-3 text-sm font-semibold text-ink disabled:opacity-70">
              {busy === "generate" ? (
                <LoadingButtonContent loading loadingLabel="Generating">Generate</LoadingButtonContent>
              ) : (
                <>
                  <Send size={16} />
                  Generate
                </>
              )}
            </button>
          </form>
        </section>

        <section className="rounded-lg border border-line bg-white p-5">
          <div className="mb-4 flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-md bg-cloud text-teal"><FileText size={20} /></span>
            <h2 className="text-xl font-semibold text-ink">Draft and approval</h2>
          </div>
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            rows={16}
            placeholder="Generated output appears here. Customer-facing drafts must be reviewed before use."
          />
          <div className="mt-4 flex flex-wrap gap-3">
            <button disabled={busy === "approve"} onClick={() => approve("APPROVED")} className="bg-ink px-4 py-2 text-sm font-semibold text-white disabled:opacity-70">
              <LoadingButtonContent loading={busy === "approve"} loadingLabel="Approving">
                Approve draft
              </LoadingButtonContent>
            </button>
            <button disabled={busy === "reject"} onClick={() => approve("REJECTED")} className="border border-line bg-white px-4 py-2 text-sm font-semibold text-ink disabled:opacity-70">
              <LoadingButtonContent loading={busy === "reject"} loadingLabel="Rejecting">
                Reject draft
              </LoadingButtonContent>
            </button>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Customer-facing outputs are stored as drafts with approval status. Internal outputs are logged immediately with provider, model, token estimate, cost estimate, fallback status and safety flags.
          </p>
        </section>
      </div>
    </div>
  );
}

function Metric({ icon: Icon, label: title, value }: { icon: typeof Bot; label: string; value: string }) {
  return (
    <article className="rounded-lg border border-line bg-white p-5">
      <Icon className="text-teal" size={22} />
      <p className="mt-4 text-sm font-semibold text-slate-500">{title}</p>
      <p className="mt-1 text-xl font-bold text-ink">{value}</p>
    </article>
  );
}
