import { AlertTriangle, Phone, Clock } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/utils"

const mockOverdue = [
  { id: "1", billNumber: "GL000101", customerName: "Senthil Murugan", phone: "9876543220", daysOverdue: 72, principalAmount: 95000, maturityDate: new Date("2025-04-09"), auctionNotice: true },
  { id: "2", billNumber: "GL000089", customerName: "Kavitha Nair", phone: "9876543221", daysOverdue: 45, principalAmount: 58000, maturityDate: new Date("2025-05-06"), auctionNotice: false },
  { id: "3", billNumber: "GL000077", customerName: "Arjun Patel", phone: "9876543222", daysOverdue: 31, principalAmount: 42000, maturityDate: new Date("2025-05-20"), auctionNotice: false },
  { id: "4", billNumber: "GL000133", customerName: "Subramanian R", phone: "9876543223", daysOverdue: 12, principalAmount: 76000, maturityDate: new Date("2025-06-09"), auctionNotice: false },
]

function urgencyLevel(days: number): "critical" | "high" | "medium" {
  if (days >= 60) return "critical"
  if (days >= 30) return "high"
  return "medium"
}

export default function OverduePage() {
  const critical = mockOverdue.filter(l => urgencyLevel(l.daysOverdue) === "critical")
  const high = mockOverdue.filter(l => urgencyLevel(l.daysOverdue) === "high")
  const medium = mockOverdue.filter(l => urgencyLevel(l.daysOverdue) === "medium")

  return (
    <div className="flex flex-col min-h-full">
      <Header title="Overdue Loans" subtitle="Action required — sorted by urgency" />

      <div className="flex-1 p-4 md:p-6 space-y-5 max-w-[1280px] mx-auto w-full">

        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 border-red-200 bg-red-50">
            <p className="text-xs text-red-600 font-semibold">Critical (60+ days)</p>
            <p className="text-2xl font-bold font-mono text-red-700">{critical.length}</p>
          </Card>
          <Card className="p-4 border-amber-200 bg-amber-50">
            <p className="text-xs text-amber-600 font-semibold">High (30–59 days)</p>
            <p className="text-2xl font-bold font-mono text-amber-700">{high.length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-slate-500 font-semibold">Medium (7–29 days)</p>
            <p className="text-2xl font-bold font-mono text-[#0F172A]">{medium.length}</p>
          </Card>
        </div>

        {[
          { title: "Critical — Auction Notice Zone (60+ days)", loans: critical, color: "border-red-600" },
          { title: "High Priority (30–59 days)", loans: high, color: "border-amber-500" },
          { title: "Medium Priority (7–29 days)", loans: medium, color: "border-slate-400" },
        ].map((group) => group.loans.length > 0 && (
          <Card key={group.title}>
            <CardHeader>
              <CardTitle className={`border-l-[3px] pl-3 leading-tight text-base ${group.color} text-[#0F172A]`}>
                {group.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {group.loans.map((loan) => (
                  <div key={loan.id} className={`flex items-center gap-4 p-4 rounded-xl border ${loan.auctionNotice ? "bg-red-50 border-red-200" : "border-slate-200"}`}>
                    <div className={`p-2 rounded-lg ${loan.auctionNotice ? "bg-red-100" : "bg-amber-50"}`}>
                      <AlertTriangle className={`w-4 h-4 ${loan.auctionNotice ? "text-red-600" : "text-amber-600"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link href={`/loans/${loan.id}`} className="font-semibold text-sm font-mono text-[#0F172A] hover:underline">
                          {loan.billNumber}
                        </Link>
                        {loan.auctionNotice && <Badge variant="danger">Auction Notice Sent</Badge>}
                        <Badge variant="danger">{loan.daysOverdue}d overdue</Badge>
                      </div>
                      <p className="text-sm text-slate-600 mt-0.5">{loan.customerName}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <Phone className="w-3 h-3" /> {loan.phone}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <Clock className="w-3 h-3" /> Was due {formatDate(loan.maturityDate)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold font-mono text-[#0F172A]">{formatCurrency(loan.principalAmount)}</p>
                      <p className="text-xs text-slate-400">outstanding</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

      </div>
    </div>
  )
}
