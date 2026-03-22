"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type Inquiry } from "@/lib/mock-data";
import {
  Clock,
  Search,
  Mail,
  MessageCircle,
  CheckCircle,
  XCircle,
  Filter,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useInquiries } from "@/lib/use-inquiries";

const STATUS_OPTIONS = ["all", "pending", "responded", "closed"] as const;

export function LeadsPage() {
  const { toast } = useToast();
  const { inquiries, loading, setInquiries } = useInquiries();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      inquiries.filter((inquiry) => {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          inquiry.userName.toLowerCase().includes(query) ||
          inquiry.userEmail.toLowerCase().includes(query) ||
          inquiry.listingName.toLowerCase().includes(query) ||
          inquiry.message.toLowerCase().includes(query);
        const matchesStatus =
          statusFilter === "all" || inquiry.status === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [inquiries, searchQuery, statusFilter]
  );

  async function updateStatus(id: string, status: Inquiry["status"]) {
    setUpdatingId(id);
    try {
      const response = await fetch("/api/admin/inquiries", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(data?.error || "Unable to update lead.");
      }

      setInquiries((current) =>
        current.map((inquiry) =>
          inquiry.id === id ? { ...inquiry, status } : inquiry
        )
      );
      toast({
        title: "Lead Updated",
        description: `Lead marked as ${status}.`,
      });
    } catch (caughtError) {
      toast({
        title: "Update Failed",
        description:
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to update lead.",
        variant: "destructive",
      });
    } finally {
      setUpdatingId(null);
    }
  }

  const counts = {
    pending: inquiries.filter((item) => item.status === "pending").length,
    responded: inquiries.filter((item) => item.status === "responded").length,
    closed: inquiries.filter((item) => item.status === "closed").length,
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="mb-2 text-3xl font-bold font-headline text-primary">
          Lead Pipeline
        </h1>
        <p className="text-muted-foreground">
          Manage inbound leads, qualification status, and follow-up progress.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            label: "New Leads",
            count: counts.pending,
            color: "text-orange-600",
            bg: "bg-orange-100",
            icon: MessageCircle,
          },
          {
            label: "Contacted",
            count: counts.responded,
            color: "text-blue-600",
            bg: "bg-blue-100",
            icon: Mail,
          },
          {
            label: "Closed",
            count: counts.closed,
            color: "text-green-600",
            bg: "bg-green-100",
            icon: CheckCircle,
          },
        ].map((stat) => (
          <Card key={stat.label} className="border-none shadow-sm">
            <CardContent className="flex items-center gap-4 p-6">
              <div className={`rounded-2xl p-3 ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold font-headline text-primary">
                  {loading ? "..." : stat.count}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search leads..."
            className="border-none bg-white pl-10 shadow-sm"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full border-none bg-white shadow-sm sm:w-44">
            <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((status) => (
              <SelectItem key={status} value={status} className="capitalize">
                {status === "all" ? "All Statuses" : status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="overflow-hidden border-none shadow-sm">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="pl-6">Lead</TableHead>
              <TableHead>Listing</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="pr-6 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-16 text-center text-muted-foreground"
                >
                  {loading ? "Loading leads..." : "No leads found."}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((inquiry) => (
                <TableRow key={inquiry.id} className="hover:bg-muted/10">
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
                  <TableCell className="max-w-[140px] truncate font-medium text-muted-foreground">
                    {inquiry.listingName}
                  </TableCell>
                  <TableCell className="max-w-[220px]">
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {inquiry.message}
                    </p>
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
                      className="rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider capitalize"
                    >
                      {inquiry.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 opacity-50" />
                      {inquiry.date}
                    </div>
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {inquiry.status !== "responded" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={updatingId === inquiry.id}
                          className="h-8 border-blue-200 text-blue-600 hover:bg-blue-50"
                          onClick={() => updateStatus(inquiry.id, "responded")}
                        >
                          <Mail className="mr-1 h-3 w-3" /> Mark Contacted
                        </Button>
                      ) : null}
                      {inquiry.status !== "closed" ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={updatingId === inquiry.id}
                          className="h-8 text-muted-foreground hover:text-destructive"
                          onClick={() => updateStatus(inquiry.id, "closed")}
                        >
                          <XCircle className="mr-1 h-3 w-3" /> Close
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={updatingId === inquiry.id}
                          className="h-8 text-muted-foreground"
                          onClick={() => updateStatus(inquiry.id, "pending")}
                        >
                          Reopen
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
