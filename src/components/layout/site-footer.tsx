import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white/90">
      <div className="container mx-auto flex flex-col items-start justify-between gap-6 px-4 py-10 md:flex-row md:items-center">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-900"
          >
            <div className="clip-hexagon relative h-9 w-9 overflow-hidden border border-slate-200 bg-slate-100">
              <Image
                src="/images/logo.webp"
                alt="S-Tech Studios logo"
                fill
                className="object-cover"
                sizes="36px"
              />
            </div>
            <span className="font-headline text-lg font-semibold">
              S-Tech Studios
            </span>
          </Link>
          <p className="mt-2 text-sm text-slate-500">
            Brand websites, agency platforms, and digital collections crafted
            in Harare.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-5 text-sm text-slate-600">
          <Link href="/store" className="hover:text-slate-900">
            Work
          </Link>
          <Link href="/services" className="hover:text-slate-900">
            Services
          </Link>
          <Link href="/about" className="hover:text-slate-900">
            About
          </Link>
          <Link href="/contact" className="hover:text-slate-900">
            Contact
          </Link>
          <a
            href="mailto:help@s-techsolution.org"
            className="hover:text-slate-900"
          >
            help@s-techsolution.org
          </a>
        </div>
      </div>
    </footer>
  );
}
