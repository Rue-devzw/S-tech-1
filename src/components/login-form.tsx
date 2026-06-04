"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoadingButtonContent } from "@/components/brand-loader";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(formData: FormData) {
    setSaving(true);
    setError("");
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData.entries()))
    });
    const body = await response.json();
    setSaving(false);
    if (!response.ok) {
      setError(body.error ?? "Login failed.");
      return;
    }
    router.push(body.redirectTo ?? (body.user.role === "CUSTOMER" ? "/customer" : body.user.role === "TECHNICIAN" || body.user.role === "FIELD_INSTALLER" ? "/technician" : "/admin"));
    router.refresh();
  }

  return (
    <form action={submit} className="rounded-lg border border-line bg-white p-5 shadow-sm">
      <label>
        Email
        <input name="email" type="email" required />
      </label>
      <label className="mt-4">
        Password
        <input name="password" type="password" required minLength={8} autoComplete="current-password" />
      </label>
      <button disabled={saving} className="mt-5 w-full bg-ink px-5 py-3 text-sm font-semibold text-white">
        <LoadingButtonContent loading={saving} loadingLabel="Signing in">
          Sign in
        </LoadingButtonContent>
      </button>
      {error ? <p className="mt-4 text-sm font-semibold text-red-700">{error}</p> : null}
    </form>
  );
}
