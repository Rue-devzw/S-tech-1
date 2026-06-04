"use client";

import { Camera, CheckSquare, ClipboardList, Clock, Package, PenLine, RefreshCw, Wrench } from "lucide-react";
import { useState } from "react";
import { ImageLoadingPlaceholder, LoadingButtonContent } from "@/components/brand-loader";

type TechnicianJob = {
  id: string;
  jobNumber: string;
  type: string;
  status: string;
  priority: string;
  dueLabel: string;
  assignedTo: string;
  customer: { name: string; phone: string | null };
  faultDescription: string;
  device: { type: string; make: string | null; model: string | null; serialNumber: string | null; conditionNotes: string | null; accessories: string | null } | null;
  repairStatus: string | null;
  faultCategory: string | null;
  accessoriesReceived: string[];
  devicePhotos: { filename: string; url: string }[];
  requiredParts: { id: string; partName: string; quantity: number; isRequired: boolean; notes: string | null; inventoryItem: { name: string; sku: string; quantityOnHand: number; quantityReserved: number } | null }[];
  repairNotes: { id: string; note: string; author: string; createdAt: string }[];
  testingChecklists: { id: string; title: string; completedAt: Date | string | null; notes: string | null }[];
  diagnosticChecklists: { id: string; title: string; completedAt: Date | string | null; notes: string | null }[];
  diagnoses: { status: string; symptoms: string; findings: string; recommendation: string; createdAt: string }[];
};

type Props = {
  technicianName: string;
  stats: { assigned: number; diagnosisQueue: number; overdue: number; testing: number; waitingParts: number };
  jobs: TechnicianJob[];
};

const statusActions = [
  { label: "Start diagnosis", status: "DIAGNOSING" },
  { label: "Start work", status: "IN_PROGRESS" },
  { label: "Waiting parts", status: "WAITING_PARTS" },
  { label: "Testing", status: "QUALITY_CHECK" },
  { label: "Ready", status: "READY_FOR_COLLECTION" }
];

