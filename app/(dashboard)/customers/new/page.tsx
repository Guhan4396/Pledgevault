"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function NewCustomerPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    aadhaar: "",
    pan: "",
    address: "",
  })

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((e) => ({ ...e, [field]: "" }))
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {}
    if (!form.name.trim()) newErrors.name = "Name is required"
    if (!form.phone.trim()) newErrors.phone = "Phone number is required"
    else if (!/^\d{10}$/.test(form.phone)) newErrors.phone = "Enter a valid 10-digit phone number"
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = "Enter a valid email"
    if (form.aadhaar && !/^\d{12}$/.test(form.aadhaar)) newErrors.aadhaar = "Aadhaar must be 12 digits"
    if (form.pan && !/^[A-Z]{5}\d{4}[A-Z]$/.test(form.pan.toUpperCase())) newErrors.pan = "Enter a valid PAN number"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, branchId: "default" }),
      })
      if (res.ok) {
        const data = await res.json()
        router.push(`/customers/${data.id}`)
      }
    } catch {
      // handle error
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-full">
      <Header title="New Customer" subtitle="Add a new customer to the system" />

      <div className="flex-1 p-4 md:p-6 max-w-2xl mx-auto w-full">
        <Link href="/customers" className="flex items-center gap-2 text-sm text-slate-500 hover:text-[#0F172A] mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Customers
        </Link>

        <form onSubmit={handleSubmit} className="space-y-5">

          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name *"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="e.g., Rajesh Kumar"
                  error={errors.name}
                />
                <Input
                  label="Phone Number *"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  error={errors.phone}
                />
              </div>
              <Input
                label="Email Address"
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="optional"
                error={errors.email}
              />
              <Input
                label="Address"
                value={form.address}
                onChange={(e) => set("address", e.target.value)}
                placeholder="Full address"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>KYC Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Aadhaar Number"
                  value={form.aadhaar}
                  onChange={(e) => set("aadhaar", e.target.value)}
                  placeholder="12-digit Aadhaar"
                  maxLength={12}
                  error={errors.aadhaar}
                  hint="Stored encrypted"
                />
                <Input
                  label="PAN Number"
                  value={form.pan}
                  onChange={(e) => set("pan", e.target.value.toUpperCase())}
                  placeholder="ABCDE1234F"
                  maxLength={10}
                  error={errors.pan}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3 justify-end">
            <Link href="/customers">
              <Button type="button" variant="secondary">Cancel</Button>
            </Link>
            <Button type="submit" loading={loading} disabled={loading}>
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : "Create Customer"}
            </Button>
          </div>

        </form>
      </div>
    </div>
  )
}
