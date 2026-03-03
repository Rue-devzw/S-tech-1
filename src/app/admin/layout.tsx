"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  MessageSquare,
  Users,
  Settings,
  BarChart3,
  LogOut,
  ChevronRight,
  Plus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { name: 'Listings', icon: Package, href: '/admin/listings' },
    { name: 'Inquiries', icon: MessageSquare, href: '/admin/inquiries' },
    { name: 'Customers', icon: Users, href: '/admin/customers' },
    { name: 'Analytics', icon: BarChart3, href: '/admin/analytics' },
    { name: 'Settings', icon: Settings, href: '/admin/settings' },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background font-body">
      {/* Admin Top Bar */}
      <header className="h-16 border-b bg-white flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-headline font-bold text-lg">S</span>
            </div>
            <span className="font-headline font-bold text-lg text-primary">Admin <span className="text-accent">Hub</span></span>
          </Link>
          <div className="h-6 w-px bg-muted mx-2" />
          <nav className="hidden md:flex items-center text-sm text-muted-foreground gap-2">
            <span>S-Tech Solutions</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">Control Panel</span>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="outline" size="sm" className="hidden sm:flex border-accent text-accent hover:bg-accent/5">
              View Storefront
            </Button>
          </Link>
          <Button size="icon" variant="ghost" className="rounded-full overflow-hidden">
            <img
              src="https://picsum.photos/seed/admin-avatar/100/100"
              alt="Admin"
              className="w-full h-full object-cover"
            />
          </Button>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Admin Sidebar */}
        <aside className="w-full md:w-64 bg-white border-r flex flex-col p-4 gap-2 sticky md:top-16 md:h-[calc(100vh-64px)] overflow-y-auto">
          <div className="mb-4">
            <Link href="/admin/listings">
              <Button className="w-full bg-accent hover:bg-accent/90 text-white rounded-xl shadow-lg shadow-accent/20">
                <Plus className="w-4 h-4 mr-2" /> New Listing
              </Button>
            </Link>
          </div>

          <div className="space-y-1">
            {navItems.map((item) => (
              <Link key={item.name} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start rounded-xl py-6",
                    pathname === item.href
                      ? "bg-primary/5 text-primary font-bold hover:bg-primary/10"
                      : "text-muted-foreground hover:bg-muted/50"
                  )}
                >
                  <item.icon className={cn("w-5 h-5 mr-3", pathname === item.href ? "text-primary" : "text-muted-foreground")} />
                  {item.name}
                </Button>
              </Link>
            ))}
          </div>

          <div className="mt-auto pt-6 border-t">
            <Button variant="ghost" className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive rounded-xl">
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </Button>
          </div>
        </aside>

        {/* Admin Content Area */}
        <main className="flex-1 p-6 lg:p-10 bg-muted/20 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}