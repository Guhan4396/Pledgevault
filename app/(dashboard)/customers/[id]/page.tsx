import { ArrowLeft, Phone, Mail, MapPin, Shield, FileText, Clock } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle, CardSubtitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatDate } from "@/lib/utils"

const mockCustomer = {
  id: "1",
  name: "Rajesh Kumar",
  phone: "9876543210",
  email: "rajesh@example.com",
  address: "12/A, Anna Nagar, Chennai - 600040",
  aadhaar: "XXXX XXXX 3456",
  pan: "ABCDE1234F",
  reputationScore: 98,
  createdAt: new Date("2024-01-15"),
  loans: [
    { id: "1", billNumber: "GL000142", principalAmount: 85000, status: "ACTIVE", loanDate: new Date("2025-01-10"), maturityDate: new Date("2025-07-10") },
    { id: "2", billNumber: "GL000098", principalAmount: 45000, status: "CLOSED", loanDate: new Date("2024-06-01"), maturityDate: new Date("2024-12-01") },
  ],
}

const statusVariant: Record<string, "fresh" | "stale" | "danger" | "aging"> = {
  ACTIVE: "fresh",
  CLOSED: "stale",
  OVERDUE: "danger",
  RENEWED: "aging",
}

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
  const customer = mockCustomer

  return (
    <div className="flex flex-col min-h-full">
      <Header title={customer.name} subtitle={`Customer #${params.id}`} />

      <div className="flex-1 p-4 md:p-6 space-y-5 max-w-[1280px] mx-auto w-full">
        <Link href="/customers" className="flex items-center gap-2 text-sm text-slate-500 hover:text-[#0F172A] transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Customers
        </Link>

        <div className="grid md:grid-cols-3 gap-5">

          <Card className="md:col-span-1">
            <CardContent className="pt-5">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-16 h-16 rounded-full bg-[#0F172A] flex items-center justify-center text-white text-2xl font-bold">
                  {customer.name.charAt(0)}
                </div>
                <div>
                  <h2 className="font-bold text-[#0F172A] text-lg">{customer.name}</h2>
                  <Badge variant={customer.reputationScore >= 90 ? "fresh" : customer.reputationScore >= 70 ? "aging" : "danger"} className="mt-1">
                    Score: {customer.reputationScore}
                  </Badge>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="text-[#0F172A] font-mono">{customer.phone}</span>
                </div>
                {customer.email && (
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-[#0F172A] truncate">{customer.email}</span>
                  </div>
                )}
                {customer.address && (
                  <div className="flex items-start gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span className="text-[#0F172A]">{customer.address}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="text-slate-500">Customer since {formatDate(customer.createdAt)}</span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-1">
                  <Shield className="w-3 h-3" /> KYC Details
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Aadhaar</span>
                    <span className="text-xs font-mono text-[#0F172A]">{customer.aadhaar}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">PAN</span>
                    <span className="text-xs font-mono text-[#0F172A]">{customer.pan}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-2">
                <Link href={`/loans/new?customerId=${customer.id}`}>
                  <Button className="w-full">
                    <FileText className="w-4 h-4" />
                    New Loan
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Loan History</CardTitle>
              <CardSubtitle>{customer.loans.length} loans total</CardSubtitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {customer.loans.map((loan) => (
                  <Link
                    key={loan.id}
                    href={`/loans/${loan.id}`}
                    className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all group"
                  >
                    <div className="p-2.5 rounded-lg bg-slate-100">
                      <FileText className="w-4 h-4 text-slate-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm font-mono text-[#0F172A]">{loan.billNumber}</p>
                        <Badge variant={statusVariant[loan.status] || "default"}>{loan.status}</Badge>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {formatDate(loan.loanDate)} → {formatDate(loan.maturityDate)}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold font-mono text-[#0F172A]">{formatCurrency(loan.principalAmount)}</p>
                      <p className="text-xs text-slate-400">principal</p>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}
