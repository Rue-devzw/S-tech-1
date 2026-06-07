"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { LoadingButtonContent } from "@/components/brand-loader";

type SessionUser = {
  name: string;
  role: string;
};

function dashboardPath(role: string) {
  if (role === "CUSTOMER") return "/customer";
  if (role === "TECHNICIAN" || role === "FIELD_INSTALLER") return "/technician";
  return "/admin";
}

export function SessionActions({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadSession() {
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store" });
        const body = await response.json().catch(() => ({}));
        if (active && response.ok && body.user) {
          setUser({ name: body.user.name, role: body.user.role });
        }
      } catch {
        if (active) setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadSession();
    return () => {
      active = false;
    };
  }, []);

  async function logout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      setUser(null);
      router.push("/login");
      router.refresh();
    }
  }

  if (loading || !user) return null;

  const href = dashboardPath(user.role);
  const onDashboard = pathname === href || pathname.startsWith(`${href}/`);

  if (compact) {
    return (
      <div className="col-span-3 mt-2 grid grid-cols-2 gap-2 border-t border-line/70 pt-3">
        {!onDashboard ? (
          <Link href={href} className="inline-flex items-center justify-center gap-1.5 rounded-md bg-white px-2 py-2 text-xs font-semibold text-ink shadow-sm">
            <LayoutDashboard size={14} />
            Dashboard
          </Link>
        ) : (
          <span className="inline-flex items-center justify-center rounded-md bg-white px-2 py-2 text-xs font-semibold text-slate-500 shadow-sm">
            {user.name}
          </span>
        )}
        <button
          type="button"
          onClick={logout}
          disabled={loggingOut}
          className="inline-flex items-center justify-center gap-1.5 rounded-md bg-ink px-2 py-2 text-xs font-semibold text-white shadow-sm disabled:opacity-70"
        >
          <LogOut size={14} />
          <LoadingButtonContent loading={loggingOut} loadingLabel="Logging out">
            Log out
          </LoadingButtonContent>
        </button>
      </div>
    );
  }

  return (
    <div className="hidden items-center gap-2 md:flex">
      {!onDashboard ? (
        <Link href={href} className="inline-flex items-center gap-2 rounded-md border border-teal/20 bg-white/90 px-4 py-2 text-sm font-semibold text-ink shadow-sm hover:border-teal/40">
          <LayoutDashboard size={16} />
          Dashboard
        </Link>
      ) : null}
      <button
        type="button"
        onClick={logout}
        disabled={loggingOut}
        className="inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white shadow-sm disabled:opacity-70"
      >
        <LogOut size={16} />
        <LoadingButtonContent loading={loggingOut} loadingLabel="Logging out">
          Log out
        </LoadingButtonContent>
      </button>
    </div>
  );
}
