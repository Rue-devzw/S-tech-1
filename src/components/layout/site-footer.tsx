import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white/90">
      <div className="container mx-auto flex flex-col items-start justify-between gap-6 px-4 py-10 md:flex-row md:items-center">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-slate-900">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-sm font-headline font-bold text-white">S</div>
            <span className="font-headline text-lg font-semibold">S-Tech Studios</span>
          </Link>
          <p className="mt-2 text-sm text-slate-500">Enterprise-grade digital products built in Zimbabwe for global markets.</p>
        </div>

        <div className="flex flex-wrap items-center gap-5 text-sm text-slate-600">
          <Link href="/store" className="hover:text-slate-900">
            Store
          </Link>
          <Link href="/services" className="hover:text-slate-900">
            Services
          </Link>
          <Link href="/about" className="hover:text-slate-900">
            About
          </Link>
          <a href="mailto:hello@s-tech.africa" className="hover:text-slate-900">
            hello@s-tech.africa
          </a>
        </div>
      </div>
    </footer>
  );
}
