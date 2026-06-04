import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/site-shell";
import { LoginForm } from "@/components/login-form";
import { makeMetadata } from "@/lib/seo";

export const metadata: Metadata = makeMetadata({
  title: "Sign In",
  description: "Sign in to the OmniTech customer portal or team dashboard.",
  path: "/login",
  noIndex: true
});

export default function LoginPage() {
  return (
    <PageShell>
      <section className="mx-auto grid max-w-5xl gap-8 px-4 py-14 md:grid-cols-[0.9fr_1.1fr]">
        <div>
          <h1 className="text-3xl font-bold text-ink">Sign in</h1>
          <p className="mt-4 text-slate-600">Access your OmniTech customer portal or team dashboard.</p>
          <p className="mt-6 text-sm text-slate-600">
            New customer?{" "}
            <Link href="/customer/register" className="font-semibold text-teal">
              Create an account
            </Link>
          </p>
        </div>
        <LoginForm />
      </section>
    </PageShell>
  );
}
