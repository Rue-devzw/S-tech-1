"use client";

import { CalendarDays, Camera, ClipboardCheck, FileText, MapPin, PenLine, Plus, UserRound } from "lucide-react";
import { useMemo, useState } from "react";

const serviceTypes = [
  "STARLINK",
  "NETWORKING",
  "ONSITE_COMPUTER_SUPPORT",
  "CCTV_NETWORK_SUPPORT",
  "BUSINESS_ICT_MAINTENANCE"
];

const sampleVisits = [
  {
    id: "VIS-2026-DEMO1",
    customer: "Green Valley Lodge",
    serviceType: "STARLINK",
    technician: "Field Technician",
    address: "Borrowdale Road, Harare",
    time: "08:00 - 11:00",
    status: "PLANNED",
    outcome: "Mount, route cable and configure guest Wi-Fi."
  },
  {
    id: "VIS-2026-DEMO2",
    customer: "Local Academy",
    serviceType: "NETWORKING",
    technician: "Network Team",
    address: "Computer lab block",
    time: "12:00 - 15:00",
    status: "ON_SITE",
    outcome: "Switch cabinet cleanup and Wi-Fi coverage test."
  },
  {
    id: "VIS-2026-DEMO3",
    customer: "Community Clinic",
    serviceType: "BUSINESS_ICT_MAINTENANCE",
    technician: "ICT Support",
    address: "Reception and records office",
    time: "16:00 - 17:30",
    status: "PLANNED",
    outcome: "Workstation checks, backups and printer support."
  }
];

export function FieldServiceDashboard() {
  const [notice, setNotice] = useState("");
  const days = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(now);
      date.setDate(now.getDate() + index);
      return date;
    });
  }, []);

  function save(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 4500);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="rounded-lg bg-brand-band p-6 text-white shadow-glow">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-100">Field service</p>
          <h1 className="mt-2 text-3xl font-bold text-white">Scheduling and site visits</h1>
          <p className="mt-2 max-w-3xl text-white/82">
            Book appointments, assign technicians, capture locations, track checklists, collect field evidence and generate professional service reports.
          </p>
        </div>
        <button onClick={() => save("Calendar sync placeholder ready for provider integration.")} className="inline-flex items-center gap-2 bg-white px-4 py-2 text-sm font-semibold text-ink shadow-lift">
          <CalendarDays size={16} />
          Sync calendar
        </button>
      </div>
      </div>

      {notice ? <div className="mt-5 rounded-lg border border-teal/30 bg-teal/10 p-4 text-sm font-semibold text-teal">{notice}</div> : null}

      <section className="omni-card mt-6 rounded-lg p-4">
        <div className="grid gap-3 md:grid-cols-7">
          {days.map((day, index) => (
            <button key={day.toISOString()} className={`rounded-lg border p-3 text-left ${index === 0 ? "border-teal bg-teal text-white shadow-lift" : "border-line bg-white/84 text-ink"}`}>
              <span className="block text-xs font-semibold uppercase">{day.toLocaleDateString("en", { weekday: "short" })}</span>
              <span className="mt-1 block text-2xl font-bold">{day.getDate()}</span>
              <span className="mt-1 block text-xs">{index === 0 ? "3 visits" : index === 1 ? "1 visit" : "Open"}</span>
            </button>
          ))}
        </div>
      </section>

      <div className="mt-6 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="omni-card rounded-lg p-5">
          <div className="mb-4 flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-md bg-teal/12 text-teal"><Plus size={20} /></span>
            <h2 className="text-xl font-semibold text-ink">Book field appointment</h2>
          </div>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              save("Field appointment captured. API route: POST /api/admin/field-service/schedule");
            }}
          >
            <label>
              Service type
              <select defaultValue="STARLINK">
                {serviceTypes.map((type) => <option key={type}>{type.replaceAll("_", " ")}</option>)}
              </select>
            </label>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label>Start<input type="datetime-local" required /></label>
              <label>End<input type="datetime-local" required /></label>
            </div>
            <label className="mt-4">Technician or installer<input placeholder="Assign team member" /></label>
            <label className="mt-4">Location<input required placeholder="Site address or map location" /></label>
            <label className="mt-4">Travel notes<textarea rows={4} placeholder="Gate code, parking, roof access, contact person, tools to carry..." /></label>
            <button className="mt-5 w-full bg-copper px-5 py-3 text-sm font-semibold text-ink shadow-lift">Book appointment</button>
          </form>
        </section>

        <section className="grid gap-4">
          {sampleVisits.map((visit) => (
            <article key={visit.id} className="omni-card rounded-lg p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-teal">{visit.id}</p>
                  <h2 className="mt-1 text-xl font-semibold text-ink">{visit.customer}</h2>
                  <p className="mt-2 text-sm text-slate-600">{visit.serviceType.replaceAll("_", " ")} · {visit.time}</p>
                </div>
                <span className="rounded-full bg-teal/10 px-3 py-1 text-xs font-semibold text-teal">{visit.status}</span>
              </div>
              <div className="mt-4 grid gap-3 text-sm text-slate-600 md:grid-cols-2">
                <p className="flex gap-2"><MapPin size={16} className="text-teal" />{visit.address}</p>
                <p className="flex gap-2"><UserRound size={16} className="text-teal" />{visit.technician}</p>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600">{visit.outcome}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <ActionButton icon={ClipboardCheck} label="Checklist" onClick={() => save("Checklist route: POST /api/admin/field-service/visits/[id]/checklists")} />
                <ActionButton icon={Camera} label="Photos" onClick={() => save("Evidence route: PATCH /api/admin/field-service/visits/[id]/evidence")} />
                <ActionButton icon={PenLine} label="Signature" onClick={() => save("Customer signature placeholder saved with field evidence.")} />
                <ActionButton icon={FileText} label="Report" onClick={() => save("Report route: POST /api/admin/field-service/visits/[id]/report")} />
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}

function ActionButton({ icon: Icon, label, onClick }: { icon: typeof ClipboardCheck; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="inline-flex items-center gap-2 border border-line bg-white px-3 py-2 text-sm font-semibold text-ink">
      <Icon size={16} />
      {label}
    </button>
  );
}
