"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Plus, Phone, FileText, ChevronRight, User } from "lucide-react"
import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

const mockCustomers = [
  { id: "1", name: "Rajesh Kumar", phone: "9876543210", activeLoans: 2, totalLoanAmount: 150000, reputationScore: 98 },
  { id: "2", name: "Priya Sundaram", phone: "9876543211", activeLoans: 1, totalLoanAmount: 45000, reputationScore: 100 },
  { id: "3", name: "Mohammed Farhan", phone: "9876543212", activeLoans: 1, totalLoanAmount: 120000, reputationScore: 75 },
  { id: "4", name: "Lakshmi Devi", phone: "9876543213", activeLoans: 0, totalLoanAmount: 0, reputationScore: 100 },
  { id: "5", name: "Vijay Raman", phone: "9876543214", activeLoans: 3, totalLoanAmount: 280000, reputationScore: 92 },
  { id: "6", name: "Kavitha Nair", phone: "9876543215", activeLoans: 1, totalLoanAmount: 58000, reputationScore: 65 },
  { id: "7", name: "Arjun Patel", phone: "9876543216", activeLoans: 1, totalLoanAmount: 42000, reputationScore: 70 },
  { id: "8", name: "Deepa Krishnan", phone: "9876543217", activeLoans: 2, totalLoanAmount: 95000, reputationScore: 100 },
]

function reputationVariant(score: number): "fresh" | "aging" | "danger" {
  if (score >= 90) return "fresh"
  if (score >= 70) return "aging"
  return "danger"
}

export default function CustomersPage() {
  const [search, setSearch] = useState("")
  const [loading] = useState(false)

  const filtered = mockCustomers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  )

  return (
    <div className="flex flex-col min-h-full">
      <Header title="Customers" subtitle={`${mockCustomers.length} registered customers`} />

      <div className="flex-1 p-4 md:p-6 space-y-4 max-w-[1280px] mx-auto w-full">

        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="search"
              placeholder="Search by name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-9"
            />
          </div>
          <Link href="/customers/new">
            <Button>
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Customer</span>
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="p-4">
                <Skeleton className="h-12 w-full" />
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <div className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <div className="p-12 text-center">
                  <User className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">No customers found</p>
                  <p className="text-xs text-slate-400 mt-1">Try a different search or add a new customer</p>
                </div>
              ) : (
                filtered.map((customer) => (
                  <Link
                    key={customer.id}
                    href={`/customers/${customer.id}`}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#0F172A] flex items-center justify-center shrink-0 text-white text-sm font-bold">
                      {customer.name.charAt(0)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-[#0F172A]">{customer.name}</p>
                        <Badge variant={reputationVariant(customer.reputationScore)}>
                          {customer.reputationScore}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <Phone className="w-3 h-3" /> {customer.phone}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <FileText className="w-3 h-3" /> {customer.activeLoans} active loan{customer.activeLoans !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      {customer.totalLoanAmount > 0 ? (
                        <p className="text-sm font-semibold font-mono text-[#0F172A]">
                          ₹{(customer.totalLoanAmount / 1000).toFixed(0)}K
                        </p>
                      ) : (
                        <p className="text-xs text-slate-400">No loans</p>
                      )}
                      <p className="text-xs text-slate-400">outstanding</p>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors shrink-0" />
                  </Link>
                ))
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
