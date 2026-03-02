"use client"

import { useParams, useRouter } from "next/navigation"
import { LISTINGS } from "@/lib/mock-data"
import { MainNav } from "@/components/layout/main-nav"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Star, 
  ShoppingCart, 
  Eye, 
  ShieldCheck, 
  Clock, 
  ArrowLeft,
  CheckCircle2,
  Globe,
  Share2,
  ExternalLink
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function ListingDetail() {
  const { id } = useParams()
  const router = useRouter()
  const listing = LISTINGS.find(l => l.id === id)
  const [showPreview, setShowPreview] = useState(false)

  if (!listing) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <MainNav />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
           <h1 className="text-2xl font-bold text-primary mb-4">Listing not found</h1>
           <Button onClick={() => router.push('/')}>Back to Marketplace</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MainNav />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-accent mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to all listings
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: Visuals */}
            <div className="lg:col-span-7 space-y-6">
              <div className="relative aspect-[16/9] bg-white rounded-3xl overflow-hidden shadow-xl border-4 border-white">
                <img 
                  src={listing.imageUrl} 
                  alt={listing.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-primary text-white shadow-lg">{listing.category}</Badge>
                </div>
              </div>

              {listing.previewUrl && (
                <div className="p-6 bg-white rounded-3xl shadow-sm border border-accent/10 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4 text-center md:text-left">
                    <div className="w-12 h-12 bg-accent/10 text-accent rounded-2xl flex items-center justify-center shrink-0">
                      <Eye className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-headline font-bold text-primary">Interactive Preview</h3>
                      <p className="text-sm text-muted-foreground">See this service in action before you buy.</p>
                    </div>
                  </div>
                  <Button 
                    className="bg-accent hover:bg-accent/90 text-white rounded-full px-8 py-6 h-auto font-bold shadow-lg shadow-accent/20"
                    onClick={() => setShowPreview(!showPreview)}
                  >
                    {showPreview ? "Hide Preview" : "Launch Live Demo"}
                  </Button>
                </div>
              )}

              {showPreview && listing.previewUrl && (
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-accent transition-all duration-500 animate-in fade-in slide-in-from-top-4">
                   <div className="bg-accent/5 p-4 border-b flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <div className="flex gap-1.5 mr-2">
                           <div className="w-3 h-3 rounded-full bg-red-400" />
                           <div className="w-3 h-3 rounded-full bg-yellow-400" />
                           <div className="w-3 h-3 rounded-full bg-green-400" />
                        </div>
                        <span className="text-xs font-medium text-accent truncate max-w-[200px]">{listing.previewUrl}</span>
                     </div>
                     <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-accent">
                          <Globe className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-accent" asChild>
                           <a href={listing.previewUrl} target="_blank" rel="noopener noreferrer">
                             <ExternalLink className="w-4 h-4" />
                           </a>
                        </Button>
                     </div>
                   </div>
                   <div className="aspect-[16/10] bg-muted relative">
                      <iframe 
                        src={listing.previewUrl} 
                        className="absolute inset-0 w-full h-full border-none"
                        title={`Preview of ${listing.name}`}
                      />
                   </div>
                </div>
              )}

              <div className="bg-white p-8 rounded-3xl shadow-sm">
                <h2 className="text-2xl font-headline font-bold text-primary mb-6">About this Service</h2>
                <div className="prose prose-indigo max-w-none text-muted-foreground font-light leading-relaxed">
                  <p className="mb-4">{listing.description}</p>
                  <p>Developed by S-Tech Solutions' expert engineers, this solution is designed to integrate seamlessly into your existing digital infrastructure. Every aspect has been optimized for the unique performance and connectivity demands of the African digital landscape.</p>
                </div>
              </div>
            </div>

            {/* Right Column: CTA & Details */}
            <div className="lg:col-span-5 space-y-8">
              <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white">
                <div className="p-8 pb-0">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={cn("w-4 h-4", i < Math.floor(listing.rating) ? "fill-current" : "opacity-30")} />
                      ))}
                    </div>
                    <span className="text-sm font-bold text-primary">{listing.rating}</span>
                    <span className="text-xs text-muted-foreground font-medium">({listing.salesCount} Verified Purchases)</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-headline font-bold text-primary mb-2 leading-tight">
                    {listing.name}
                  </h1>
                  <p className="text-accent text-3xl font-bold mb-6">${listing.price}</p>
                  
                  <div className="space-y-4 mb-8">
                     {listing.features.map((feature, i) => (
                       <div key={i} className="flex items-start gap-3">
                         <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                         <span className="text-sm text-muted-foreground font-medium">{feature}</span>
                       </div>
                     ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-2xl h-14 font-bold text-lg">
                      <ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart
                    </Button>
                    <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/5 rounded-2xl h-14 font-bold">
                      Hire S-Tech
                    </Button>
                  </div>
                </div>
                
                <div className="p-8 bg-muted/30 border-t flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white border shadow-sm flex items-center justify-center">
                         <ShieldCheck className="w-5 h-5 text-accent" />
                      </div>
                      <div className="flex flex-col">
                         <span className="text-xs font-bold text-primary uppercase">Guaranteed Security</span>
                         <span className="text-[10px] text-muted-foreground">Verified by S-Tech Systems</span>
                      </div>
                   </div>
                   <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                      <Share2 className="w-4 h-4 mr-2" /> Share
                   </Button>
                </div>
              </Card>

              <div className="bg-primary p-8 rounded-3xl text-white relative overflow-hidden">
                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-accent/20 rounded-full blur-2xl" />
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <Clock className="w-6 h-6 text-accent" />
                    <h3 className="text-xl font-headline font-bold">Quick Delivery</h3>
                  </div>
                  <p className="text-sm text-primary-foreground/80 mb-6 font-light">
                    Our digital products are available for immediate download or activation after purchase. For custom services, we guarantee initial deployment within 7 business days.
                  </p>
                  <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white/10 rounded-xl">
                    View Licensing Info
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"