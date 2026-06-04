"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoadingButtonContent } from "@/components/brand-loader";

export function CustomerRegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(formData: FormData) {
    setSaving(true);
    setError("");
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData.entries()))
    });
    const body = await response.json();
    setSaving(false);
    if (!response.ok) {
      setError(body.error ?? "Could not create your account.");
      return;
    }
    router.push("/customer");
    router.refresh();
  }

  return (
    <form action={submit} className="rounded-lg border border-line bg-white p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <label>
          Full name
          <input name="name" required minLength={2} autoComplete="name" />
        </label>
        <label>
          Phone
          <input name="phone" required minLength={7} autoComplete="tel" />
        </label>
        <label>
          Email
          <input name="email" type="email" required autoComplete="email" />
        </label>
        <label>
          Organisation
          <input name="organization" autoComplete="organization" />
        </label>
      </div>
      <label className="mt-4">
        Password
        <input name="password" type="password" required minLength={12} autoComplete="new-password" />
      </label>
      <p className="mt-2 text-xs text-slate-500">Use at least 12 characters. A mix of words, numbers and symbols is best.</p>
      <button disabled={saving} className="mt-5 w-full bg-ink px-5 py-3 text-sm font-semibold text-white">
        <LoadingButtonContent loading={saving} loadingLabel="Creating account">
          Create customer account
        </LoadingButtonContent>
      </button>
      {error ? <p className="mt-4 text-sm font-semibold text-red-700">{error}</p> : null}
    </form>
  );
}
