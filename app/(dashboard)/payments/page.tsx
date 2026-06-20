"use client"

import { useState } from "react"
import { Search, Printer } from "lucide-react"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle, CardSubtitle } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { formatCurrency, formatDateTime } from "@/lib/utils"

const mockPayments = [
  { id: "1", billNumber: "GL000142", customerName: "Rajesh Kumar", amount: 1700, interestPaid: 1700, principalPaid: 0, paymentDate: new Date(), receiptNumber: "RCP001" },
  { id: "2", billNumber: "GL000141", customerName: "Priya Sundaram", amount: 900, interestPaid: 900, principalPaid: 0, paymentDate: new Date(Date.now() - 3600000), receiptNumber: "RCP002" },
  { id: "3", billNumber: "GL000139", customerName: "Lakshmi Devi", amount: 37500, interestPaid: 3500, principalPaid: 34000, paymentDate: new Date(Date.now() - 7200000), receiptNumber: "RCP003" },
  { id: "4", billNumber: "GL000138", customerName: "Vijay Raman", amount: 1340, interestPaid: 1340, principalPaid: 0, paymentDate: new Date(Date.now() - 86400000), receiptNumber: "RCP004" },
]

const todayTotal = mockPayments
  .filter((p) => new Date(p.paymentDate).toDateString() === new Date().toDateString())
  .reduce((sum, p) => sum + p.amount, 0)

export default function PaymentsPage() {
  const [search, setSearch] = useState("")

  const filtered = mockPayments.filter(
    (p) =>
      p.billNumber.toLowerCase().includes(search.toLowerCase()) ||
      p.customerName.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col min-h-full">
      <Header title="Payments" subtitle="Today's collection overview" />

      <div className="flex-1 p-4 md:p-6 space-y-5 max-w-[1280px] mx-auto w-full">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Today's Collections", value: formatCurrency(todayTotal), color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
            { label: "Transactions Today", value: mockPayments.filter(p => new Date(p.paymentDate).toDateString() === new Date().toDateString()).length, color: "text-[#0F172A]", bg: "" },
            { label: "Interest Collected", value: formatCurrency(mockPayments.reduce((s, p) => s + p.interestPaid, 0)), color: "text-[#0F172A]", bg: "" },
            { label: "Principal Repaid", value: formatCurrency(mockPayments.reduce((s, p) => s + p.principalPaid, 0)), color: "text-[#0F172A]", bg: "" },
          ].map((stat) => (
            <Card key={stat.label} className={`p-4 ${stat.bg}`}>
              <p className="text-xs text-slate-500 mb-1">{stat.label}</p>
              <p className={`text-xl font-bold font-mono ${stat.color}`}>{stat.value}</p>
            </Card>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="search"
            placeholder="Search by bill number or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-9"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardSubtitle>{filtered.length} payments</CardSubtitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Receipt #</TableHead>
                  <TableHead>Loan / Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Interest</TableHead>
                  <TableHead>Principal</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <span className="font-mono text-xs text-[#0F172A]">{payment.receiptNumber}</span>
                    </TableCell>
                    <TableCell>
                      <p className="font-semibold font-mono text-xs text-[#0F172A]">{payment.billNumber}</p>
                      <p className="text-xs text-slate-400">{payment.customerName}</p>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold font-mono text-emerald-700">{formatCurrency(payment.amount)}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-xs">{formatCurrency(payment.interestPaid)}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-xs">{formatCurrency(payment.principalPaid)}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-slate-400">{formatDateTime(payment.paymentDate)}</span>
                    </TableCell>
                    <TableCell>
                      <button
                        className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                        aria-label="Print receipt"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </TableCell>
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
