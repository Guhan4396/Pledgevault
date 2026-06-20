"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Plus, Trash2, Loader2, Calculator } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input, Select, Textarea } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"

const PURITY_OPTIONS = [
  { value: "24K", label: "24K (99.9%)" },
  { value: "22K", label: "22K (91.6%)" },
  { value: "18K", label: "18K (75%)" },
  { value: "14K", label: "14K (58.3%)" },
]

interface Ornament {
  id: string
  description: string
  grossWeight: string
  stoneWeight: string
  purity: string
}

const GOLD_RATE_PER_GRAM = 6850

function calcNetWeight(gross: string, stone: string): number {
  return Math.max(0, parseFloat(gross || "0") - parseFloat(stone || "0"))
}

export default function NewLoanPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const prefillCustomerId = searchParams.get("customerId") || ""

  const [loading, setLoading] = useState(false)
  const [ornaments, setOrnaments] = useState<Ornament[]>([
    { id: "1", description: "", grossWeight: "", stoneWeight: "0", purity: "22K" },
  ])
  const [form, setForm] = useState({
    customerId: prefillCustomerId,
    customerName: "",
    customerPhone: "",
    interestRate: "2",
    ltvPercent: "75",
    loanDays: "180",
    notes: "",
  })
  const [loanAmount, setLoanAmount] = useState(0)
  const [totalNetWeight, setTotalNetWeight] = useState(0)
  const [goldValue, setGoldValue] = useState(0)

  useEffect(() => {
    const netWeight = ornaments.reduce((sum, o) => sum + calcNetWeight(o.grossWeight, o.stoneWeight), 0)
    const value = netWeight * GOLD_RATE_PER_GRAM
    const suggested = value * (parseFloat(form.ltvPercent) / 100)
    setTotalNetWeight(netWeight)
    setGoldValue(value)
    setLoanAmount(suggested)
  }, [ornaments, form.ltvPercent])

  function addOrnament() {
    setOrnaments((prev) => [
      ...prev,
      { id: Date.now().toString(), description: "", grossWeight: "", stoneWeight: "0", purity: "22K" },
    ])
  }

  function removeOrnament(id: string) {
    if (ornaments.length === 1) return
    setOrnaments((prev) => prev.filter((o) => o.id !== id))
  }

  function updateOrnament(id: string, field: keyof Ornament, value: string) {
    setOrnaments((prev) => prev.map((o) => (o.id === id ? { ...o, [field]: value } : o)))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/loans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          ornaments,
          principalAmount: loanAmount,
          goldRatePerGram: GOLD_RATE_PER_GRAM,
          netWeight: totalNetWeight,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        router.push(`/loans/${data.id}`)
      }
    } catch {
      // handle
    } finally {
      setLoading(false)
    }
  }

  const maturityDate = new Date()
  maturityDate.setDate(maturityDate.getDate() + parseInt(form.loanDays || "180"))

  return (
    <div className="flex flex-col min-h-full">
      <Header title="New Loan" subtitle="Create a new gold loan pledge" />

      <div className="flex-1 p-4 md:p-6 max-w-3xl mx-auto w-full">
        <Link href="/loans" className="flex items-center gap-2 text-sm text-slate-500 hover:text-[#0F172A] mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Loans
        </Link>

        <form onSubmit={handleSubmit} className="space-y-5">

          <Card>
            <CardHeader><CardTitle>Customer</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Customer Name *"
                  value={form.customerName}
                  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                  placeholder="Search or enter name"
                  required
                />
                <Input
                  label="Phone Number *"
                  type="tel"
                  value={form.customerPhone}
                  onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                  placeholder="10-digit mobile"
                  maxLength={10}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Pledged Ornaments</CardTitle>
                <Button type="button" variant="secondary" size="sm" onClick={addOrnament}>
                  <Plus className="w-3.5 h-3.5" /> Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {ornaments.map((ornament, idx) => (
                <div key={ornament.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Item {idx + 1}</p>
                    {ornaments.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeOrnament(ornament.id)}
                        className="p-1 rounded text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <Input
                    label="Description"
                    value={ornament.description}
                    onChange={(e) => updateOrnament(ornament.id, "description", e.target.value)}
                    placeholder="e.g., Gold necklace, Bangles"
                  />
                  <div className="grid grid-cols-3 gap-3">
                    <Input
                      label="Gross Wt (g) *"
                      type="number"
                      step="0.001"
                      value={ornament.grossWeight}
                      onChange={(e) => updateOrnament(ornament.id, "grossWeight", e.target.value)}
                      placeholder="0.000"
                      required
                    />
                    <Input
                      label="Stone Wt (g)"
                      type="number"
                      step="0.001"
                      value={ornament.stoneWeight}
                      onChange={(e) => updateOrnament(ornament.id, "stoneWeight", e.target.value)}
                      placeholder="0.000"
                    />
                    <Select
                      label="Purity"
                      value={ornament.purity}
                      onChange={(e) => updateOrnament(ornament.id, "purity", e.target.value)}
                      options={PURITY_OPTIONS}
                    />
                  </div>
                  {ornament.grossWeight && (
                    <p className="text-xs text-slate-400">
                      Net weight: <span className="font-mono font-semibold text-[#0F172A]">
                        {calcNetWeight(ornament.grossWeight, ornament.stoneWeight).toFixed(3)}g
                      </span>
                    </p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-amber-50/50">
            <CardHeader><CardTitle className="border-amber-600 text-amber-800">Valuation Summary</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-white rounded-xl border border-amber-200">
                  <p className="text-xs text-slate-500 mb-1">Gold Rate (22K)</p>
                  <p className="text-base font-bold font-mono text-[#0F172A]">₹{GOLD_RATE_PER_GRAM}/g</p>
                </div>
                <div className="text-center p-3 bg-white rounded-xl border border-amber-200">
                  <p className="text-xs text-slate-500 mb-1">Total Net Weight</p>
                  <p className="text-base font-bold font-mono text-[#0F172A]">{totalNetWeight.toFixed(3)}g</p>
                </div>
                <div className="text-center p-3 bg-white rounded-xl border border-amber-200">
                  <p className="text-xs text-slate-500 mb-1">Gold Value</p>
                  <p className="text-base font-bold font-mono text-[#0F172A]">{formatCurrency(goldValue)}</p>
                </div>
                <div className="text-center p-3 bg-amber-100 rounded-xl border border-amber-300">
                  <p className="text-xs text-amber-700 mb-1 font-semibold">Suggested Loan</p>
                  <p className="text-base font-bold font-mono text-amber-800">{formatCurrency(loanAmount)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Loan Terms</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Loan Amount (₹) *"
                  type="number"
                  value={loanAmount.toFixed(0)}
                  onChange={(e) => setLoanAmount(parseFloat(e.target.value))}
                  hint={`LTV: ${form.ltvPercent}%`}
                  required
                />
                <Input
                  label="LTV %"
                  type="number"
                  min="65"
                  max="85"
                  value={form.ltvPercent}
                  onChange={(e) => setForm({ ...form, ltvPercent: e.target.value })}
                  hint="65% – 85%"
                />
                <Input
                  label="Interest Rate (% / month)"
                  type="number"
                  step="0.1"
                  value={form.interestRate}
                  onChange={(e) => setForm({ ...form, interestRate: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Loan Duration (days)"
                  type="number"
                  value={form.loanDays}
                  onChange={(e) => setForm({ ...form, loanDays: e.target.value })}
                  hint={`Maturity: ${maturityDate.toLocaleDateString("en-IN")}`}
                />
                <div className="flex items-end gap-2">
                  <div className="flex-1 p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-xs text-slate-400">Monthly Interest</p>
                    <p className="text-base font-bold font-mono text-[#0F172A]">
                      {formatCurrency(loanAmount * (parseFloat(form.interestRate || "0") / 100))}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Calculator className="w-3 h-3 text-slate-400" />
                      <p className="text-[10px] text-slate-400">auto-calculated</p>
                    </div>
                  </div>
                </div>
              </div>
              <Textarea
                label="Notes"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Any additional notes..."
              />
            </CardContent>
          </Card>

          <div className="flex gap-3 justify-end">
            <Link href="/loans">
              <Button type="button" variant="secondary">Cancel</Button>
            </Link>
            <Button type="submit" loading={loading} disabled={loading || loanAmount <= 0}>
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating Loan…</> : "Create Loan & Print Receipt"}
            </Button>
          </div>

        </form>
      </div>
    </div>
  )
}
