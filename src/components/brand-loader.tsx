import type { ReactNode } from "react";

type BrandLogoVectorProps = {
  className?: string;
  title?: string;
};

export function BrandLogoVector({ className = "h-8 w-8", title = "OmniTech loading" }: BrandLogoVectorProps) {
  return (
    <svg className={className} viewBox="0 0 96 96" role="img" aria-label={title} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="omni-loader-gradient" x1="18" y1="14" x2="78" y2="82" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4bb7e8" />
          <stop offset="0.52" stopColor="#1768b3" />
          <stop offset="1" stopColor="#f2b705" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#omni-loader-gradient)" strokeLinecap="round" strokeLinejoin="round">
        <path pathLength="1" strokeWidth="8" d="M48 9 77 23v31c0 16-11 29-29 38-18-9-29-22-29-38V23L48 9Z">
          <animate attributeName="stroke-dasharray" values="0.18 0.82;0.72 0.28;0.18 0.82" dur="1.7s" repeatCount="indefinite" />
          <animate attributeName="stroke-dashoffset" values="0;-0.38;-1" dur="1.7s" repeatCount="indefinite" />
        </path>
        <path pathLength="1" strokeWidth="9" d="M30 57c16-13 25-29 29-48">
          <animate attributeName="stroke-dasharray" values="0.2 0.8;0.82 0.18;0.2 0.8" dur="1.45s" repeatCount="indefinite" />
          <animate attributeName="stroke-dashoffset" values="0;-0.28;-1" dur="1.45s" repeatCount="indefinite" />
        </path>
        <path pathLength="1" strokeWidth="8" d="M35 68c19-6 40-3 52 7">
          <animate attributeName="stroke-dasharray" values="0.16 0.84;0.76 0.24;0.16 0.84" dur="1.6s" repeatCount="indefinite" />
          <animate attributeName="stroke-dashoffset" values="0;-0.32;-1" dur="1.6s" repeatCount="indefinite" />
        </path>
        <path pathLength="1" strokeWidth="8" d="M66 28c4 20 12 35 24 47">
          <animate attributeName="stroke-dasharray" values="0.14 0.86;0.7 0.3;0.14 0.86" dur="1.55s" repeatCount="indefinite" />
          <animate attributeName="stroke-dashoffset" values="0;-0.34;-1" dur="1.55s" repeatCount="indefinite" />
        </path>
      </g>
      <circle cx="48" cy="48" r="42" fill="none" stroke="#d7dee8" strokeWidth="2" opacity="0.55">
        <animate attributeName="opacity" values="0.28;0.7;0.28" dur="1.7s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

export function BrandLoader({ label = "Loading", className = "" }: { label?: string; className?: string }) {
  return (
    <div className={`inline-flex items-center justify-center gap-2 ${className}`} aria-live="polite" aria-busy="true">
      <BrandLogoVector className="h-6 w-6 shrink-0" />
      <span>{label}</span>
    </div>
  );
}

export function LoadingButtonContent({ loading, loadingLabel, children }: { loading: boolean; loadingLabel: string; children: ReactNode }) {
  return loading ? <BrandLoader label={loadingLabel} /> : <>{children}</>;
}

export function ImageLoadingPlaceholder({ label = "Loading image", className = "" }: { label?: string; className?: string }) {
  return (
    <div className={`grid place-items-center rounded-md bg-cloud text-xs font-semibold text-ink ${className}`} aria-busy="true">
      <BrandLoader label={label} />
    </div>
  );
}
