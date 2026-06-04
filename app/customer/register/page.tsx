import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/site-shell";
import { CustomerRegisterForm } from "@/components/customer/register-form";
import { makeMetadata } from "@/lib/seo";

export const metadata: Metadata = makeMetadata({
  title: "Create Customer Account",
  description: "Create an OmniTech Solutions customer account to request services, track repairs, approve quotations and view invoices.",
  path: "/customer/register",
  noIndex: true
});

export default function CustomerRegisterPage() {
  return (
    <PageShell>
      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-14 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal">Customer account</p>
          <h1 className="mt-3 text-3xl font-bold text-ink md:text-5xl">Manage repairs and installations in one simple place</h1>
          <p className="mt-4 text-slate-600">
            Create an account to request service, upload photos, track progress, approve quotes, download invoices and message OmniTech.
          </p>
          <p className="mt-6 text-sm text-slate-600">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-teal">
              Sign in
            </Link>
          </p>
        </div>
        <CustomerRegisterForm />
      </section>
    </PageShell>
  );
}
