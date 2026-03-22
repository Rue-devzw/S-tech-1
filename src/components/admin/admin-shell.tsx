"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type AdminUser } from "@/lib/admin-user";
import {
  LayoutDashboard,
  Package,
  MessageSquare,
  Users,
  Settings,
  BarChart3,
  LogOut,
  ChevronRight,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AdminShell({
  children,
  currentUser,
}: {
  children: React.ReactNode;
  currentUser: AdminUser;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/admin" },
    { name: "Listings", icon: Package, href: "/admin/listings" },
    { name: "Leads", icon: MessageSquare, href: "/admin/leads" },
    ...(currentUser.role !== "support"
      ? [{ name: "Analytics", icon: BarChart3, href: "/admin/analytics" }]
      : []),
    ...(currentUser.role === "owner"
      ? [{ name: "Team", icon: Users, href: "/admin/team" }]
      : []),
    ...(currentUser.role === "owner"
      ? [{ name: "Settings", icon: Settings, href: "/admin/settings" }]
      : []),
  ];

  async function signOut() {
    await fetch("/api/session", { method: "DELETE" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex flex-col bg-background font-body">
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-white px-6">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-lg font-bold font-headline text-white">
                S
              </span>
            </div>
            <span className="text-lg font-bold font-headline text-primary">
              Admin <span className="text-accent">Hub</span>
            </span>
          </Link>
          <div className="mx-2 h-6 w-px bg-muted" />
          <nav className="hidden items-center gap-2 text-sm text-muted-foreground md:flex">
            <span>S-Tech Solutions</span>
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium text-foreground">Control Panel</span>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button
              variant="outline"
              size="sm"
              className="hidden border-accent text-accent hover:bg-accent/5 sm:flex"
            >
              View Storefront
            </Button>
          </Link>
          <Button
            size="icon"
            variant="ghost"
            className="overflow-hidden rounded-full"
          >
            <Image
              src="/images/team-member-1.webp"
              alt="Admin"
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          </Button>
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-foreground">
              {currentUser.displayName}
            </p>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {currentUser.role}
            </p>
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col md:flex-row">
        <aside className="sticky flex w-full flex-col gap-2 overflow-y-auto border-r bg-white p-4 md:top-16 md:h-[calc(100vh-64px)] md:w-64">
          {currentUser.role !== "support" ? (
            <div className="mb-4">
              <Link href="/admin/listings">
                <Button className="w-full rounded-xl bg-accent text-white shadow-lg shadow-accent/20 hover:bg-accent/90">
                  <Plus className="mr-2 h-4 w-4" /> New Listing
                </Button>
              </Link>
            </div>
          ) : null}

          <div className="space-y-1">
            {navItems.map((item) => (
              <Link key={item.name} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start rounded-xl py-6",
                    (item.href === "/admin"
                      ? pathname === item.href
                      : pathname === item.href || pathname.startsWith(`${item.href}/`))
                      ? "bg-primary/5 font-bold text-primary hover:bg-primary/10"
                      : "text-muted-foreground hover:bg-muted/50"
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5",
                      (item.href === "/admin"
                        ? pathname === item.href
                        : pathname === item.href ||
                          pathname.startsWith(`${item.href}/`))
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                  />
                  {item.name}
                </Button>
              </Link>
            ))}
          </div>

          <div className="mt-auto border-t pt-6">
            <Button
              variant="ghost"
              className="w-full justify-start rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={signOut}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign Out
            </Button>
          </div>
        </aside>

        <main className="flex-1 overflow-x-hidden bg-muted/20 p-6 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
