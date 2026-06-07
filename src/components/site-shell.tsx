import Link from "next/link";
import Image from "next/image";
import { MessageCircle, Sparkles } from "lucide-react";
import { brand } from "@/lib/constants";
import { whatsappChannelHref, whatsappHref } from "@/lib/public-content";
import { SessionActions } from "@/components/session-actions";

const nav = [
  ["About", "/about"],
  ["Services", "/services"],
  ["Portfolio", "/portfolio"],
  ["Blog", "/blog"],
  ["Contact", "/contact"],
  ["Track Repair", "/track-repair"]
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/60 bg-white/82 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex min-w-0 items-center gap-3 font-semibold text-ink">
          <span className="grid size-14 shrink-0 place-items-center">
            <Image src="/brand/omnitech-mark.png" alt="" width={56} height={56} className="h-14 w-14 object-contain" priority />
          </span>
          <span>
            <span className="block leading-tight">{brand.name}</span>
            <span className="block text-xs font-medium text-teal">{brand.tagline}</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm font-medium text-slate-700 xl:flex">
          {nav.map(([label, href]) => (
            <Link key={href} href={href} className="relative rounded-full px-2 py-1 hover:bg-teal/10 hover:text-teal">
              {label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <SessionActions />
          <a href={whatsappHref} className="inline-flex items-center gap-2 rounded-md border border-teal/20 bg-white/90 px-4 py-2 text-sm font-semibold text-ink shadow-sm hover:border-teal/40">
            <MessageCircle size={16} />
            WhatsApp
          </a>
          <Link href="/request-service" className="inline-flex items-center gap-2 rounded-md bg-copper px-4 py-2 text-sm font-semibold text-ink shadow-lift">
            <Sparkles size={15} />
            Book service
          </Link>
        </div>
        <Link
          href="/request-service"
          aria-label="Open request service"
          className="inline-flex items-center gap-1.5 rounded-md bg-copper px-3 py-2 text-sm font-semibold text-ink shadow-sm md:hidden"
        >
          <Sparkles size={14} />
          Book
        </Link>
      </div>
      <nav className="border-t border-line/70 bg-white/72 px-4 py-3 text-sm font-medium text-slate-700 md:hidden">
        <div className="mx-auto grid max-w-7xl grid-cols-3 gap-2">
          {nav.map(([label, href]) => (
            <Link key={href} href={href} className="rounded-full bg-white/70 px-2 py-1 text-center text-xs shadow-sm hover:text-teal">
              {label}
            </Link>
          ))}
          <SessionActions compact />
        </div>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-ink text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <p className="inline-flex items-center gap-3 text-lg font-semibold">
            <span className="grid size-12 place-items-center">
              <Image src="/brand/omnitech-mark.png" alt="" width={48} height={48} className="h-12 w-12 object-contain" />
            </span>
            {brand.name}
          </p>
          <p className="mt-3 max-w-xl text-sm font-semibold text-teal-100">{brand.tagline}</p>
          <p className="mt-4 text-sm text-slate-300">
            Repairs, connectivity, software, AI automation, Starlink and network infrastructure for homes and organisations.
          </p>
          <div className="mt-5 h-1.5 w-52 rounded-full bg-brand-band" />
        </div>
        <div className="text-sm text-slate-300">
          <p className="font-semibold text-white">Contact</p>
          <p className="mt-2">{brand.phone}</p>
          <p>{brand.email}</p>
          <p>{brand.location}</p>
          <a href={whatsappHref} className="mt-3 inline-flex text-teal-200 hover:text-white">
            Chat on WhatsApp
          </a>
          <a href={whatsappChannelHref} className="mt-2 block text-teal-200 hover:text-white">
            WhatsApp channel
          </a>
        </div>
        <div className="text-sm text-slate-300">
          <p className="font-semibold text-white">Services</p>
          <Link className="mt-2 block hover:text-white" href="/electronics-repairs">
            Electronics repairs
          </Link>
          <Link className="block hover:text-white" href="/starlink-installations">
            Starlink installations
          </Link>
          <Link className="block hover:text-white" href="/software-ai-systems">
            Software and AI
          </Link>
        </div>
        <div className="text-sm text-slate-300">
          <p className="font-semibold text-white">Company</p>
          <Link className="mt-2 block hover:text-white" href="/about">
            About
          </Link>
          <Link className="block hover:text-white" href="/portfolio">
            Portfolio
          </Link>
          <Link className="block hover:text-white" href="/request-service">
            Request service
          </Link>
          <Link className="block hover:text-white" href="/customer/register">
            Customer account
          </Link>
          <Link className="block hover:text-white" href="/terms-of-service">
            Terms
          </Link>
          <Link className="block hover:text-white" href="/privacy-policy">
            Privacy
          </Link>
          <Link className="block hover:text-white" href="/impressum">
            Impressum
          </Link>
        </div>
      </div>
    </footer>
  );
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}
