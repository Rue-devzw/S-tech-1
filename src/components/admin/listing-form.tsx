"use client"

import { useState, useEffect } from "react"
import { Listing, CATEGORIES } from "@/lib/mock-data"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ListingFormProps {
  listing?: Listing | null
  onSave: (listing: Listing) => void
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function ListingForm({ listing: initial, onSave, trigger, open: controlledOpen, onOpenChange }: ListingFormProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen

  const setOpen = (val: boolean) => {
    if (!isControlled) setInternalOpen(val)
    if (onOpenChange) onOpenChange(val)
  }

  const [listing, setListing] = useState<Listing>(
    initial || {
      id: "",
      name: "",
      category: CATEGORIES.find(c => c !== "All") || "",
      price: 0,
      description: "",
      features: [],
      imageUrl: "",
      previewUrl: "",
      rating: 0,
      salesCount: 0,
    }
  )

  useEffect(() => {
    if (initial) {
      setListing(initial)
    } else {
      setListing({
        id: "",
        name: "",
        category: CATEGORIES.find(c => c !== "All") || "",
        price: 0,
        description: "",
        features: [],
        imageUrl: "",
        previewUrl: "",
        rating: 0,
        salesCount: 0,
      })
    }
  }, [initial])

  function handleChange<K extends keyof Listing>(key: K, value: Listing[K]) {
    setListing(prev => ({ ...prev, [key]: value }))
  }

  function handleSubmit() {
    const out: Listing = {
      ...listing,
      id: listing.id || Date.now().toString(),
    }
    onSave(out)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Listing" : "Add New Listing"}</DialogTitle>
          <DialogDescription>
            {initial
              ? "Modify the details of your product or service."
              : "Provide information about the new listing."
            }
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="lf-name">Name</Label>
            <Input
              id="lf-name"
              value={listing.name}
              onChange={e => handleChange("name", e.target.value)}
              placeholder="e.g. Aura E-Commerce Theme"
            />
          </div>
          <div>
            <Label htmlFor="lf-category">Category</Label>
            <Select
              value={listing.category}
              onValueChange={val => handleChange("category", val)}
            >
              <SelectTrigger id="lf-category" className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.filter(c => c !== "All").map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="lf-price">Price ($)</Label>
            <Input
              type="number"
              id="lf-price"
              value={listing.price}
              onChange={e => handleChange("price", parseFloat(e.target.value) || 0)}
            />
          </div>
          <div>
            <Label htmlFor="lf-imageUrl">Image URL</Label>
            <Input
              id="lf-imageUrl"
              value={listing.imageUrl}
              onChange={e => handleChange("imageUrl", e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div>
            <Label htmlFor="lf-previewUrl">Preview URL</Label>
            <Input
              id="lf-previewUrl"
              value={listing.previewUrl || ""}
              onChange={e => handleChange("previewUrl", e.target.value)}
              placeholder="https://demo.s-tech.io/..."
            />
          </div>
          <div>
            <Label htmlFor="lf-description">Description</Label>
            <Textarea
              id="lf-description"
              value={listing.description}
              onChange={e => handleChange("description", e.target.value)}
              placeholder="Describe the key benefits..."
            />
          </div>
          <div>
            <Label htmlFor="lf-features">Features (comma separated)</Label>
            <Input
              id="lf-features"
              value={listing.features.join(", ")}
              onChange={e => handleChange("features", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
              placeholder="Feature 1, Feature 2, ..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} className="mr-2">
            Cancel
          </Button>
          <Button onClick={handleSubmit}>{initial ? "Save Changes" : "Add Listing"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
