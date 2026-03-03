'use client'

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { MainNav } from "@/components/layout/main-nav"
import { ListingCard } from "@/components/marketplace/listing-card"
import { useListings } from "@/lib/use-listings"
import { CATEGORIES } from "@/lib/mock-data"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import Link from "next/link"

function StoreContent() {
  const searchParams = useSearchParams()
  const { listings } = useListings()
  const [activeCategory, setActiveCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")

  // Sync when query param changes (e.g. from nav search)
  useEffect(() => {
    const q = searchParams.get("q") || ""
    setSearchQuery(q)
  }, [searchParams])

  const filtered = listings.filter(l => {
    const matchesCategory = activeCategory === "All" || l.category === activeCategory
    const matchesSearch = l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <>
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
          <Button
            variant={activeCategory === "All" ? "default" : "ghost"}
            onClick={() => setActiveCategory("All")}
            className={activeCategory === "All" ? "bg-primary" : "text-muted-foreground hover:text-primary"}
          >
            All Items
          </Button>
          {CATEGORIES.filter(c => c !== "All").map(cat => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "ghost"}
              onClick={() => setActiveCategory(cat)}
              className={activeCategory === cat ? "bg-primary" : "text-muted-foreground hover:text-primary"}
            >
              {cat}
            </Button>
          ))}
        </div>

        <div className="relative flex-1 md:max-w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search store..."
            className="pl-10 h-10 bg-muted/30 border-none focus-visible:ring-accent"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-muted-foreground">Showing <span className="font-bold text-foreground">{filtered.length}</span> results</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filtered.map(item => (
          <ListingCard key={item.id} listing={item} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-headline font-bold text-primary mb-2">No results found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or search keywords.</p>
        </div>
      )}
    </>
  )
}

export default function StorePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MainNav />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-headline font-bold text-primary mb-2">Marketplace</h1>
          <p className="text-muted-foreground mb-8">Browse all our digital products and services.</p>
          <Suspense fallback={<div className="py-20 text-center text-muted-foreground">Loading...</div>}>
            <StoreContent />
          </Suspense>
        </div>
      </main>

      <footer className="bg-white border-t py-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-headline font-bold text-lg">S</span>
            </div>
            <span className="font-headline font-bold text-lg tracking-tight text-primary">
              S-Tech <span className="text-accent">Solutions</span>
            </span>
          </Link>
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} S-Tech Solutions. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
