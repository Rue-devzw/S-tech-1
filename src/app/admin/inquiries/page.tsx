"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { INQUIRIES, type Inquiry } from "@/lib/mock-data"
import { Clock, Search, Mail, MessageCircle, CheckCircle, XCircle, Filter } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const STATUS_OPTIONS = ["all", "pending", "responded", "closed"] as const

export default function InquiriesPage() {
    const { toast } = useToast()
    const [inquiries, setInquiries] = useState<Inquiry[]>(INQUIRIES)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")

    const filtered = inquiries.filter(inq => {
        const matchesSearch =
            inq.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            inq.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
            inq.listingName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            inq.message.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === "all" || inq.status === statusFilter
        return matchesSearch && matchesStatus
    })

    function updateStatus(id: string, status: Inquiry["status"]) {
        setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status } : inq))
        toast({ title: "Status Updated", description: `Inquiry marked as ${status}.` })
    }

    const counts = {
        pending: inquiries.filter(i => i.status === "pending").length,
        responded: inquiries.filter(i => i.status === "responded").length,
        closed: inquiries.filter(i => i.status === "closed").length,
    }

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            <div>
                <h1 className="text-3xl font-headline font-bold text-primary mb-2">Customer Inquiries</h1>
                <p className="text-muted-foreground">Manage and respond to client requests and messages.</p>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: "Pending", count: counts.pending, color: "text-orange-600", bg: "bg-orange-100", icon: MessageCircle },
                    { label: "Responded", count: counts.responded, color: "text-blue-600", bg: "bg-blue-100", icon: Mail },
                    { label: "Closed", count: counts.closed, color: "text-green-600", bg: "bg-green-100", icon: CheckCircle },
                ].map(stat => (
                    <Card key={stat.label} className="border-none shadow-sm">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className={`p-3 rounded-2xl ${stat.bg}`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                                <p className="text-2xl font-headline font-bold text-primary">{stat.count}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search inquiries..."
                        className="pl-10 bg-white border-none shadow-sm"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-44 bg-white border-none shadow-sm">
                        <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                        <SelectValue placeholder="Filter status" />
                    </SelectTrigger>
                    <SelectContent>
                        {STATUS_OPTIONS.map(s => (
                            <SelectItem key={s} value={s} className="capitalize">{s === "all" ? "All Status" : s}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Table */}
            <Card className="border-none shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow>
                            <TableHead className="pl-6">Customer</TableHead>
                            <TableHead>Service</TableHead>
                            <TableHead>Message</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right pr-6">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="py-16 text-center text-muted-foreground">
                                    No inquiries found.
                                </TableCell>
                            </TableRow>
                        ) : filtered.map(inq => (
                            <TableRow key={inq.id} className="hover:bg-muted/10">
                                <TableCell className="pl-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-primary">{inq.userName}</span>
                                        <span className="text-xs text-muted-foreground">{inq.userEmail}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium text-muted-foreground max-w-[140px] truncate">{inq.listingName}</TableCell>
                                <TableCell className="max-w-[220px]">
                                    <p className="text-sm text-muted-foreground line-clamp-2">{inq.message}</p>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={inq.status === "pending" ? "destructive" : inq.status === "responded" ? "secondary" : "outline"}
                                        className="rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider capitalize"
                                    >
                                        {inq.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3 opacity-50" />
                                        {inq.date}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right pr-6">
                                    <div className="flex items-center justify-end gap-2">
                                        {inq.status !== "responded" && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-8 border-blue-200 text-blue-600 hover:bg-blue-50"
                                                onClick={() => updateStatus(inq.id, "responded")}
                                            >
                                                <Mail className="w-3 h-3 mr-1" /> Respond
                                            </Button>
                                        )}
                                        {inq.status !== "closed" && (
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-8 text-muted-foreground hover:text-destructive"
                                                onClick={() => updateStatus(inq.id, "closed")}
                                            >
                                                <XCircle className="w-3 h-3 mr-1" /> Close
                                            </Button>
                                        )}
                                        {inq.status === "closed" && (
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-8 text-muted-foreground"
                                                onClick={() => updateStatus(inq.id, "pending")}
                                            >
                                                Reopen
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    )
}
