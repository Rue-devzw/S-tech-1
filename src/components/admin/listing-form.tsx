"use client"

import { Dispatch, SetStateAction, useState, useEffect } from "react"
import { Listing, CATEGORIES } from "@/lib/mock-data"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
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

export function ListingForm({ listing: initial, onSave, trigger }: ListingFormProps) {
  const [open, setOpen] = useState<boolean>(props.open ?? false)

  useEffect(() => {
    if (props.open !== undefined) {
      setOpen(props.open)
    }
  }, [props.open])
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
    }
  }, [initial])

  function handleChange<K extends keyof Listing>(key: K, value: Listing[K]) {
    setListing(prev => ({ ...prev, [key]: value }))
  }

  function handleSubmit() {
    // ensure id exists for new items
    const out: Listing = {
      ...listing,
      id: listing.id || Date.now().toString(),
    }
    onSave(out)
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (props.onOpenChange) props.onOpenChange(o)
        setOpen(o)
      }}
    >
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
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={listing.name}
              onChange={e => handleChange("name", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={listing.category}
              onValueChange={val => handleChange("category", val)}
            >
              <SelectTrigger id="category" className="w-full">
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
            <Label htmlFor="price">Price ($)</Label>
            <Input
              type="number"
              id="price"
              value={listing.price}
              onChange={e => handleChange("price", parseFloat(e.target.value) || 0)}
            />
          </div>
          <div>
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              value={listing.imageUrl}
              onChange={e => handleChange("imageUrl", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="previewUrl">Preview URL</Label>
            <Input
              id="previewUrl"
              value={listing.previewUrl || ""}
              onChange={e => handleChange("previewUrl", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={listing.description}
              onChange={e => handleChange("description", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="features">Features (comma separated)</Label>
            <Input
              id="features"
              value={listing.features.join(", ")}
              onChange={e => handleChange("features", e.target.value.split(",").map(s => s.trim()))}
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
