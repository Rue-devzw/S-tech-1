"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Search, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/store" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function MainNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeHref = useMemo(() => {
    if (!pathname) return "/";
    if (pathname.startsWith("/store") || pathname.startsWith("/listing"))
      return "/store";
    if (pathname.startsWith("/contact")) return "/contact";
    return pathname;
  }, [pathname]);

  function onSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    setMobileOpen(false);
    router.push(`/store?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/85 backdrop-blur supports-[backdrop-filter]:bg-slate-950/70">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-3"
            aria-label="S-Tech Studios home"
          >
            <div className="clip-hexagon relative h-11 w-11 overflow-hidden border border-white/15 bg-white/10 shadow-lg shadow-cyan-500/15">
              <Image
                src="/images/logo.webp"
                alt="S-Tech Studios logo"
                fill
                className="object-cover"
                sizes="44px"
                priority
              />
            </div>
            <span className="hidden text-lg font-headline font-semibold tracking-tight text-white sm:inline-block">
              S-Tech <span className="text-cyan-300">Studios</span>
            </span>
          </Link>

          <nav
            aria-label="Primary"
            className="hidden items-center gap-6 text-sm font-medium md:flex"
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={activeHref === item.href ? "page" : undefined}
                className={cn(
                  "transition-colors hover:text-cyan-300",
                  activeHref === item.href ? "text-white" : "text-slate-300"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <form onSubmit={onSearchSubmit} className="relative hidden lg:flex">
            <label htmlFor="desktop-site-search" className="sr-only">
              Search solutions
            </label>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              id="desktop-site-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search work..."
              className="h-9 w-64 border-slate-700 bg-slate-900/70 pl-9 text-slate-100 placeholder:text-slate-400 focus-visible:ring-cyan-400"
            />
          </form>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-slate-300 hover:bg-slate-800 hover:text-white md:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-site-nav"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setMobileOpen((current) => !current)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          <Button
            asChild
            className="hidden bg-cyan-400 text-slate-950 hover:bg-cyan-300 sm:flex"
          >
            <Link href="/contact">
              Start a project
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {mobileOpen ? (
        <div
          id="mobile-site-nav"
          className="border-t border-white/10 bg-slate-950 px-4 pb-4 pt-3 md:hidden"
        >
          <nav aria-label="Mobile" className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={activeHref === item.href ? "page" : undefined}
                className={cn(
                  "rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                  activeHref === item.href
                    ? "bg-white/10 text-white"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                )}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <form onSubmit={onSearchSubmit} className="relative mt-3">
            <label htmlFor="mobile-site-search" className="sr-only">
              Search solutions
            </label>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              id="mobile-site-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search work..."
              className="h-10 border-slate-700 bg-slate-900/70 pl-9 text-slate-100 placeholder:text-slate-400"
            />
          </form>

          <div className="mt-3 flex gap-2">
            <Button asChild className="flex-1 bg-cyan-400 text-slate-950 hover:bg-cyan-300">
              <Link href="/contact" onClick={() => setMobileOpen(false)}>
                Start a project
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="flex-1 border-slate-700 bg-transparent text-white hover:bg-white/5"
            >
              <Link href="/store" onClick={() => setMobileOpen(false)}>
                Work
              </Link>
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
