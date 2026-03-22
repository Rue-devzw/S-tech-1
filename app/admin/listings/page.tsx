"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIListingTool } from "@/components/admin/ai-listing-tool";
import { ListingForm } from "@/components/admin/listing-form";
import { CATEGORIES, type Listing } from "@/lib/mock-data";
import {
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Edit3,
  Trash2,
  Sparkles,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useListings } from "@/lib/use-listings";

export default function AdminListings() {
  const { toast } = useToast();
  const { listings, loading, setListings } = useListings();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [createOpen, setCreateOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredListings = useMemo(
    () =>
      listings.filter((item) => {
        const matchesCategory =
          activeTab === "All" || item.category === activeTab;
        const query = searchQuery.trim().toLowerCase();
        const matchesQuery =
          query.length === 0 ||
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query);

        return matchesCategory && matchesQuery;
      }),
    [activeTab, listings, searchQuery]
  );

  async function saveListing(listing: Listing) {
    const exists = listings.some((item) => item.id === listing.id);
    setSaving(true);

    try {
      const response = await fetch("/api/admin/listings", {
        method: exists ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(listing),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(data?.error || "Unable to save listing.");
      }

      setListings((current) => {
        const next = exists
          ? current.map((item) => (item.id === listing.id ? listing : item))
          : [listing, ...current];
        return next;
      });

      setCreateOpen(false);
      setEditingListing(null);
      toast({
        title: exists ? "Listing updated" : "Listing created",
        description: `${listing.name} is now saved to the catalog.`,
      });
    } catch (caughtError) {
      toast({
        title: "Save failed",
        description:
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to save listing.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  }

  async function deleteListing(listing: Listing) {
    if (!window.confirm(`Delete "${listing.name}" from the catalog?`)) {
      return;
    }

    setDeletingId(listing.id);
    try {
      const response = await fetch("/api/admin/listings", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: listing.id }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(data?.error || "Unable to delete listing.");
      }

      setListings((current) =>
        current.filter((item) => item.id !== listing.id)
      );
      toast({
        title: "Listing removed",
        description: `${listing.name} has been deleted.`,
      });
    } catch (caughtError) {
      toast({
        title: "Delete failed",
        description:
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to delete listing.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  }

  function exportCsv() {
    const rows = [
      [
        "id",
        "name",
        "category",
        "price",
        "salesCount",
        "featured",
        "client",
        "industry",
      ],
      ...filteredListings.map((listing) => [
        listing.id,
        listing.name,
        listing.category,
        listing.price.toString(),
        listing.salesCount.toString(),
        listing.featured ? "yes" : "no",
        listing.client,
        listing.industry,
      ]),
    ];

    const csv = rows
      .map((row) =>
        row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "s-tech-listings.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  const listingTabs = CATEGORIES.filter((category) => category !== "All");

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="mb-2 text-3xl font-bold font-headline text-primary">
            Listing Management
          </h1>
          <p className="text-muted-foreground">
            Manage your goods, services, and digital assets.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="rounded-xl border-accent text-accent"
            onClick={exportCsv}
            disabled={filteredListings.length === 0}
          >
            Export CSV
          </Button>
          <ListingForm
            open={createOpen}
            onOpenChange={setCreateOpen}
            onSave={saveListing}
            trigger={
              <Button className="rounded-xl bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" /> Add New Service
              </Button>
            }
          />
        </div>
      </div>

      <ListingForm
        listing={editingListing}
        open={Boolean(editingListing)}
        onOpenChange={(open) => {
          if (!open) {
            setEditingListing(null);
          }
        }}
        onSave={saveListing}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <TabsList className="h-auto rounded-xl border bg-white p-1 shadow-sm">
            <TabsTrigger
              value="All"
              className="rounded-lg px-6 py-2 data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              All Listings
            </TabsTrigger>
            {listingTabs.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="rounded-lg px-6 py-2 data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                {category}
              </TabsTrigger>
            ))}
            <TabsTrigger
              value="ai-tool"
              className="flex items-center gap-2 rounded-lg px-6 py-2 data-[state=active]:bg-accent data-[state=active]:text-white"
            >
              <Sparkles className="h-4 w-4" /> AI Assistant
            </TabsTrigger>
          </TabsList>

          <div className="relative w-full lg:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search items..."
              className="h-10 border-none bg-white pl-10 shadow-sm focus-visible:ring-accent"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>
        </div>

        <TabsContent value="ai-tool" className="mt-0">
          <AIListingTool />
        </TabsContent>

        <TabsContent
          value={activeTab === "ai-tool" ? "All" : activeTab}
          className="mt-0"
        >
          <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="w-[350px] pl-6">Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Sales</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="pr-6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredListings.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="py-16 text-center text-muted-foreground"
                    >
                      {loading ? "Loading listings..." : "No listings found."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredListings.map((item) => (
                    <TableRow
                      key={item.id}
                      className="transition-colors hover:bg-muted/5"
                    >
                      <TableCell className="py-5 pl-6">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-muted/50 bg-muted">
                            <Image
                              src={item.imageUrl}
                              alt={item.name}
                              width={48}
                              height={48}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex min-w-0 flex-col">
                            <span className="truncate font-bold text-primary">
                              {item.name}
                            </span>
                            <span className="max-w-[240px] truncate text-xs text-muted-foreground">
                              {item.description}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="border-muted-foreground/20 font-medium text-muted-foreground"
                        >
                          {item.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold text-primary">
                        ${item.price}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-semibold">
                            {item.salesCount}
                          </span>
                          <span className="text-[10px] font-bold uppercase text-muted-foreground">
                            Total Sales
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="rounded-full border-none bg-green-100 text-[10px] font-bold uppercase text-green-700 hover:bg-green-200">
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-muted-foreground hover:text-accent"
                              disabled={deletingId === item.id || saving}
                            >
                              <MoreHorizontal className="h-5 w-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-44 rounded-xl"
                          >
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/listing/${item.id}`}
                                className="flex cursor-pointer items-center gap-2 py-2.5"
                              >
                                <Eye className="h-4 w-4" /> View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer py-2.5"
                              onClick={() => setEditingListing(item)}
                            >
                              <Edit3 className="mr-2 h-4 w-4" /> Edit Listing
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer py-2.5 text-destructive focus:bg-destructive/5 focus:text-destructive"
                              onClick={() => deleteListing(item)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Delete Item
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