function label(value: string | null | undefined) {
  return (value ?? "N/A").replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function TechnicianDashboard({ technicianName, stats, jobs }: Props) {
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState("");
  const [noteBusy, setNoteBusy] = useState("");
  const [checklistBusy, setChecklistBusy] = useState("");

  function flash(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 4500);
  }

  async function updateStatus(jobId: string, toStatus: string) {
    setBusy(`${jobId}-${toStatus}`);
    const response = await fetch(`/api/technician/jobs/${jobId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toStatus, note: "Updated from technician dashboard." })
    });
    setBusy("");
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      flash(payload.error ?? "Status could not be updated.");
      return;
    }
    flash("Job status updated. Refresh to load the latest queue.");
  }

  async function addNote(jobId: string, form: HTMLFormElement) {
    setNoteBusy(jobId);
    const data = new FormData(form);
    const note = String(data.get("note") ?? "");
    const response = await fetch(`/api/technician/jobs/${jobId}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note })
    });
    setNoteBusy("");
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      flash(payload.error ?? "Note could not be saved.");
      return;
    }
    form.reset();
    flash("Repair note saved.");
  }

  async function saveChecklist(jobId: string, form: HTMLFormElement) {
    setChecklistBusy(jobId);
    const data = new FormData(form);
    const response = await fetch(`/api/technician/jobs/${jobId}/checklists`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "TEST",
        title: String(data.get("title") || "Testing checklist"),
        completed: data.get("completed") === "on",
        notes: String(data.get("notes") ?? ""),
        items: [
          { label: "Power and startup checked", checked: data.get("power") === "on" },
          { label: "Primary fault retested", checked: data.get("fault") === "on" },
          { label: "Customer accessories verified", checked: data.get("accessories") === "on" }
        ]
      })
    });
    setChecklistBusy("");
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      flash(payload.error ?? "Checklist could not be saved.");
      return;
    }
    form.reset();
    flash("Testing checklist saved.");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal">Technician workspace</p>
          <h1 className="mt-2 text-3xl font-bold text-ink">Assigned jobs for {technicianName}</h1>
          <p className="mt-2 max-w-3xl text-slate-600">
            Work from diagnosis through testing without exposing invoices, quotations, payment records or admin settings.
          </p>
        </div>
        <button onClick={() => window.location.reload()} className="inline-flex items-center gap-2 border border-line bg-white px-4 py-2 text-sm font-semibold text-ink">
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {notice ? <div className="mt-5 rounded-lg border border-teal/30 bg-teal/10 p-4 text-sm font-semibold text-teal">{notice}</div> : null}

      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Metric icon={ClipboardList} label="Assigned" value={stats.assigned} />
        <Metric icon={Wrench} label="Diagnosis queue" value={stats.diagnosisQueue} />
        <Metric icon={Clock} label="Overdue" value={stats.overdue} />
        <Metric icon={CheckSquare} label="Testing" value={stats.testing} />
        <Metric icon={Package} label="Waiting parts" value={stats.waitingParts} />
      </section>

      <section className="mt-6 grid gap-5">
        {jobs.length ? jobs.map((job) => (
          <article key={job.id} className="rounded-lg border border-line bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-teal">{job.jobNumber} · {label(job.type)}</p>
                <h2 className="mt-1 text-2xl font-bold text-ink">{job.customer.name}</h2>
                <p className="mt-2 text-sm text-slate-600">{job.customer.phone ?? "No phone"} · Due {job.dueLabel}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusPill value={job.status} />
                <StatusPill value={job.priority} />
              </div>
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_0.9fr]">
              <div className="grid gap-4">
                <section className="rounded-lg bg-cloud p-4">
                  <h3 className="font-semibold text-ink">Customer fault description</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{job.faultDescription}</p>
                </section>

                <section className="rounded-lg border border-line p-4">
                  <h3 className="font-semibold text-ink">Device</h3>
                  <div className="mt-3 grid gap-3 text-sm text-slate-600 md:grid-cols-2">
                    <p><span className="font-semibold text-ink">Type:</span> {label(job.device?.type)}</p>
                    <p><span className="font-semibold text-ink">Make/model:</span> {[job.device?.make, job.device?.model].filter(Boolean).join(" ") || "N/A"}</p>
                    <p><span className="font-semibold text-ink">Serial:</span> {job.device?.serialNumber ?? "N/A"}</p>
                    <p><span className="font-semibold text-ink">Fault category:</span> {label(job.faultCategory)}</p>
                    <p className="md:col-span-2"><span className="font-semibold text-ink">Condition:</span> {job.device?.conditionNotes ?? "No condition notes"}</p>
                    <p className="md:col-span-2"><span className="font-semibold text-ink">Accessories:</span> {job.accessoriesReceived.length ? job.accessoriesReceived.join(", ") : job.device?.accessories ?? "None recorded"}</p>
                  </div>
                </section>

                <section className="rounded-lg border border-line p-4">
                  <h3 className="flex items-center gap-2 font-semibold text-ink"><Camera size={18} /> Device photos</h3>
                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    {job.devicePhotos.length ? job.devicePhotos.map((photo) => (
                      <figure key={`${job.id}-${photo.filename}`} className="rounded-lg border border-line bg-cloud p-3">
                        {photo.url ? (
                          <div className="relative h-28 overflow-hidden rounded-md bg-cloud">
                            <ImageLoadingPlaceholder label="Loading photo" className="absolute inset-0 rounded-none" />
                            <img src={photo.url} alt={photo.filename} className="relative h-full w-full object-cover" />
                          </div>
                        ) : (
                          <ImageLoadingPlaceholder label="Photo file" className="h-28 w-full" />
                        )}
                        <figcaption className="mt-2 truncate text-xs font-semibold text-slate-600">{photo.filename}</figcaption>
                      </figure>
                    )) : <p className="text-sm text-slate-600">No condition photos attached.</p>}
                  </div>
                </section>
              </div>

              <div className="grid gap-4">
                <section className="rounded-lg border border-line p-4">
                  <h3 className="font-semibold text-ink">Update status</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {statusActions.map((action) => (
                      <button
                        key={action.status}
                        disabled={busy === `${job.id}-${action.status}`}
                        onClick={() => updateStatus(job.id, action.status)}
                        className="border border-line bg-white px-3 py-2 text-sm font-semibold text-ink disabled:opacity-50"
                      >
                        <LoadingButtonContent loading={busy === `${job.id}-${action.status}`} loadingLabel="Updating">
                          {action.label}
                        </LoadingButtonContent>
                      </button>
                    ))}
                  </div>
                </section>

                <section className="rounded-lg border border-line p-4">
                  <h3 className="font-semibold text-ink">Required parts</h3>
                  <div className="mt-3 grid gap-2">
                    {job.requiredParts.length ? job.requiredParts.map((part) => (
                      <div key={part.id} className="rounded-lg bg-cloud p-3 text-sm">
                        <p className="font-semibold text-ink">{part.partName} × {part.quantity}</p>
                        <p className="text-slate-600">{part.inventoryItem ? `${part.inventoryItem.sku} · on hand ${part.inventoryItem.quantityOnHand}` : "Not linked to stock item"}</p>
                        {part.notes ? <p className="mt-1 text-slate-600">{part.notes}</p> : null}
                      </div>
                    )) : <p className="text-sm text-slate-600">No parts recorded.</p>}
                  </div>
                </section>

                <section className="rounded-lg border border-line p-4">
                  <h3 className="font-semibold text-ink">Repair notes</h3>
                  <div className="mt-3 grid gap-2">
                    {job.repairNotes.map((note) => (
                      <p key={note.id} className="rounded-lg bg-cloud p-3 text-sm leading-6 text-slate-700">{note.note}</p>
                    ))}
                  </div>
                  <form className="mt-3" onSubmit={(event) => { event.preventDefault(); addNote(job.id, event.currentTarget); }}>
                    <textarea name="note" required rows={3} placeholder="Add repair note..." />
                    <button disabled={noteBusy === job.id} className="mt-2 inline-flex items-center gap-2 bg-ink px-4 py-2 text-sm font-semibold text-white disabled:opacity-70">
                      {noteBusy === job.id ? <LoadingButtonContent loading loadingLabel="Saving note">Save note</LoadingButtonContent> : <><PenLine size={16} /> Save note</>}
                    </button>
                  </form>
                </section>

                <section className="rounded-lg border border-line p-4">
                  <h3 className="font-semibold text-ink">Testing checklist</h3>
                  <div className="mt-3 grid gap-2">
                    {job.testingChecklists.map((checklist) => (
                      <p key={checklist.id} className="rounded-lg bg-cloud p-3 text-sm font-semibold text-ink">{checklist.title} · {checklist.completedAt ? "Completed" : "Open"}</p>
                    ))}
                  </div>
                  <form className="mt-3 grid gap-2" onSubmit={(event) => { event.preventDefault(); saveChecklist(job.id, event.currentTarget); }}>
                    <input name="title" placeholder="Testing checklist title" defaultValue="Final repair test" />
                    <label className="flex items-center gap-2 text-sm"><input name="power" type="checkbox" />Power and startup checked</label>
                    <label className="flex items-center gap-2 text-sm"><input name="fault" type="checkbox" />Primary fault retested</label>
                    <label className="flex items-center gap-2 text-sm"><input name="accessories" type="checkbox" />Accessories verified</label>
                    <label className="flex items-center gap-2 text-sm"><input name="completed" type="checkbox" />Mark completed</label>
                    <textarea name="notes" rows={2} placeholder="Testing notes..." />
                    <button disabled={checklistBusy === job.id} className="bg-copper px-4 py-2 text-sm font-semibold text-ink disabled:opacity-70">
                      <LoadingButtonContent loading={checklistBusy === job.id} loadingLabel="Saving checklist">
                        Save checklist
                      </LoadingButtonContent>
                    </button>
                  </form>
                </section>
              </div>
            </div>
          </article>
        )) : <div className="rounded-lg border border-line bg-white p-8 text-center text-slate-600">No assigned jobs are currently in your queue.</div>}
      </section>
    </div>
  );
}

function Metric({ icon: Icon, label: title, value }: { icon: typeof ClipboardList; label: string; value: number }) {
  return (
    <article className="rounded-lg border border-line bg-white p-5">
      <Icon className="text-teal" size={22} />
      <p className="mt-4 text-sm font-semibold text-slate-500">{title}</p>
      <p className="mt-1 text-2xl font-bold text-ink">{value}</p>
    </article>
  );
}

function StatusPill({ value }: { value: string }) {
  return <span className="rounded-full bg-cloud px-3 py-1 text-xs font-semibold text-slate-700">{label(value)}</span>;
}
