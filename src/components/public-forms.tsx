"use client";

import { useEffect, useState } from "react";
import { BrandLoader, LoadingButtonContent } from "@/components/brand-loader";

type PublicServiceOption = {
  id: string;
  name: string;
  category?: { name: string } | null;
};

export function ContactForm() {
  const [sent, setSent] = useState(false);

  return (
    <form
      className="rounded-lg border border-line bg-white p-5 shadow-sm"
      onSubmit={(event) => {
        event.preventDefault();
        setSent(true);
      }}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label>Full name<input name="name" required minLength={2} /></label>
        <label>Phone<input name="phone" required minLength={7} /></label>
        <label>Email<input name="email" type="email" /></label>
        <label>Subject<input name="subject" required minLength={3} /></label>
      </div>
      <label className="mt-4">Message<textarea name="message" rows={6} required minLength={12} /></label>
      <button className="mt-5 w-full bg-ink px-5 py-3 text-sm font-semibold text-white">Send message</button>
      {sent ? <p className="mt-4 text-sm font-semibold text-teal">Message captured. Connect this form to the CRM/API before production launch.</p> : null}
    </form>
  );
}

export function PublicServiceRequestForm() {
  const [services, setServices] = useState<PublicServiceOption[]>([]);
  const [state, setState] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadServices() {
      try {
        const response = await fetch("/api/services");
        const body = await response.json();
        if (active && response.ok) {
          setServices(body.services ?? []);
        }
      } catch {
        if (active) setServices([]);
      }
    }

    loadServices();
    return () => {
      active = false;
    };
  }, []);

  async function submit(formData: FormData) {
    setState("saving");
    setMessage("");

    const serviceId = String(formData.get("serviceId") ?? "");
    const selectedService = services.find((service) => service.id === serviceId);
    const description = String(formData.get("description") ?? "");
    const payload = {
      name: String(formData.get("name") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      email: String(formData.get("email") ?? ""),
      organization: String(formData.get("organization") ?? ""),
      serviceId,
      urgency: String(formData.get("urgency") ?? "NORMAL"),
      location: String(formData.get("location") ?? ""),
      title: selectedService ? `${selectedService.name} request` : "Service request",
      description
    };

    try {
      const response = await fetch("/api/service-requests", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload)
      });
      const body = await response.json();

      if (!response.ok) {
        setState("error");
        setMessage(body.error ?? "Could not submit service request. Please check the details and try again.");
        return;
      }

      setState("success");
      setMessage(`Request ${body.request?.requestNumber ?? ""} received. OmniTech will contact you shortly.`);
    } catch {
      setState("error");
      setMessage("Could not submit service request. Please check your connection and try again.");
    }
  }

  return (
    <form
      className="rounded-lg border border-line bg-white p-5 shadow-sm"
      action={submit}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label>Full name<input name="name" required minLength={2} /></label>
        <label>Phone<input name="phone" required minLength={7} /></label>
        <label>Email<input name="email" type="email" /></label>
        <label>Organisation<input name="organization" /></label>
        <label>
          Service needed
          <select name="serviceId" required defaultValue="">
            <option value="" disabled>Select service</option>
            {services.length ? null : <option value="" disabled>Loading services</option>}
            {services.map((service) => (
              <option key={service.id} value={service.id}>{service.name}</option>
            ))}
          </select>
        </label>
        <label>
          Urgency
          <select name="urgency" defaultValue="NORMAL">
            <option>LOW</option>
            <option>NORMAL</option>
            <option>HIGH</option>
            <option>URGENT</option>
          </select>
        </label>
      </div>
      <label className="mt-4">Location or service address<input name="location" placeholder="Home, school, farm, lodge, office..." /></label>
      <label className="mt-4">Tell us what you need<textarea name="description" rows={6} required minLength={12} /></label>
      {services.length ? null : <BrandLoader label="Loading services" className="mt-4 text-sm font-semibold text-teal" />}
      <button disabled={state === "saving" || services.length === 0} className="mt-5 w-full bg-copper px-5 py-3 text-sm font-semibold text-ink disabled:cursor-not-allowed disabled:opacity-70">
        <LoadingButtonContent loading={state === "saving"} loadingLabel="Submitting">
          Submit service request
        </LoadingButtonContent>
      </button>
      {message ? <p className={`mt-4 text-sm font-semibold ${state === "error" ? "text-red-700" : "text-teal"}`}>{message}</p> : null}
    </form>
  );
}

