"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AIListingTool } from "@/components/admin/ai-listing-tool"
import { LISTINGS } from "@/lib/mock-data"
import { 
  Package, 
  Search, 
  Plus, 
  MoreHorizontal, 
  Eye, 
  Edit3, 
  Trash2,
  Sparkles
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function AdminListings() {
  const [activeTab, setActiveTab] = useState("all")

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary mb-2">Listing Management</h1>
          <p className="text-muted-foreground">Manage your goods, services, and digital assets.</p>
        </div>
        <div className="flex gap-3">
           <Button variant="outline" className="border-accent text-accent rounded-xl">
             Export CSV
           </Button>
           <Button className="bg-primary hover:bg-primary/90 rounded-xl">
             <Plus className="w-4 h-4 mr-2" /> Add New Service
           </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <TabsList className="bg-white p-1 rounded-xl shadow-sm border h-auto">
            <TabsTrigger value="all" className="rounded-lg py-2 px-6 data-[state=active]:bg-primary data-[state=active]:text-white">
              All Listings
            </TabsTrigger>
            <TabsTrigger value="themes" className="rounded-lg py-2 px-6 data-[state=active]:bg-primary data-[state=active]:text-white">
              Themes
            </TabsTrigger>
            <TabsTrigger value="apps" className="rounded-lg py-2 px-6 data-[state=active]:bg-primary data-[state=active]:text-white">
              Web Apps
            </TabsTrigger>
            <TabsTrigger value="security" className="rounded-lg py-2 px-6 data-[state=active]:bg-primary data-[state=active]:text-white">
              AI Security
            </TabsTrigger>
            <TabsTrigger value="ai-tool" className="rounded-lg py-2 px-6 data-[state=active]:bg-accent data-[state=active]:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> AI Assistant
            </TabsTrigger>
          </TabsList>
          
          <div className="relative w-full lg:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search items..." 
              className="pl-10 h-10 bg-white border-none shadow-sm focus-visible:ring-accent"
            />
          </div>
        </div>

        <TabsContent value="all" className="mt-0">
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="pl-6 w-[350px]">Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Sales</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {LISTINGS.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/5 transition-colors">
                    <TableCell className="pl-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden shrink-0 border border-muted/50">
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-primary truncate">{item.name}</span>
                          <span className="text-xs text-muted-foreground truncate max-w-[200px]">{item.description}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-medium border-muted-foreground/20 text-muted-foreground">
                        {item.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-bold text-primary">${item.price}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold">{item.salesCount}</span>
                        <span className="text-[10px] text-muted-foreground uppercase font-bold">Total Sales</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none font-bold uppercase text-[10px] rounded-full">
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-accent">
                            <MoreHorizontal className="w-5 h-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40 rounded-xl">
                          <DropdownMenuItem className="py-2.5 flex items-center gap-2 cursor-pointer">
                            <Eye className="w-4 h-4" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="py-2.5 flex items-center gap-2 cursor-pointer">
                            <Edit3 className="w-4 h-4" /> Edit Listing
                          </DropdownMenuItem>
                          <DropdownMenuItem className="py-2.5 flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/5">
                            <Trash2 className="w-4 h-4" /> Delete Item
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="ai-tool" className="mt-0">
          <AIListingTool />
        </TabsContent>
        
        <TabsContent value="themes" className="mt-0">
          <div className="py-20 text-center bg-white rounded-2xl border-2 border-dashed border-muted text-muted-foreground">
            Filter logic applied to the same table...
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}