"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Plus, Filter, ChevronRight, FileText } from "lucide-react"
import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatDate, calculateDaysUntil } from "@/lib/utils"

const mockLoans = [
  { id: "1", billNumber: "GL000142", customerName: "Rajesh Kumar", phone: "9876543210", principalAmount: 85000, interestRate: 2, status: "ACTIVE", loanDate: new Date("2025-01-10"), maturityDate: new Date("2025-07-10"), netWeight: 14.2 },
  { id: "2", billNumber: "GL000141", customerName: "Priya Sundaram", phone: "9876543211", principalAmount: 45000, interestRate: 2, status: "ACTIVE", loanDate: new Date("2025-02-15"), maturityDate: new Date("2025-08-15"), netWeight: 7.8 },
  { id: "3", billNumber: "GL000140", customerName: "Mohammed Farhan", phone: "9876543212", principalAmount: 120000, interestRate: 2, status: "OVERDUE", loanDate: new Date("2024-09-01"), maturityDate: new Date("2025-03-01"), netWeight: 20.5 },
  { id: "4", billNumber: "GL000139", customerName: "Lakshmi Devi", phone: "9876543213", principalAmount: 32000, interestRate: 2.5, status: "CLOSED", loanDate: new Date("2024-12-01"), maturityDate: new Date("2025-06-01"), netWeight: 5.5 },
  { id: "5", billNumber: "GL000138", customerName: "Vijay Raman", phone: "9876543214", principalAmount: 67000, interestRate: 2, status: "RENEWED", loanDate: new Date("2024-11-15"), maturityDate: new Date("2025-05-15"), netWeight: 11.3 },
  { id: "6", billNumber: "GL000137", customerName: "Kavitha Nair", phone: "9876543215", principalAmount: 58000, interestRate: 2, status: "AUCTION_NOTICE_SENT", loanDate: new Date("2024-08-01"), maturityDate: new Date("2025-02-01"), netWeight: 9.8 },
]

const STATUS_OPTIONS = ["ALL", "ACTIVE", "OVERDUE", "CLOSED", "RENEWED", "AUCTION_NOTICE_SENT"]

const statusVariant: Record<string, "fresh" | "danger" | "stale" | "aging" | "warning" | "default"> = {
  ACTIVE: "fresh",
  OVERDUE: "danger",
  CLOSED: "stale",
  RENEWED: "aging",
  AUCTION_NOTICE_SENT: "danger",
}

export default function LoansPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")

  const filtered = mockLoans.filter((l) => {
    const matchSearch =
      l.billNumber.toLowerCase().includes(search.toLowerCase()) ||
      l.customerName.toLowerCase().includes(search.toLowerCase()) ||
      l.phone.includes(search)
    const matchStatus = statusFilter === "ALL" || l.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="flex flex-col min-h-full">
      <Header title="Loans" subtitle={`${mockLoans.filter(l => l.status === "ACTIVE").length} active loans`} />

      <div className="flex-1 p-4 md:p-6 space-y-4 max-w-[1280px] mx-auto w-full">

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="search"
              placeholder="Search bill number, customer or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-9"
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input pl-9 pr-4 w-auto appearance-none"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s === "ALL" ? "All Status" : s.replace("_", " ")}</option>
                ))}
              </select>
            </div>
            <Link href="/loans/new">
              <Button>
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New Loan</span>
              </Button>
            </Link>
          </div>
        </div>

        <Card>
          <div className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No loans found</p>
              </div>
            ) : (
              filtered.map((loan) => {
                const daysUntil = calculateDaysUntil(loan.maturityDate)
                const isNearMaturity = daysUntil > 0 && daysUntil <= 30
                return (
                  <Link
                    key={loan.id}
                    href={`/loans/${loan.id}`}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors group"
                  >
                    <div className="p-2 rounded-lg bg-slate-100 shrink-0">
                      <FileText className="w-4 h-4 text-slate-600" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm font-mono text-[#0F172A]">{loan.billNumber}</span>
                        <Badge variant={statusVariant[loan.status] || "default"}>
                          {loan.status.replace("_", " ")}
                        </Badge>
                        {isNearMaturity && loan.status === "ACTIVE" && (
                          <Badge variant="warning">Due in {daysUntil}d</Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 mt-0.5">{loan.customerName}</p>
                      <p className="text-xs text-slate-400 font-mono">
                        {loan.netWeight}g · {loan.interestRate}% / month · {formatDate(loan.loanDate)} → {formatDate(loan.maturityDate)}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="font-bold font-mono text-[#0F172A]">{formatCurrency(loan.principalAmount)}</p>
                      <p className="text-xs text-slate-400">principal</p>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 shrink-0" />
                  </Link>
                )
              })
            )}
          </div>
        </Card>

      </div>
    </div>
  )
}
