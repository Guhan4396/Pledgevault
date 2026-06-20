"use client"

import { useState } from "react"
import { ArrowLeft, CreditCard, RefreshCw, Package, Printer, AlertTriangle, Clock, Scale } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle, CardSubtitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { formatCurrency, formatDate, calculateDaysUntil } from "@/lib/utils"

const mockLoan = {
  id: "1",
  billNumber: "GL000142",
  customer: { id: "1", name: "Rajesh Kumar", phone: "9876543210" },
  branch: { name: "Main Branch - Chennai" },
  principalAmount: 85000,
  outstandingPrincipal: 85000,
  accruedInterest: 5100,
  interestRate: 2,
  ltvPercent: 75,
  netWeight: 14.2,
  purity: "22K",
  goldValue: 97270,
  goldRateSnapshot: 6850,
  status: "ACTIVE",
  loanDate: new Date("2025-01-10"),
  maturityDate: new Date("2025-07-10"),
  gracePeriodEnd: new Date("2025-07-17"),
  ornaments: [
    { id: "1", description: "Gold Necklace (Thali)", grossWeight: 12.0, stoneWeight: 0, netWeight: 12.0, purity: "22K" },
    { id: "2", description: "Gold Bangle (pair)", grossWeight: 2.5, stoneWeight: 0.3, netWeight: 2.2, purity: "22K" },
  ],
  payments: [
    { id: "1", amount: 1700, interestPaid: 1700, principalPaid: 0, paymentDate: new Date("2025-02-10") },
    { id: "2", amount: 1700, interestPaid: 1700, principalPaid: 0, paymentDate: new Date("2025-03-10") },
  ],
}

const statusVariant: Record<string, "fresh" | "danger" | "stale" | "aging"> = {
  ACTIVE: "fresh",
  OVERDUE: "danger",
  CLOSED: "stale",
  RENEWED: "aging",
}

