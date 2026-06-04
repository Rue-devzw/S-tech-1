import { BrandLogoVector } from "@/components/brand-loader";

export default function Loading() {
  return (
    <div className="grid min-h-screen place-items-center bg-cloud px-4 text-center text-ink">
      <div>
        <BrandLogoVector className="mx-auto h-20 w-20" />
        <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-teal">OmniTech Solutions</p>
        <p className="mt-2 text-sm text-slate-600">Loading your workspace</p>
      </div>
    </div>
  );
}
