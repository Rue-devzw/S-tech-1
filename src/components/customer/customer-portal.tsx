"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Download,
  FileText,
  ImagePlus,
  MessageSquare,
  ReceiptText,
  ShieldCheck,
  Star,
  Wrench
} from "lucide-react";
import { publicServices, repairTrackingSteps } from "@/lib/public-content";

type QuoteStatus = "Awaiting your response" | "Approved" | "Rejected";

export function CustomerPortal({ customerName }: { customerName: string }) {
  const [active, setActive] = useState("overview");
  const [quoteStatus, setQuoteStatus] = useState<QuoteStatus>("Awaiting your response");
  const [notice, setNotice] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [rating, setRating] = useState(0);

  const tabs = [
    ["overview", "Overview"],
    ["request", "Request service"],
    ["repair", "Track repair"],
    ["quotes", "Quotes"],
    ["invoices", "Invoices"],
    ["history", "History"],
    ["warranty", "Warranty"],
    ["install", "Installations"],
    ["messages", "Messages"],
    ["rate", "Rate work"]
  ];

  const activeJob = useMemo(
    () => ({
      number: "JOB-2026-SEED01",
      service: "Starlink installation",
      status: "In progress",
      nextStep: "Technician will confirm mounting position and run signal tests.",
      progress: 4
    }),
    []
  );

  function saveForm(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 4500);
  }

  function downloadInvoice() {
    const text = `OmniTech Solutions\nInvoice INV-2026-SEED01\nCustomer: ${customerName}\nAmount: USD 180.00\nStatus: Partially paid\n`;
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "INV-2026-SEED01.txt";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="rounded-lg bg-brand-band p-6 text-white shadow-glow">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-100">Customer portal</p>
          <h1 className="mt-2 text-3xl font-bold text-white">Hello, {customerName}</h1>
          <p className="mt-2 text-white/82">Request work, follow progress and handle approvals without technical jargon.</p>
        </div>
        <a href="/request-service" className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-ink shadow-lift">
          Quick request
        </a>
      </div>
      </div>

      {notice ? <div className="mt-5 rounded-lg border border-teal/30 bg-teal/10 p-4 text-sm font-semibold text-teal">{notice}</div> : null}

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        {tabs.map(([id, label]) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            className={`shrink-0 border px-4 py-2 text-sm font-semibold ${active === id ? "border-teal bg-teal text-white shadow-lift" : "border-line bg-white/88 text-slate-700"}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {active === "overview" ? <Overview activeJob={activeJob} quoteStatus={quoteStatus} /> : null}
        {active === "request" ? <ServiceRequestPanel onSave={saveForm} photos={photos} setPhotos={setPhotos} /> : null}
        {active === "repair" ? <RepairTrackingPanel activeJob={activeJob} /> : null}
        {active === "quotes" ? <QuotePanel quoteStatus={quoteStatus} setQuoteStatus={setQuoteStatus} onSave={saveForm} /> : null}
        {active === "invoices" ? <InvoicePanel onDownload={downloadInvoice} /> : null}
        {active === "history" ? <HistoryPanel /> : null}
        {active === "warranty" ? <WarrantyPanel onSave={saveForm} /> : null}
        {active === "install" ? <InstallationPanel onSave={saveForm} /> : null}
        {active === "messages" ? <MessagesPanel onSave={saveForm} /> : null}
        {active === "rate" ? <RatingPanel rating={rating} setRating={setRating} onSave={saveForm} /> : null}
      </div>
    </div>
  );
}

function PortalCard({ title, icon: Icon, children }: { title: string; icon: typeof Wrench; children: React.ReactNode }) {
  return (
    <section className="omni-card rounded-lg p-5">
      <div className="mb-4 flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-md bg-teal/12 text-teal">
          <Icon size={20} />
        </span>
        <h2 className="text-xl font-semibold text-ink">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Overview({ activeJob, quoteStatus }: { activeJob: { number: string; service: string; status: string; nextStep: string }; quoteStatus: string }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <PortalCard title="Active job" icon={Wrench}>
        <p className="font-semibold text-ink">{activeJob.number}</p>
        <p className="mt-1 text-sm text-slate-600">{activeJob.service}</p>
        <span className="mt-4 inline-flex rounded-full bg-sky/10 px-3 py-1 text-xs font-semibold text-sky">{activeJob.status}</span>
        <p className="mt-4 text-sm leading-6 text-slate-600">{activeJob.nextStep}</p>
      </PortalCard>
      <PortalCard title="Quotation" icon={FileText}>
        <p className="text-3xl font-semibold text-ink">USD 180.00</p>
        <p className="mt-2 text-sm text-slate-600">{quoteStatus}</p>
      </PortalCard>
      <PortalCard title="Need help?" icon={MessageSquare}>
        <p className="text-sm leading-6 text-slate-600">Send a message with your job number. OmniTech will reply with the next step.</p>
        <button className="mt-4 bg-ink px-4 py-2 text-sm font-semibold text-white shadow-lift">Message OmniTech</button>
      </PortalCard>
    </div>
  );
}

function ServiceRequestPanel({ onSave, photos, setPhotos }: { onSave: (message: string) => void; photos: string[]; setPhotos: (photos: string[]) => void }) {
  return (
    <PortalCard title="Request a service" icon={Wrench}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSave("Your service request has been captured. OmniTech will contact you with the next step.");
        }}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label>
            What do you need?
            <select required defaultValue="">
              <option value="" disabled>Select service</option>
              {publicServices.map((service) => <option key={service.slug}>{service.title}</option>)}
            </select>
          </label>
          <label>
            How urgent is it?
            <select defaultValue="Normal">
              <option>Normal</option>
              <option>High</option>
              <option>Urgent</option>
            </select>
          </label>
        </div>
        <label className="mt-4">Device, site or item name<input placeholder="e.g. HP laptop, Samsung TV, Starlink kit" /></label>
        <label className="mt-4">Explain the issue<textarea required rows={5} placeholder="Tell us what happened, what you tried, and where the item/site is." /></label>
        <label className="mt-4">
          Upload photos
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(event) => setPhotos(Array.from(event.target.files ?? []).map((file) => file.name))}
          />
        </label>
        {photos.length ? <p className="mt-2 text-sm text-slate-600">Selected: {photos.join(", ")}</p> : null}
        <button className="mt-5 bg-copper px-5 py-3 text-sm font-semibold text-ink">Submit request</button>
      </form>
    </PortalCard>
  );
}

function RepairTrackingPanel({ activeJob }: { activeJob: { number: string; service: string; status: string; progress: number } }) {
  return (
    <PortalCard title="Track repair status" icon={CheckCircle2}>
      <p className="font-semibold text-ink">{activeJob.number} · {activeJob.service}</p>
      <div className="mt-5 grid gap-3">
        {repairTrackingSteps.map((step, index) => (
          <div key={step} className="flex items-center gap-3">
            <span className={`grid size-8 place-items-center rounded-full text-xs font-bold ${index < activeJob.progress ? "bg-teal text-white" : "bg-cloud text-slate-500"}`}>{index + 1}</span>
            <span className={index < activeJob.progress ? "font-semibold text-ink" : "text-slate-500"}>{step}</span>
          </div>
        ))}
      </div>
    </PortalCard>
  );
}

function QuotePanel({ quoteStatus, setQuoteStatus, onSave }: { quoteStatus: QuoteStatus; setQuoteStatus: (status: QuoteStatus) => void; onSave: (message: string) => void }) {
  return (
    <PortalCard title="View and approve quotation" icon={FileText}>
      <div className="rounded-lg border border-line bg-cloud p-4">
        <p className="text-sm font-semibold text-teal">QTE-2026-SEED01</p>
        <p className="mt-2 text-2xl font-semibold text-ink">USD 180.00</p>
        <p className="mt-2 text-sm text-slate-600">Starlink installation labour, mounting and cable management materials.</p>
        <p className="mt-3 text-sm font-semibold text-slate-700">Status: {quoteStatus}</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <button onClick={() => { setQuoteStatus("Approved"); onSave("Quotation approved. OmniTech can continue with the work."); }} className="bg-teal px-4 py-2 text-sm font-semibold text-white">Approve quote</button>
        <button onClick={() => { setQuoteStatus("Rejected"); onSave("Quotation rejected. OmniTech will review your response."); }} className="border border-line bg-white px-4 py-2 text-sm font-semibold text-ink">Reject quote</button>
      </div>
    </PortalCard>
  );
}

function InvoicePanel({ onDownload }: { onDownload: () => void }) {
  return (
    <PortalCard title="Invoices and receipts" icon={ReceiptText}>
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-line bg-cloud p-4">
        <div>
          <p className="font-semibold text-ink">INV-2026-SEED01</p>
          <p className="text-sm text-slate-600">USD 180.00 · Partially paid</p>
        </div>
        <button onClick={onDownload} className="inline-flex items-center gap-2 bg-ink px-4 py-2 text-sm font-semibold text-white">
          <Download size={16} /> Download
        </button>
      </div>
    </PortalCard>
  );
}

function HistoryPanel() {
  return (
    <PortalCard title="Service history" icon={FileText}>
      <div className="grid gap-3">
        {["Starlink installation - In progress", "Laptop SSD upgrade - Completed", "Router setup - Completed"].map((item) => (
          <div key={item} className="rounded-lg border border-line p-4 text-sm text-slate-700">{item}</div>
        ))}
      </div>
    </PortalCard>
  );
}

function WarrantyPanel({ onSave }: { onSave: (message: string) => void }) {
  return (
    <PortalCard title="Submit warranty claim" icon={ShieldCheck}>
      <form onSubmit={(event) => { event.preventDefault(); onSave("Warranty claim submitted. OmniTech will review the job record."); }}>
        <label>Related job or invoice<input required placeholder="e.g. JOB-2026-SEED01" /></label>
        <label className="mt-4">What went wrong?<textarea required rows={5} /></label>
        <button className="mt-5 bg-ink px-5 py-3 text-sm font-semibold text-white">Submit claim</button>
      </form>
    </PortalCard>
  );
}

function InstallationPanel({ onSave }: { onSave: (message: string) => void }) {
  return (
    <PortalCard title="Book installation" icon={CalendarDays}>
      <form onSubmit={(event) => { event.preventDefault(); onSave("Installation booking requested. OmniTech will confirm availability."); }}>
        <div className="grid gap-4 md:grid-cols-2">
          <label>Installation type<select><option>Starlink</option><option>Networking</option><option>ICT setup</option></select></label>
          <label>Preferred date<input type="date" required /></label>
        </div>
        <label className="mt-4">Site address<input required placeholder="Where should the technician come?" /></label>
        <label className="mt-4">Access notes<textarea rows={4} placeholder="Gate, roof access, contact person, power availability..." /></label>
        <button className="mt-5 bg-copper px-5 py-3 text-sm font-semibold text-ink">Request booking</button>
      </form>
    </PortalCard>
  );
}

function MessagesPanel({ onSave }: { onSave: (message: string) => void }) {
  return (
    <PortalCard title="Send a message" icon={MessageSquare}>
      <form onSubmit={(event) => { event.preventDefault(); onSave("Message sent to OmniTech support."); }}>
        <label>Message<textarea required rows={6} placeholder="Ask a question or add information for your technician." /></label>
        <button className="mt-5 bg-ink px-5 py-3 text-sm font-semibold text-white">Send message</button>
      </form>
    </PortalCard>
  );
}

function RatingPanel({ rating, setRating, onSave }: { rating: number; setRating: (rating: number) => void; onSave: (message: string) => void }) {
  return (
    <PortalCard title="Rate completed work" icon={Star}>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((value) => (
          <button key={value} onClick={() => setRating(value)} className={`grid size-11 place-items-center border ${rating >= value ? "border-copper bg-copper text-ink" : "border-line bg-white text-slate-500"}`} aria-label={`Rate ${value} stars`}>
            <Star size={18} />
          </button>
        ))}
      </div>
      <label className="mt-4">Comment<textarea rows={4} placeholder="Tell us what went well or what we should improve." /></label>
      <button onClick={() => onSave("Thank you for rating OmniTech’s work.")} className="mt-5 bg-teal px-5 py-3 text-sm font-semibold text-white">Submit rating</button>
    </PortalCard>
  );
}
