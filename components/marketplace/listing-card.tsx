"use client"

import Image from "next/image"
import Link from "next/link"
import { Star, Eye, ShoppingCart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Listing } from "@/lib/mock-data"

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Card className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 bg-white">
      <div className="relative aspect-[3/2] overflow-hidden">
        <Image
          src={listing.imageUrl}
          alt={listing.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          {listing.previewUrl && (
            <Button size="sm" variant="secondary" className="rounded-full">
              <Eye className="w-4 h-4 mr-2" /> Preview
            </Button>
          )}
          <Button size="sm" className="rounded-full bg-accent hover:bg-accent/90">
            <ShoppingCart className="w-4 h-4 mr-2" /> Buy
          </Button>
        </div>
        <Badge className="absolute top-3 left-3 bg-primary text-white font-semibold">
          {listing.category}
        </Badge>
      </div>
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-lg font-headline font-bold text-primary truncate max-w-[200px]">
            {listing.name}
          </h3>
          <span className="text-lg font-bold text-accent">${listing.price}</span>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
          {listing.description}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center text-xs text-muted-foreground border-t border-muted/30">
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold text-foreground">{listing.rating}</span>
          <span>({listing.salesCount} sales)</span>
        </div>
        <Link href={`/listing/${listing.id}`} className="text-accent font-semibold hover:underline">
          View Details
        </Link>
      </CardFooter>
    </Card>
  )
}