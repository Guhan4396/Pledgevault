"use client"

import { useState } from "react"
import { Save, Coins, Bell, Shield, Database, Building } from "lucide-react"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle, CardSubtitle } from "@/components/ui/card"
import { Input, Select } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const TABS = [
  { id: "business", label: "Business", icon: Building },
  { id: "gold-rate", label: "Gold Rate", icon: Coins },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "backup", label: "Backup", icon: Database },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("business")
  const [goldRate, setGoldRate] = useState("6850")
  const [purity, setPurity] = useState("22K")
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    setSaving(false)
  }

  return (
    <div className="flex flex-col min-h-full">
      <Header title="Settings" subtitle="Configure your business preferences" />

      <div className="flex-1 p-4 md:p-6 max-w-4xl mx-auto w-full">
        <div className="flex gap-6">

          <div className="w-48 shrink-0 space-y-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                  activeTab === tab.id
                    ? "bg-[#0F172A] text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-amber-400" : "text-slate-400"}`} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 space-y-5">

            {activeTab === "business" && (
              <Card>
                <CardHeader>
                  <CardTitle>Business Information</CardTitle>
                  <CardSubtitle>Your company details</CardSubtitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input label="Business Name" defaultValue="Sri Lakshmi Gold Loans" />
                  <Input label="Owner Name" defaultValue="Owner" />
                  <Input label="Phone" defaultValue="9876543200" />
                  <Input label="Address" defaultValue="15, Anna Salai, Chennai - 600002" />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Default Interest Rate (%/month)" type="number" defaultValue="2" step="0.1" />
                    <Input label="Default LTV %" type="number" defaultValue="75" min="65" max="85" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Default Loan Duration (days)" type="number" defaultValue="180" />
                    <Input label="Grace Period (days)" type="number" defaultValue="7" />
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleSave} loading={saving}>
                      <Save className="w-4 h-4" />
                      {saving ? "Saving…" : "Save Changes"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "gold-rate" && (
              <Card>
                <CardHeader>
                  <CardTitle>Gold Rate Management</CardTitle>
                  <CardSubtitle>Update today&apos;s gold rate for loan valuation</CardSubtitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="status-dot-fresh" />
                      <p className="text-xs font-semibold text-amber-700">Current Rate (22K)</p>
                    </div>
                    <p className="text-3xl font-bold font-mono text-amber-800">₹6,850 / gram</p>
                    <p className="text-xs text-amber-600 mt-1">Last updated: Today, 9:00 AM</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Select
                      label="Gold Purity"
                      value={purity}
                      onChange={(e) => setPurity(e.target.value)}
                      options={[
                        { value: "24K", label: "24K (99.9%)" },
                        { value: "22K", label: "22K (91.6%)" },
                        { value: "18K", label: "18K (75%)" },
                      ]}
                    />
                    <Input
                      label="Rate per gram (₹)"
                      type="number"
                      value={goldRate}
                      onChange={(e) => setGoldRate(e.target.value)}
                    />
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm">
                    <p className="text-slate-500">Entering a new rate will <strong className="text-[#0F172A]">snapshot</strong> the current rate for all future loans created today. Existing loans are unaffected.</p>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleSave} loading={saving}>
                      <Coins className="w-4 h-4" />
                      {saving ? "Updating…" : "Update Gold Rate"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "notifications" && (
              <Card>
                <CardHeader>
                  <CardTitle>SMS Notifications</CardTitle>
                  <CardSubtitle>Configure SMS alerts for customers</CardSubtitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200">
                    <div>
                      <p className="text-sm font-medium text-[#0F172A]">SMS Notifications</p>
                      <p className="text-xs text-slate-400">Send loan and payment updates via SMS</p>
                    </div>
                    <Badge variant="stale">Disabled</Badge>
                  </div>
                  <Select label="SMS Provider" options={[
                    { value: "", label: "Select provider…" },
                    { value: "msg91", label: "MSG91" },
                    { value: "twilio", label: "Twilio" },
                  ]} />
                  <Input label="API Key" type="password" placeholder="Enter API key" />
                  <Input label="Sender ID" placeholder="e.g., PLEDGE" maxLength={6} />
                  <div className="flex justify-end">
                    <Button variant="secondary">Test SMS</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "security" && (
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardSubtitle>Authentication and access control</CardSubtitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input label="Current Password" type="password" />
                  <Input label="New Password" type="password" />
                  <Input label="Confirm New Password" type="password" />
                  <div className="flex justify-end">
                    <Button onClick={handleSave}>Change Password</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "backup" && (
              <Card>
                <CardHeader>
                  <CardTitle>Backup &amp; Recovery</CardTitle>
                  <CardSubtitle>Database backup configuration</CardSubtitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <p className="text-sm font-semibold text-[#0F172A]">Automated Nightly Backup</p>
                    <p className="text-xs text-slate-500">Configure via cron on your server:</p>
                    <code className="block text-xs bg-[#0F172A] text-green-400 p-3 rounded-lg font-mono">
                      {`0 2 * * * pg_dump -U postgres pledgevault > /backups/pledgevault_$(date +%Y%m%d).sql`}
                    </code>
                  </div>
                  <div className="p-3 rounded-xl border border-amber-200 bg-amber-50">
                    <p className="text-xs text-amber-700 font-semibold">⚠ Critical Reminder</p>
                    <p className="text-xs text-amber-600 mt-1">Test your backup restore monthly. An untested backup is not a backup.</p>
                  </div>
                  <Button variant="secondary">
                    <Database className="w-4 h-4" />
                    Download Manual Backup
                  </Button>
                </CardContent>
              </Card>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
