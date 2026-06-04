"use client";

import { useState } from "react";
import { LoadingButtonContent } from "@/components/brand-loader";

type ServiceOption = { id: string; name: string };

export function RequestForm({ services, defaultServiceId }: { services: ServiceOption[]; defaultServiceId?: string }) {
  const [state, setState] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(formData: FormData) {
    setState("saving");
    setMessage("");
    const payload = Object.fromEntries(formData.entries());
    const response = await fetch("/api/service-requests", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    });
    const body = await response.json();
    if (!response.ok) {
      setState("error");
      setMessage(body.error ?? "Could not submit request.");
      return;
    }
    setState("success");
    setMessage(`Request ${body.request?.requestNumber ?? ""} received. We will contact you shortly.`);
  }

  return (
    <form action={submit} className="rounded-lg border border-line bg-white p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <label>
          Full name
          <input name="name" required minLength={2} />
        </label>
        <label>
          Phone
          <input name="phone" required minLength={7} />
        </label>
        <label>
          Email
          <input name="email" type="email" />
        </label>
        <label>
          Organisation
          <input name="organization" />
        </label>
        <label>
          Service
          <select name="serviceId" required defaultValue={defaultServiceId ?? ""}>
            <option value="" disabled>
              Select service
            </option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Urgency
          <select name="urgency" defaultValue="NORMAL">
            <option value="LOW">Low</option>
            <option value="NORMAL">Normal</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </label>
      </div>
      <div className="mt-4 grid gap-4">
        <label>
          Request title
          <input name="title" required minLength={4} placeholder="e.g. Laptop not charging" />
        </label>
        <label>
          Location
          <input name="location" placeholder="Shop drop-off, school, farm, office, home..." />
        </label>
        <label>
          Details
          <textarea name="description" required minLength={12} rows={6} />
        </label>
      </div>
      <button disabled={state === "saving"} className="mt-5 w-full bg-ink px-5 py-3 text-sm font-semibold text-white">
        <LoadingButtonContent loading={state === "saving"} loadingLabel="Submitting">
          Submit request
        </LoadingButtonContent>
      </button>
      {message ? <p className={`mt-4 text-sm font-semibold ${state === "error" ? "text-red-700" : "text-teal"}`}>{message}</p> : null}
    </form>
  );
}
