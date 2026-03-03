"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Menu, Search, ShoppingBag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Store", href: "/store" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
];

export function MainNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState("");

  const activeHref = useMemo(() => {
    if (!pathname) return "/";
    if (pathname.startsWith("/store") || pathname.startsWith("/listing")) return "/store";
    return pathname;
  }, [pathname]);

  function onSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/store?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/85 backdrop-blur supports-[backdrop-filter]:bg-slate-950/70">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg shadow-cyan-500/20">
              <span className="text-lg font-headline font-bold text-slate-950">S</span>
            </div>
            <span className="hidden text-lg font-headline font-semibold tracking-tight text-white sm:inline-block">
              S-Tech <span className="text-cyan-300">Studios</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
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
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects..."
              className="h-9 w-64 border-slate-700 bg-slate-900/70 pl-9 text-slate-100 placeholder:text-slate-400 focus-visible:ring-cyan-400"
            />
          </form>

          <Link href="/admin">
            <Button variant="ghost" size="icon" className="text-slate-300 hover:bg-slate-800 hover:text-white">
              <LayoutDashboard className="h-5 w-5" />
              <span className="sr-only">Open admin dashboard</span>
            </Button>
          </Link>

          <Button variant="ghost" size="icon" className="text-slate-300 hover:bg-slate-800 hover:text-white">
            <ShoppingBag className="h-5 w-5" />
            <span className="sr-only">Open shopping bag</span>
          </Button>

          <Button variant="ghost" size="icon" className="text-slate-300 hover:bg-slate-800 hover:text-white md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open navigation menu</span>
          </Button>

          <Button className="hidden bg-cyan-400 text-slate-950 hover:bg-cyan-300 sm:flex">
            <User className="mr-2 h-4 w-4" />
            Client Login
          </Button>
        </div>
      </div>
    </header>
  );
}
