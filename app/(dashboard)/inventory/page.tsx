"use client"

import { useState } from "react"
import { Search, Package, Scale } from "lucide-react"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"

const mockInventory = [
  { id: "1", tagNumber: "GL000142", billNumber: "GL000142", description: "Gold Necklace (Thali)", purity: "22K", grossWeight: 12.0, netWeight: 12.0, customerName: "Rajesh Kumar", loanAmount: 85000, status: "ACTIVE" },
  { id: "2", tagNumber: "GL000142B", billNumber: "GL000142", description: "Gold Bangle (pair)", purity: "22K", grossWeight: 2.5, netWeight: 2.2, customerName: "Rajesh Kumar", loanAmount: 85000, status: "ACTIVE" },
  { id: "3", tagNumber: "GL000141", billNumber: "GL000141", description: "Gold Chain", purity: "22K", grossWeight: 8.0, netWeight: 8.0, customerName: "Priya Sundaram", loanAmount: 45000, status: "ACTIVE" },
  { id: "4", tagNumber: "GL000138", billNumber: "GL000138", description: "Gold Ring (set of 3)", purity: "18K", grossWeight: 5.2, netWeight: 5.0, customerName: "Vijay Raman", loanAmount: 67000, status: "RENEWED" },
  { id: "5", tagNumber: "GL000140", billNumber: "GL000140", description: "Gold Earrings (heavy)", purity: "22K", grossWeight: 18.5, netWeight: 18.0, customerName: "Mohammed Farhan", loanAmount: 120000, status: "OVERDUE" },
]

const totalWeight = mockInventory.reduce((sum, i) => sum + i.netWeight, 0)
const totalValue = mockInventory.reduce((sum, i) => sum + i.loanAmount, 0)

const statusVariant: Record<string, "fresh" | "danger" | "aging" | "stale"> = {
  ACTIVE: "fresh",
  OVERDUE: "danger",
  RENEWED: "aging",
  CLOSED: "stale",
}

export default function InventoryPage() {
  const [search, setSearch] = useState("")

  const filtered = mockInventory.filter(
    (i) =>
      i.tagNumber.toLowerCase().includes(search.toLowerCase()) ||
      i.description.toLowerCase().includes(search.toLowerCase()) ||
      i.customerName.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col min-h-full">
      <Header title="Inventory" subtitle="Pledged gold ornaments" />

      <div className="flex-1 p-4 md:p-6 space-y-5 max-w-[1280px] mx-auto w-full">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Items", value: mockInventory.length, icon: Package },
            { label: "Active Pledges", value: mockInventory.filter(i => i.status === "ACTIVE").length, icon: Package },
            { label: "Total Net Weight", value: `${totalWeight.toFixed(2)}g`, icon: Scale },
            { label: "Total Loan Value", value: formatCurrency(totalValue), icon: Scale },
          ].map((stat) => (
            <Card key={stat.label} className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-50">
                  <stat.icon className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">{stat.label}</p>
                  <p className="text-lg font-bold font-mono text-[#0F172A]">{stat.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {["22K", "18K", "24K"].map((purity) => {
            const items = mockInventory.filter(i => i.purity === purity)
            const weight = items.reduce((s, i) => s + i.netWeight, 0)
            return (
              <Card key={purity} className="p-4 text-center">
                <p className="text-lg font-bold text-[#0F172A]">{purity}</p>
                <p className="text-sm font-mono text-slate-600">{weight.toFixed(2)}g</p>
                <p className="text-xs text-slate-400">{items.length} items</p>
              </Card>
            )
          })}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="search"
            placeholder="Search by tag number, description or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-9"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pledged Items</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tag / Bill #</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Purity</TableHead>
                  <TableHead>Gross Wt</TableHead>
                  <TableHead>Net Wt</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Loan Amt</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell><span className="font-mono text-xs text-[#0F172A] font-semibold">{item.tagNumber}</span></TableCell>
                    <TableCell><span className="text-sm text-[#0F172A]">{item.description}</span></TableCell>
                    <TableCell><Badge variant="aging">{item.purity}</Badge></TableCell>
                    <TableCell><span className="font-mono text-xs">{item.grossWeight}g</span></TableCell>
                    <TableCell><span className="font-mono text-xs font-semibold">{item.netWeight}g</span></TableCell>
                    <TableCell><span className="text-sm">{item.customerName}</span></TableCell>
                    <TableCell><span className="font-mono text-xs">{formatCurrency(item.loanAmount)}</span></TableCell>
                    <TableCell><Badge variant={statusVariant[item.status] || "default"}>{item.status}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
