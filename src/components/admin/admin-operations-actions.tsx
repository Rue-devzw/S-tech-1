"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingButtonContent } from "@/components/brand-loader";

type TechnicianOption = {
  id: string;
  name: string;
  role: string;
};

type RequestActionItem = {
  id: string;
  requestNumber: string;
  title: string;
  description: string;
  priority: string;
  locationNote: string | null;
  status: string;
  hasJobCard: boolean;
};

type JobActionItem = {
  id: string;
  jobNumber: string;
  status: string;
};

const jobTypes = [
  ["BENCH_REPAIR", "Bench repair"],
  ["FIELD_REPAIR", "Field repair"],
  ["STARLINK_INSTALLATION", "Starlink installation"],
  ["NETWORK_INSTALLATION", "Network installation"],
  ["SOFTWARE_PROJECT", "Software project"],
  ["AUTOMATION_PROJECT", "Automation project"],
  ["SUPPORT_CONTRACT", "Support contract"]
];

const nextStatuses: Record<string, string[]> = {
  CREATED: ["ASSIGNED", "DIAGNOSING", "CANCELLED"],
  ASSIGNED: ["DIAGNOSING", "IN_PROGRESS", "CANCELLED"],
  DIAGNOSING: ["QUOTED", "WAITING_CUSTOMER", "CANCELLED"],
  QUOTED: ["APPROVED", "WAITING_CUSTOMER", "CANCELLED"],
  APPROVED: ["WAITING_PARTS", "IN_PROGRESS", "CANCELLED"],
  IN_PROGRESS: ["WAITING_PARTS", "QUALITY_CHECK", "CANCELLED"],
  WAITING_PARTS: ["IN_PROGRESS", "CANCELLED"],
  WAITING_CUSTOMER: ["QUOTED", "APPROVED", "CANCELLED"],
  QUALITY_CHECK: ["READY_FOR_COLLECTION", "READY_FOR_DELIVERY", "IN_PROGRESS"],
  READY_FOR_COLLECTION: ["PAYMENT_PENDING", "READY_FOR_DELIVERY", "COMPLETED"],
  PAYMENT_PENDING: ["READY_FOR_DELIVERY", "DELIVERED", "COMPLETED"],
  READY_FOR_DELIVERY: ["DELIVERED", "COMPLETED"],
  DELIVERED: ["WARRANTY_ACTIVE", "COMPLETED"],
  WARRANTY_ACTIVE: ["COMPLETED"]
};

function label(value: string) {
  return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
}

async function parseResponse(response: Response) {
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error ?? "Request failed.");
  return body;
}