export function TrackRepairForm() {
  const [reference, setReference] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<{
    type: string;
    reference: string;
    linkedJobNumber?: string | null;
    statusLabel: string;
    summary: string;
    service: string;
    category: string;
    customerName: string;
    technicianName?: string | null;
    device?: string | null;
    fault: string;
    updatedAt: string;
    steps: { name: string; state: string }[];
    timeline: { statusLabel: string; note?: string | null; createdAt: string }[];
    quotation?: { number: string; status: string; total: number } | null;
    invoice?: { number: string; status: string; total: number; balanceDue: number } | null;
    warranty?: { number: string; status: string; endsAt: string } | null;
  } | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    setMessage("");
    setResult(null);

    try {
      const response = await fetch(`/api/track-repair?reference=${encodeURIComponent(reference)}`);
      const body = await response.json();
      if (!response.ok) {
        setState("error");
        setMessage(body.error ?? "No matching request or job found.");
        return;
      }
      setState("success");
      setResult(body.result);
    } catch {
      setState("error");
      setMessage("Could not check that reference. Please try again.");
    }
  }

  return (
    <form
      className="rounded-lg border border-line bg-white p-5 shadow-sm"
      onSubmit={submit}
    >
      <label>Repair or job reference<input value={reference} onChange={(event) => setReference(event.target.value)} placeholder="e.g. JOB-2026-0001" required /></label>
      <button disabled={state === "loading"} className="mt-5 w-full bg-ink px-5 py-3 text-sm font-semibold text-white disabled:opacity-70">
        <LoadingButtonContent loading={state === "loading"} loadingLabel="Checking">
          Track repair
        </LoadingButtonContent>
      </button>
      {message ? <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{message}</p> : null}
      {result ? (
        <div className="mt-5 rounded-lg border border-line bg-cloud/70 p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-teal">{result.reference}{result.linkedJobNumber ? ` -> ${result.linkedJobNumber}` : ""}</p>
              <h3 className="mt-1 text-lg font-semibold text-ink">{result.service}</h3>
              <p className="mt-1 text-sm text-slate-600">{result.customerName} · {result.category}</p>
            </div>
            <span className="rounded-full bg-teal/12 px-3 py-1 text-xs font-semibold text-teal">{result.statusLabel}</span>
          </div>
          <p className="mt-4 text-sm font-medium text-slate-700">{result.summary}</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {result.device ? <Info label="Device" value={result.device} /> : null}
            {result.technicianName ? <Info label="Technician" value={result.technicianName} /> : null}
            {result.quotation ? <Info label="Quotation" value={`${result.quotation.number} · ${result.quotation.status} · USD ${result.quotation.total.toFixed(2)}`} /> : null}
            {result.invoice ? <Info label="Invoice" value={`${result.invoice.number} · ${result.invoice.status} · Balance USD ${result.invoice.balanceDue.toFixed(2)}`} /> : null}
            {result.warranty ? <Info label="Warranty" value={`${result.warranty.number} · ${result.warranty.status}`} /> : null}
            <Info label="Last updated" value={new Date(result.updatedAt).toLocaleString()} />
          </div>
          <div className="mt-5 grid gap-2 sm:grid-cols-4">
            {result.steps.map((step) => (
              <div key={step.name} className={`rounded-md border px-3 py-2 text-xs font-semibold ${step.state === "done" ? "border-success/30 bg-success/10 text-success" : step.state === "current" ? "border-teal/30 bg-teal/10 text-teal" : "border-line bg-white text-slate-500"}`}>
                {step.name}
              </div>
            ))}
          </div>
          <div className="mt-5">
            <p className="text-sm font-semibold text-ink">Latest updates</p>
            <div className="mt-2 grid gap-2">
              {result.timeline.map((item, index) => (
                <div key={`${item.statusLabel}-${index}`} className="rounded-md bg-white px-3 py-2 text-sm text-slate-600">
                  <span className="font-semibold text-ink">{item.statusLabel}</span>
                  {item.note ? <span> · {item.note}</span> : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </form>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-white px-3 py-2">
      <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-ink">{value}</p>
    </div>
  );
}
