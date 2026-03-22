"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  ShoppingBag,
  MessageCircle,
  Clock,
  ArrowUpRight,
  MoreVertical,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useListings } from "@/lib/use-listings";
import { useInquiries } from "@/lib/use-inquiries";

export default function AdminDashboard() {
  const { listings, loading: listingsLoading } = useListings();
  const { inquiries, loading: inquiriesLoading } = useInquiries();

  const totalRevenue = listings.reduce(
    (sum, listing) => sum + listing.price * listing.salesCount,
    0
  );
  const totalSales = listings.reduce(
    (sum, listing) => sum + listing.salesCount,
    0
  );
  const pendingInquiries = inquiries.filter(
    (inquiry) => inquiry.status === "pending"
  ).length;
  const featuredListings = listings.filter(
    (listing) => listing.featured
  ).length;
  const recentInquiries = inquiries.slice(0, 5);
  const popularListings = [...listings]
    .sort((left, right) => right.salesCount - left.salesCount)
    .slice(0, 3);

  const statCards = [
    {
      label: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      change: `${listings.length} live offers`,
      icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      label: "Total Sales",
      value: totalSales.toLocaleString(),
      change: "Across all listings",
      icon: ShoppingBag,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "New Leads",
      value: pendingInquiries.toString(),
      change: `${inquiries.length} total leads`,
      icon: MessageCircle,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
    {
      label: "Featured Listings",
      value: featuredListings.toString(),
      change: "Highlighted in storefront",
      icon: Package,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <h1 className="mb-2 text-3xl font-bold font-headline text-primary">
          Dashboard Overview
        </h1>
        <p className="text-muted-foreground">
          Welcome back to the S-Tech control panel.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card
            key={stat.label}
            className="overflow-hidden border-none shadow-sm"
          >
            <CardContent className="p-6">
              <div className="mb-4 flex items-start justify-between">
                <div className={cn("rounded-2xl p-3", stat.bg)}>
                  <stat.icon className={cn("h-6 w-6", stat.color)} />
                </div>
                <Badge
                  variant="outline"
                  className="border-muted font-medium text-muted-foreground"
                >
                  {stat.change}
                </Badge>
              </div>
              <div>
                <p className="mb-1 text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <h3 className="text-2xl font-bold font-headline text-primary">
                  {listingsLoading || inquiriesLoading ? "..." : stat.value}
                </h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <Card className="bg-white border-none shadow-sm lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-xl font-bold font-headline text-primary">
                Recent Leads
              </CardTitle>
              <CardDescription>Manage inbound sales conversations</CardDescription>
            </div>
            <Link href="/admin/leads">
              <Button
                variant="ghost"
                size="sm"
                className="font-semibold text-accent hover:bg-accent/5"
              >
                View Pipeline <ArrowUpRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="pl-6">Lead</TableHead>
                  <TableHead>Listing</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="pr-6 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentInquiries.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-12 text-center text-muted-foreground"
                    >
                      {inquiriesLoading
                        ? "Loading leads..."
                        : "No leads yet."}
                    </TableCell>
                  </TableRow>
                ) : (
                  recentInquiries.map((inquiry) => (
                    <TableRow
                      key={inquiry.id}
                      className="transition-colors hover:bg-muted/10"
                    >
                      <TableCell className="py-4 pl-6">
                        <div className="flex flex-col">
                          <span className="font-semibold text-primary">
                            {inquiry.userName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {inquiry.userEmail}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-muted-foreground">
                        {inquiry.listingName}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            inquiry.status === "pending"
                              ? "destructive"
                              : inquiry.status === "responded"
                                ? "secondary"
                                : "outline"
                          }
                          className="rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                        >
                          {inquiry.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs font-medium text-muted-foreground">
                        <div className="flex items-center">
                          <Clock className="mr-1 h-3 w-3 opacity-50" />
                          {inquiry.date}
                        </div>
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <Link href="/admin/leads">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-accent"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-none bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold font-headline text-primary">
              Popular Services
            </CardTitle>
            <CardDescription>Highest performing listings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {popularListings.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {listingsLoading ? "Loading listings..." : "No listings yet."}
              </p>
            ) : (
              popularListings.map((item) => (
                <div
                  key={item.id}
                  className="group flex items-center gap-4 rounded-2xl"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-muted bg-muted shadow-sm">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="64px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate font-bold text-primary transition-colors group-hover:text-accent">
                      {item.name}
                    </h4>
                    <p className="text-xs font-medium text-muted-foreground">
                      {item.category}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-accent">${item.price}</div>
                    <div className="text-[10px] font-bold uppercase text-muted-foreground">
                      {item.salesCount} Sales
                    </div>
                  </div>
                </div>
              ))
            )}
            <Link href="/admin/listings">
              <Button
                variant="outline"
                className="mt-4 w-full rounded-xl border-muted text-muted-foreground hover:bg-muted/50"
              >
                View Product Stats
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
