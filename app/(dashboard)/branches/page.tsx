"use client"

import { useState } from "react"
import { GitBranch, Plus, MapPin, Phone, Users } from "lucide-react"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { formatCurrency } from "@/lib/utils"

const mockBranches = [
  { id: "1", name: "Main Branch - Chennai", address: "15, Anna Salai, Chennai - 600002", phone: "044-28540001", activeLoans: 142, totalPortfolio: 8450000, billPrefix: "GL", users: 4, isActive: true },
  { id: "2", name: "Tambaram Branch", address: "45, GST Road, Tambaram - 600045", phone: "044-22501234", activeLoans: 67, totalPortfolio: 3200000, billPrefix: "TB", users: 2, isActive: true },
  { id: "3", name: "Velachery Branch", address: "100, 100 Feet Road, Velachery - 600042", phone: "044-22445566", activeLoans: 0, totalPortfolio: 0, billPrefix: "VL", users: 0, isActive: false },
]

export default function BranchesPage() {
  const [addModal, setAddModal] = useState(false)
  const [form, setForm] = useState({ name: "", address: "", phone: "", billPrefix: "" })

  return (
    <div className="flex flex-col min-h-full">
      <Header title="Branches" subtitle={`${mockBranches.filter(b => b.isActive).length} active branches`} />

      <div className="flex-1 p-4 md:p-6 space-y-5 max-w-[1280px] mx-auto w-full">

        <div className="flex justify-end">
          <Button onClick={() => setAddModal(true)}>
            <Plus className="w-4 h-4" />
            Add Branch
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {mockBranches.map((branch) => (
            <Card key={branch.id} className={!branch.isActive ? "opacity-60" : ""}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-[#0F172A]">
                      <GitBranch className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <CardTitle className="text-base border-none pl-0">{branch.name}</CardTitle>
                      <p className="text-xs font-mono text-slate-400 mt-0.5">Prefix: {branch.billPrefix}</p>
                    </div>
                  </div>
                  <Badge variant={branch.isActive ? "fresh" : "stale"}>
                    {branch.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span className="text-slate-600">{branch.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-slate-600 font-mono">{branch.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-slate-600">{branch.users} staff members</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                  <div className="text-center">
                    <p className="text-lg font-bold font-mono text-[#0F172A]">{branch.activeLoans}</p>
                    <p className="text-xs text-slate-400">Active Loans</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold font-mono text-[#0F172A]">{formatCurrency(branch.totalPortfolio)}</p>
                    <p className="text-xs text-slate-400">Portfolio</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Modal open={addModal} onClose={() => setAddModal(false)} title="Add New Branch" size="md">
        <div className="space-y-4">
          <Input label="Branch Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g., T. Nagar Branch" />
          <Input label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Full address" />
          <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone number" />
          <Input label="Bill Prefix *" value={form.billPrefix} onChange={(e) => setForm({ ...form, billPrefix: e.target.value.toUpperCase() })} placeholder="e.g., TN" maxLength={4} hint="2–4 character prefix for bill numbers" />
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setAddModal(false)}>Cancel</Button>
            <Button>Create Branch</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
