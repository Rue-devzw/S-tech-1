"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { INQUIRIES, LISTINGS } from "@/lib/mock-data"
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  MessageCircle,
  Clock,
  ArrowUpRight,
  MoreVertical
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function AdminDashboard() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-headline font-bold text-primary mb-2">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome back to the S-Tech control panel.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: '$12,450', change: '+12.5%', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100' },
          { label: 'Active Users', value: '1,284', change: '+3.2%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
          { label: 'Total Sales', value: '432', change: '+18.1%', icon: ShoppingBag, color: 'text-purple-600', bg: 'bg-purple-100' },
          { label: 'Pending Inquiries', value: '14', change: '-2', icon: MessageCircle, color: 'text-orange-600', bg: 'bg-orange-100' },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm overflow-hidden">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={cn("p-3 rounded-2xl", stat.bg)}>
                  <stat.icon className={cn("w-6 h-6", stat.color)} />
                </div>
                <Badge variant="outline" className="border-muted text-muted-foreground font-medium">
                  {stat.change}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</p>
                <h3 className="text-2xl font-headline font-bold text-primary">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Inquiries */}
        <Card className="lg:col-span-2 border-none shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-xl font-headline font-bold text-primary">Recent Inquiries</CardTitle>
              <CardDescription>Manage incoming client requests</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-accent font-semibold hover:bg-accent/5">
              View All <ArrowUpRight className="ml-1 w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="pl-6">Customer</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right pr-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {INQUIRIES.map((inq) => (
                  <TableRow key={inq.id} className="hover:bg-muted/10 transition-colors">
                    <TableCell className="pl-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-primary">{inq.userName}</span>
                        <span className="text-xs text-muted-foreground">{inq.userEmail}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-muted-foreground">{inq.listingName}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={inq.status === 'pending' ? 'destructive' : inq.status === 'responded' ? 'secondary' : 'outline'}
                        className="rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                      >
                        {inq.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-medium text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1 opacity-50" />
                        {inq.date}
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-accent">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="border-none shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-xl font-headline font-bold text-primary">Popular Services</CardTitle>
            <CardDescription>Highest performing listings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {LISTINGS.slice(0, 3).map((item) => (
              <div key={item.id} className="flex items-center gap-4 group cursor-pointer">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-muted shrink-0 shadow-sm border border-muted">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-primary truncate group-hover:text-accent transition-colors">{item.name}</h4>
                  <p className="text-xs text-muted-foreground font-medium">{item.category}</p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-accent">${item.price}</div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase">{item.salesCount} Sales</div>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full border-muted text-muted-foreground hover:bg-muted/50 rounded-xl mt-4">
              View Product Stats
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

import { cn } from "@/lib/utils"