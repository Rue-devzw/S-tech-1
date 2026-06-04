import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function MetricCard({ label, value, tone = "default" }: { label: string; value: string | number; tone?: "default" | "warn" | "good" }) {
  return (
    <div className={cn("rounded-lg border border-line bg-white p-4", tone === "warn" && "border-copper/40 bg-orange-50", tone === "good" && "border-teal/40 bg-teal-50")}>
      <p className="text-sm text-slate-600">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-ink">{value}</p>
    </div>
  );
}

export function FeatureCard({ icon: Icon, title, body }: { icon: LucideIcon; title: string; body: string }) {
  return (
    <article className="rounded-lg border border-line bg-white p-5 shadow-sm">
      <Icon className="text-teal" size={24} />
      <h3 className="mt-4 text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
    </article>
  );
}

export function StatusPill({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-cloud px-3 py-1 text-xs font-semibold text-slate-700">{children}</span>;
}
