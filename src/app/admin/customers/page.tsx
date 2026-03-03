"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, User, Mail, MapPin, Calendar, MoreHorizontal, UserCheck, UserX } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Customer {
    id: string
    name: string
    email: string
    location: string
    joinDate: string
    purchases: number
    totalSpent: number
    status: "active" | "inactive"
}

const MOCK_CUSTOMERS: Customer[] = [
    { id: "c1", name: "Tendai Moyo", email: "tendai@company.zw", location: "Harare, ZW", joinDate: "2023-08-12", purchases: 3, totalSpent: 647, status: "active" },
    { id: "c2", name: "Sarah Khumalo", email: "sarah@boutique.co.zw", location: "Bulawayo, ZW", joinDate: "2023-09-20", purchases: 1, totalSpent: 49, status: "active" },
    { id: "c3", name: "James Chiota", email: "j.chiota@techfirm.zw", location: "Harare, ZW", joinDate: "2023-07-05", purchases: 5, totalSpent: 1895, status: "active" },
    { id: "c4", name: "Grace Mutasa", email: "grace.m@media.co.zw", location: "Mutare, ZW", joinDate: "2023-10-01", purchases: 2, totalSpent: 134, status: "inactive" },
    { id: "c5", name: "Farai Ndlovu", email: "farai@startups.africa", location: "Nairobi, KE", joinDate: "2023-10-15", purchases: 1, totalSpent: 199, status: "active" },
]

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS)
    const [searchQuery, setSearchQuery] = useState("")

    const filtered = customers.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.location.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const totalCustomers = customers.length
    const activeCustomers = customers.filter(c => c.status === "active").length
    const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0)

    function toggleStatus(id: string) {
        setCustomers(prev => prev.map(c =>
            c.id === id ? { ...c, status: c.status === "active" ? "inactive" : "active" } : c
        ))
    }

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            <div>
                <h1 className="text-3xl font-headline font-bold text-primary mb-2">Customer Management</h1>
                <p className="text-muted-foreground">View and manage your registered customers and their activity.</p>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: "Total Customers", value: totalCustomers, icon: User, color: "text-primary", bg: "bg-primary/10" },
                    { label: "Active Customers", value: activeCustomers, icon: UserCheck, color: "text-green-600", bg: "bg-green-100" },
                    { label: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: Mail, color: "text-accent", bg: "bg-accent/10" },
                ].map(stat => (
                    <Card key={stat.label} className="border-none shadow-sm">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className={`p-3 rounded-2xl ${stat.bg}`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                                <p className="text-2xl font-headline font-bold text-primary">{stat.value}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Search customers..."
                    className="pl-10 bg-white border-none shadow-sm"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Table */}
            <Card className="border-none shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow>
                            <TableHead className="pl-6">Customer</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead>Purchases</TableHead>
                            <TableHead>Total Spent</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right pr-6">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="py-16 text-center text-muted-foreground">
                                    No customers found.
                                </TableCell>
                            </TableRow>
                        ) : filtered.map(c => (
                            <TableRow key={c.id} className="hover:bg-muted/10">
                                <TableCell className="pl-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                            <span className="text-primary font-bold text-sm">{c.name.charAt(0)}</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-primary">{c.name}</p>
                                            <p className="text-xs text-muted-foreground">{c.email}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <MapPin className="w-3 h-3" />
                                        {c.location}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <Calendar className="w-3 h-3" />
                                        {c.joinDate}
                                    </div>
                                </TableCell>
                                <TableCell className="font-semibold">{c.purchases}</TableCell>
                                <TableCell className="font-bold text-accent">${c.totalSpent}</TableCell>
                                <TableCell>
                                    <Badge
                                        className={c.status === "active"
                                            ? "bg-green-100 text-green-700 border-none rounded-full text-[10px] font-bold uppercase"
                                            : "bg-muted text-muted-foreground border-none rounded-full text-[10px] font-bold uppercase"
                                        }
                                    >
                                        {c.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right pr-6">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-accent">
                                                <MoreHorizontal className="w-5 h-5" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="rounded-xl w-40">
                                            <DropdownMenuItem className="py-2.5 cursor-pointer" onClick={() => toggleStatus(c.id)}>
                                                {c.status === "active"
                                                    ? <><UserX className="w-4 h-4 mr-2" /> Deactivate</>
                                                    : <><UserCheck className="w-4 h-4 mr-2" /> Activate</>
                                                }
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="py-2.5 cursor-pointer" onClick={() => { window.location.href = `mailto:${c.email}` }}>
                                                <Mail className="w-4 h-4 mr-2" /> Send Email
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    )
}