export function RequestReviewAction({ request, technicians }: { request: RequestActionItem; technicians: TechnicianOption[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(formData: FormData) {
    setState("saving");
    setMessage("");

    const startsAt = String(formData.get("startsAt") ?? "");
    const appointmentLocation = String(formData.get("appointmentLocation") ?? "");
    const appointment = startsAt
      ? {
          startsAt,
          endsAt: new Date(new Date(startsAt).getTime() + 90 * 60 * 1000).toISOString(),
          location: appointmentLocation || request.locationNote || "OmniTech workshop",
          notes: String(formData.get("appointmentNotes") ?? "")
        }
      : undefined;

    const payload = {
      requestId: request.id,
      jobType: String(formData.get("jobType") ?? "BENCH_REPAIR"),
      assignedToId: String(formData.get("assignedToId") ?? "") || undefined,
      internalNotes: String(formData.get("internalNotes") ?? ""),
      device: {
        type: String(formData.get("deviceType") ?? "GENERAL_ELECTRONICS"),
        make: String(formData.get("make") ?? ""),
        model: String(formData.get("model") ?? ""),
        serialNumber: String(formData.get("serialNumber") ?? ""),
        conditionNotes: String(formData.get("conditionNotes") ?? ""),
        accessories: String(formData.get("accessories") ?? "")
      },
      appointment
    };

    try {
      const body = await parseResponse(
        await fetch("/api/admin/workflow/review", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload)
        })
      );
      setState("success");
      setMessage(`Job card ${body.job?.jobNumber ?? ""} created.`);
      router.refresh();
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Could not create job card.");
    }
  }

  if (request.hasJobCard) {
    return <p className="mt-3 rounded-md bg-success/10 px-3 py-2 text-xs font-semibold text-success">Job card already created.</p>;
  }

  return (
    <div className="mt-4">
      <button type="button" onClick={() => setOpen((value) => !value)} className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white shadow-sm">
        {open ? "Close review" : "Review and create job"}
      </button>
      {open ? (
        <form action={submit} className="mt-4 grid gap-3 rounded-lg border border-line bg-white p-4">
          <div className="grid gap-3 md:grid-cols-2">
            <label>
              Job type
              <select name="jobType" defaultValue="BENCH_REPAIR">
                {jobTypes.map(([value, text]) => <option key={value} value={value}>{text}</option>)}
              </select>
            </label>
            <label>
              Assign technician
              <select name="assignedToId" defaultValue="">
                <option value="">Unassigned for now</option>
                {technicians.map((technician) => <option key={technician.id} value={technician.id}>{technician.name} - {label(technician.role)}</option>)}
              </select>
            </label>
            <label>
              Device type
              <select name="deviceType" defaultValue="GENERAL_ELECTRONICS">
                <option value="PHONE">Phone</option>
                <option value="TABLET">Tablet</option>
                <option value="PC">PC</option>
                <option value="LAPTOP">Laptop</option>
                <option value="TV">TV</option>
                <option value="GENERAL_ELECTRONICS">General electronics</option>
              </select>
            </label>
            <label>Make<input name="make" placeholder="Samsung, HP, Dell..." /></label>
            <label>Model<input name="model" placeholder="Galaxy S23, ProBook..." /></label>
            <label>Serial / IMEI<input name="serialNumber" /></label>
          </div>
          <label>Accessories received<input name="accessories" placeholder="Charger, bag, remote, SIM tray..." /></label>
          <label>Condition notes<textarea name="conditionNotes" rows={2} defaultValue={request.description} /></label>
          <div className="grid gap-3 md:grid-cols-2">
            <label>Appointment date/time<input name="startsAt" type="datetime-local" /></label>
            <label>Appointment/location<input name="appointmentLocation" defaultValue={request.locationNote ?? ""} /></label>
          </div>
          <label>Appointment notes<input name="appointmentNotes" placeholder="Travel notes, site contact, access instructions..." /></label>
          <label>Internal admin notes<textarea name="internalNotes" rows={2} placeholder="Triage decision, risk, customer promise..." /></label>
          <button disabled={state === "saving"} className="rounded-md bg-copper px-4 py-3 text-sm font-semibold text-ink disabled:opacity-70">
            <LoadingButtonContent loading={state === "saving"} loadingLabel="Creating job">
              Create job card
            </LoadingButtonContent>
          </button>
          {message ? <p className={`text-sm font-semibold ${state === "error" ? "text-red-700" : "text-teal"}`}>{message}</p> : null}
        </form>
      ) : null}
    </div>
  );
}

export function JobStatusAction({ job }: { job: JobActionItem }) {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const allowed = nextStatuses[job.status] ?? [];

  async function submit(formData: FormData) {
    setState("saving");
    setMessage("");
    try {
      const toStatus = String(formData.get("toStatus") ?? "");
      await parseResponse(
        await fetch(`/api/admin/jobs/${job.id}/transition`, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ toStatus, note: String(formData.get("note") ?? "") })
        })
      );
      setState("success");
      setMessage(`Moved to ${label(toStatus)}.`);
      router.refresh();
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Could not update job.");
    }
  }

  if (!allowed.length) return <span className="text-xs text-slate-500">No next action</span>;

  return (
    <form action={submit} className="flex min-w-[260px] flex-wrap items-center gap-2">
      <select name="toStatus" className="min-w-40" defaultValue={allowed[0]}>
        {allowed.map((status) => <option key={status} value={status}>{label(status)}</option>)}
      </select>
      <input name="note" className="min-w-40" placeholder="Optional note" />
      <button disabled={state === "saving"} className="rounded-md bg-ink px-3 py-2 text-xs font-semibold text-white disabled:opacity-70">
        <LoadingButtonContent loading={state === "saving"} loadingLabel="Updating">
          Update
        </LoadingButtonContent>
      </button>
      {message ? <span className={`basis-full text-xs font-semibold ${state === "error" ? "text-red-700" : "text-teal"}`}>{message}</span> : null}
    </form>
  );
}
