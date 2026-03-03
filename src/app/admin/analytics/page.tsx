"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { TrendingUp, TrendingDown, ShoppingBag, Users, DollarSign, Eye } from "lucide-react"
import { useListings } from "@/lib/use-listings"
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts"

const MONTHLY_REVENUE = [
    { month: "May", revenue: 4200 },
    { month: "Jun", revenue: 5800 },
    { month: "Jul", revenue: 7200 },
    { month: "Aug", revenue: 6100 },
    { month: "Sep", revenue: 8900 },
    { month: "Oct", revenue: 12450 },
]

const VISITOR_DATA = [
    { day: "Mon", visitors: 320 },
    { day: "Tue", visitors: 480 },
    { day: "Wed", visitors: 390 },
    { day: "Thu", visitors: 610 },
    { day: "Fri", visitors: 520 },
    { day: "Sat", visitors: 290 },
    { day: "Sun", visitors: 210 },
]

const CATEGORY_COLORS = ["#2563eb", "#f97316", "#16a34a", "#9333ea", "#0891b2", "#d97706"]

export default function AnalyticsPage() {
    const { listings } = useListings()

    // Build category distribution data from listings
    const categoryCounts: Record<string, number> = {}
    listings.forEach(l => {
        categoryCounts[l.category] = (categoryCounts[l.category] || 0) + (l.salesCount || 0)
    })
    const categoryData = Object.entries(categoryCounts).map(([name, value]) => ({ name, value }))

    const totalSales = listings.reduce((s, l) => s + (l.salesCount || 0), 0)
    const totalRevenue = listings.reduce((s, l) => s + l.price * (l.salesCount || 0), 0)

    const statCards = [
        { label: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, change: "+12.5%", up: true, icon: DollarSign, color: "text-green-600", bg: "bg-green-100" },
        { label: "Total Sales", value: totalSales.toLocaleString(), change: "+18.1%", up: true, icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-100" },
        { label: "Active Listings", value: listings.length.toString(), change: "+2", up: true, icon: Eye, color: "text-purple-600", bg: "bg-purple-100" },
        { label: "Avg. Order Value", value: totalSales > 0 ? `$${Math.round(totalRevenue / totalSales)}` : "$0", change: "-5.2%", up: false, icon: Users, color: "text-orange-600", bg: "bg-orange-100" },
    ]

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div>
                <h1 className="text-3xl font-headline font-bold text-primary mb-2">Analytics</h1>
                <p className="text-muted-foreground">Track performance, revenue, and trends for your marketplace.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, i) => (
                    <Card key={i} className="border-none shadow-sm overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-2xl ${stat.bg}`}>
                                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                                <div className={`flex items-center gap-1 text-sm font-semibold ${stat.up ? "text-green-600" : "text-red-500"}`}>
                                    {stat.up ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                    {stat.change}
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground font-medium mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-headline font-bold text-primary">{stat.value}</h3>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-xl font-headline font-bold text-primary">Monthly Revenue</CardTitle>
                        <CardDescription>Total revenue collected per month (USD)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={MONTHLY_REVENUE} barCategoryGap="30%">
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip formatter={(v: number) => [`$${v}`, "Revenue"]} />
                                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Visitors Chart */}
                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-xl font-headline font-bold text-primary">Weekly Visitors</CardTitle>
                        <CardDescription>Unique page visitors this week</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={280}>
                            <LineChart data={VISITOR_DATA}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Line type="monotone" dataKey="visitors" stroke="hsl(var(--accent))" strokeWidth={2} dot={{ fill: "hsl(var(--accent))", r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Category Breakdown */}
            <Card className="border-none shadow-sm">
                <CardHeader>
                    <CardTitle className="text-xl font-headline font-bold text-primary">Sales by Category</CardTitle>
                    <CardDescription>Breakdown of total units sold per product category</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row items-center gap-8">
                    <ResponsiveContainer width="100%" height={260} className="max-w-xs">
                        <PieChart>
                            <Pie data={categoryData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`} labelLine={false}>
                                {categoryData.map((_, idx) => (
                                    <Cell key={idx} fill={CATEGORY_COLORS[idx % CATEGORY_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-col gap-3 flex-1">
                        {categoryData.map((entry, idx) => (
                            <div key={entry.name} className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full shrink-0" style={{ background: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] }} />
                                <span className="text-sm font-medium text-muted-foreground flex-1">{entry.name}</span>
                                <span className="text-sm font-bold text-primary">{entry.value} sales</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
