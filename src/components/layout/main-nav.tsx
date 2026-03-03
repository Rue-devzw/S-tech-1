"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ShoppingBag, Search, User, Menu, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useState } from "react"

export function MainNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/store?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-white font-headline font-bold text-xl">S</span>
            </div>
            <span className="hidden sm:inline-block font-headline font-bold text-xl tracking-tight text-primary">
              S-Tech <span className="text-accent">Digital Hub</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="/" className={cn("transition-colors hover:text-accent", pathname === "/" ? "text-primary font-bold" : "text-muted-foreground")}>
              Marketplace
            </Link>
            <Link href="/services" className={cn("transition-colors hover:text-accent", pathname === "/services" ? "text-primary font-bold" : "text-muted-foreground")}>
              Services
            </Link>
            <Link href="/about" className={cn("transition-colors hover:text-accent", pathname === "/about" ? "text-primary font-bold" : "text-muted-foreground")}>
              About S-Tech
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="hidden lg:flex relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search services..."
              className="pl-9 h-9 bg-muted/50 focus-visible:ring-accent"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </form>

          <div className="flex items-center gap-2">
            <Link href="/admin">
              <Button variant="ghost" size="icon" className="text-primary hover:text-accent">
                <LayoutDashboard className="h-5 w-5" />
                <span className="sr-only">Admin Dashboard</span>
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="text-primary hover:text-accent">
              <ShoppingBag className="h-5 w-5" />
              <span className="sr-only">Cart</span>
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <Button className="hidden sm:flex bg-primary text-white hover:bg-primary/90">
              <User className="h-4 w-4 mr-2" />
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}