export default function LoanDetailPage({ params }: { params: { id: string } }) {
  const loan = mockLoan
  const [paymentModal, setPaymentModal] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState("")
  const [paymentLoading, setPaymentLoading] = useState(false)

  const daysUntilMaturity = calculateDaysUntil(loan.maturityDate)
  const monthlyInterest = loan.outstandingPrincipal * (loan.interestRate / 100)
  const totalOutstanding = loan.outstandingPrincipal + loan.accruedInterest

  async function handlePayment(e: React.FormEvent) {
    e.preventDefault()
    setPaymentLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    setPaymentLoading(false)
    setPaymentModal(false)
  }

  return (
    <div className="flex flex-col min-h-full">
      <Header title={`Loan ${loan.billNumber}`} subtitle={loan.customer.name} />

      <div className="flex-1 p-4 md:p-6 space-y-5 max-w-[1280px] mx-auto w-full">
        <div className="flex items-center justify-between">
          <Link href="/loans" className="flex items-center gap-2 text-sm text-slate-500 hover:text-[#0F172A] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Loans
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm">
              <Printer className="w-4 h-4" />
              Print Receipt
            </Button>
          </div>
        </div>

        {loan.status === "OVERDUE" && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-700">This loan is overdue</p>
              <p className="text-xs text-red-600">Contact customer immediately — auction notice may be triggered</p>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-5">

          <div className="md:col-span-2 space-y-5">

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{loan.billNumber}</CardTitle>
                    <CardSubtitle>{loan.branch.name}</CardSubtitle>
                  </div>
                  <Badge variant={statusVariant[loan.status] || "default"} className="text-sm px-3 py-1">
                    {loan.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Principal", value: formatCurrency(loan.principalAmount) },
                    { label: "Outstanding", value: formatCurrency(loan.outstandingPrincipal), highlight: true },
                    { label: "Accrued Interest", value: formatCurrency(loan.accruedInterest) },
                    { label: "Total Due", value: formatCurrency(totalOutstanding), highlight: true },
                  ].map((item) => (
                    <div key={item.label} className={`p-3 rounded-xl ${item.highlight ? "bg-[#0F172A] text-white" : "bg-slate-50"}`}>
                      <p className={`text-xs mb-1 ${item.highlight ? "text-slate-300" : "text-slate-500"}`}>{item.label}</p>
                      <p className={`text-base font-bold font-mono ${item.highlight ? "text-white" : "text-[#0F172A]"}`}>{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-xs text-slate-400">Loan Date</p>
                    <p className="text-sm font-semibold text-[#0F172A]">{formatDate(loan.loanDate)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Maturity Date</p>
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-semibold text-[#0F172A]">{formatDate(loan.maturityDate)}</p>
                      {daysUntilMaturity > 0 ? (
                        <Badge variant="aging" className="text-[10px]">{daysUntilMaturity}d left</Badge>
                      ) : (
                        <Badge variant="danger" className="text-[10px]">Expired</Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Monthly Interest</p>
                    <p className="text-sm font-semibold text-[#0F172A] font-mono">{formatCurrency(monthlyInterest)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Pledged Ornaments
                </CardTitle>
                <CardSubtitle>Net weight: {loan.netWeight}g · Rate: ₹{loan.goldRateSnapshot}/g</CardSubtitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {loan.ornaments.map((ornament) => (
                    <div key={ornament.id} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="p-2 rounded-lg bg-amber-100">
                        <Scale className="w-4 h-4 text-amber-700" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#0F172A]">{ornament.description || "Unnamed ornament"}</p>
                        <p className="text-xs text-slate-400 font-mono">
                          {ornament.purity} · Gross: {ornament.grossWeight}g · Stone: {ornament.stoneWeight}g · Net: {ornament.netWeight}g
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold font-mono text-[#0F172A]">
                          {formatCurrency(ornament.netWeight * (loan.goldRateSnapshot || 0))}
                        </p>
                        <p className="text-xs text-slate-400">value</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Payment History
                </CardTitle>
                <CardSubtitle>{loan.payments.length} payments made</CardSubtitle>
              </CardHeader>
              <CardContent className="pt-0">
                {loan.payments.length === 0 ? (
                  <p className="text-sm text-slate-400 py-4 text-center">No payments recorded yet</p>
                ) : (
                  <div className="space-y-2">
                    {loan.payments.map((payment) => (
                      <div key={payment.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs text-slate-400">{formatDate(payment.paymentDate)}</p>
                          <p className="text-xs text-slate-500">
                            Interest: {formatCurrency(payment.interestPaid)} · Principal: {formatCurrency(payment.principalPaid)}
                          </p>
                        </div>
                        <p className="text-sm font-bold font-mono text-emerald-700">{formatCurrency(payment.amount)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader><CardTitle>Actions</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" onClick={() => setPaymentModal(true)}>
                  <CreditCard className="w-4 h-4" />
                  Record Payment
                </Button>
                <Button variant="secondary" className="w-full">
                  <RefreshCw className="w-4 h-4" />
                  Renew Loan
                </Button>
                <Button variant="outline" className="w-full">
                  <Printer className="w-4 h-4" />
                  Print Statement
                </Button>
                {loan.status !== "CLOSED" && (
                  <Button variant="danger" className="w-full">
                    Close Loan
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Customer</CardTitle></CardHeader>
              <CardContent>
                <p className="font-semibold text-[#0F172A]">{loan.customer.name}</p>
                <p className="text-sm text-slate-500 font-mono mt-1">{loan.customer.phone}</p>
                <Link href={`/customers/${loan.customer.id}`} className="text-xs text-blue-600 hover:underline mt-2 inline-block">
                  View profile →
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-amber-50 border-amber-200">
              <CardHeader><CardTitle className="border-amber-600 text-amber-800">Gold Summary</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { label: "Net Weight", value: `${loan.netWeight}g` },
                    { label: "Purity", value: loan.purity },
                    { label: "Rate (at loan)", value: `₹${loan.goldRateSnapshot}/g` },
                    { label: "Gold Value", value: formatCurrency(loan.goldValue) },
                    { label: "LTV", value: `${loan.ltvPercent}%` },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between">
                      <span className="text-xs text-amber-700">{item.label}</span>
                      <span className="text-xs font-semibold font-mono text-amber-900">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>

      <Modal open={paymentModal} onClose={() => setPaymentModal(false)} title="Record Payment" size="sm">
        <form onSubmit={handlePayment} className="space-y-4">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-xs text-slate-400">Total Outstanding</p>
            <p className="text-lg font-bold font-mono text-[#0F172A]">{formatCurrency(totalOutstanding)}</p>
          </div>
          <Input
            label="Payment Amount (₹) *"
            type="number"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
            placeholder="Enter amount"
            required
          />
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setPaymentAmount(loan.accruedInterest.toString())}
              className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
            >
              Interest Only: {formatCurrency(loan.accruedInterest)}
            </button>
            <button
              type="button"
              onClick={() => setPaymentAmount(totalOutstanding.toString())}
              className="p-2 rounded-lg bg-[#0F172A] text-white hover:bg-slate-700 transition-colors"
            >
              Full Settlement: {formatCurrency(totalOutstanding)}
            </button>
          </div>
          <Button type="submit" className="w-full" loading={paymentLoading} disabled={paymentLoading || !paymentAmount}>
            {paymentLoading ? "Processing…" : "Record Payment"}
          </Button>
        </form>
      </Modal>
    </div>
  )
}
