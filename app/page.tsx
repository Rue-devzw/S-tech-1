"use client"

import { useState } from "react"
import { MainNav } from "@/components/layout/main-nav"
import { ListingCard } from "@/components/marketplace/listing-card"
import { LISTINGS, CATEGORIES } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, SlidersHorizontal, ArrowRight, Zap, Shield, Code, Globe } from "lucide-react"

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredListings = LISTINGS.filter(l => {
    const matchesCategory = activeCategory === "All" || l.category === activeCategory
    const matchesSearch = l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          l.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MainNav />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden bg-primary text-white">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <Badge className="mb-6 bg-accent text-white border-none py-1.5 px-4 rounded-full text-sm font-bold uppercase tracking-wider">
                Digital Excellence in Zimbabwe
              </Badge>
              <h1 className="text-4xl md:text-6xl font-headline font-bold mb-6 leading-tight">
                Empower Your Business with <span className="text-accent">Cutting-Edge</span> Digital Solutions
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-2xl font-light">
                Discover a curated marketplace of web applications, website themes, AI-assisted cybersecurity, and full-stack development services tailored for the modern digital era.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-white rounded-full px-8 text-lg font-bold">
                  Browse Solutions <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-full px-8 text-lg">
                  Custom Development
                </Button>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-1/3 aspect-square bg-gradient-to-br from-accent/20 to-transparent rounded-full blur-3xl -mr-32 pointer-events-none"></div>
        </section>

        {/* Categories & Filter Section */}
        <section className="py-12 bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
                <Button 
                  variant={activeCategory === "All" ? "default" : "ghost"}
                  onClick={() => setActiveCategory("All")}
                  className={activeCategory === "All" ? "bg-primary" : "text-muted-foreground hover:text-primary"}
                >
                  All Items
                </Button>
                {CATEGORIES.map(cat => (
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
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search market..." 
                    className="pl-10 h-10 bg-muted/30 border-none focus-visible:ring-accent"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon" className="h-10 w-10 shrink-0">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Marketplace Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-headline font-bold text-primary mb-2">Featured Listings</h2>
                <p className="text-muted-foreground">Expertly crafted tools and services for your next project.</p>
              </div>
              <div className="hidden sm:block">
                <span className="text-sm text-muted-foreground">Showing <span className="font-bold text-foreground">{filteredListings.length}</span> results</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredListings.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>

            {filteredListings.length === 0 && (
              <div className="py-20 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-headline font-bold text-primary mb-2">No results found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or search keywords.</p>
              </div>
            )}
          </div>
        </section>

        {/* Features / Why Us Section */}
        <section className="py-24 bg-primary/5">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-headline font-bold text-primary mb-4">The S-Tech Advantage</h2>
              <p className="text-muted-foreground">Why businesses across Zimbabwe and beyond trust S-Tech Digital Hub for their digital transformation.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border-b-4 border-accent">
                <div className="w-12 h-12 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-headline font-bold text-primary mb-3">AI Security</h3>
                <p className="text-sm text-muted-foreground">Next-generation threat protection powered by artificial intelligence.</p>
              </div>
              <div className="p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border-b-4 border-primary">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-6">
                  <Code className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-headline font-bold text-primary mb-3">Full-Stack Dev</h3>
                <p className="text-sm text-muted-foreground">End-to-end web and mobile application development services.</p>
              </div>
              <div className="p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border-b-4 border-accent">
                <div className="w-12 h-12 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-headline font-bold text-primary mb-3">Fast Delivery</h3>
                <p className="text-sm text-muted-foreground">Optimized workflows ensuring rapid deployment of digital assets.</p>
              </div>
              <div className="p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border-b-4 border-primary">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-6">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-headline font-bold text-primary mb-3">Local Expertise</h3>
                <p className="text-sm text-muted-foreground">Deep understanding of the Zimbabwean and regional digital landscape.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col items-center md:items-start gap-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-headline font-bold text-lg">S</span>
                </div>
                <span className="font-headline font-bold text-lg tracking-tight text-primary">
                  S-Tech <span className="text-accent">Solutions</span>
                </span>
              </Link>
              <p className="text-sm text-muted-foreground max-w-xs text-center md:text-left">
                Empowering the digital landscape from Harare, Zimbabwe to the world.
              </p>
            </div>
            <div className="flex gap-8 text-sm font-medium text-muted-foreground">
              <Link href="#" className="hover:text-accent">Privacy Policy</Link>
              <Link href="#" className="hover:text-accent">Terms of Service</Link>
              <Link href="#" className="hover:text-accent">Support</Link>
              <Link href="#" className="hover:text-accent">Contact</Link>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} S-Tech Solutions. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

import { Badge } from "@/components/ui/badge"
import Link from "next/link"