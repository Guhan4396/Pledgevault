import {
  Coins,
  TrendingUp,
  AlertTriangle,
  Users,
  FileText,
  CreditCard,
  RefreshCw,
  Package,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle, CardSubtitle } from "@/components/ui/card"
import { StatCard } from "@/components/ui/stat-card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/utils"

// Mock data — replace with real DB queries
const stats = {
  activeLoans: 142,
  outstandingPrincipal: 8450000,
  interestIncome: 125000,
  dailyCollections: 42000,
  closuresToday: 3,
  overdueLoans: 12,
  totalCustomers: 387,
  renewalsDue: 8,
}

const recentLoans = [
  { id: "1", billNumber: "GL000142", customerName: "Rajesh Kumar", amount: 85000, status: "ACTIVE", date: new Date() },
  { id: "2", billNumber: "GL000141", customerName: "Priya Sundaram", amount: 45000, status: "ACTIVE", date: new Date() },
  { id: "3", billNumber: "GL000140", customerName: "Mohammed Farhan", amount: 120000, status: "OVERDUE", date: new Date(Date.now() - 86400000 * 45) },
  { id: "4", billNumber: "GL000139", customerName: "Lakshmi Devi", amount: 32000, status: "CLOSED", date: new Date(Date.now() - 86400000 * 2) },
  { id: "5", billNumber: "GL000138", customerName: "Vijay Raman", amount: 67000, status: "RENEWED", date: new Date(Date.now() - 86400000 * 5) },
]

const overdueAlerts = [
  { billNumber: "GL000101", customerName: "Senthil Murugan", daysOverdue: 72, amount: 95000, phone: "9876543210" },
  { billNumber: "GL000089", customerName: "Kavitha Nair", daysOverdue: 45, amount: 58000, phone: "9876543211" },
  { billNumber: "GL000077", customerName: "Arjun Patel", daysOverdue: 31, amount: 42000, phone: "9876543212" },
]

const statusBadge: Record<string, "fresh" | "danger" | "aging" | "stale" | "default"> = {
  ACTIVE: "fresh",
  OVERDUE: "danger",
  CLOSED: "stale",
  RENEWED: "aging",
  AUCTION_NOTICE_SENT: "warning" as "danger",
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-full">
      <Header title="Dashboard" subtitle="Welcome back — here&apos;s your business overview" />

      <div className="flex-1 p-4 md:p-6 space-y-6 max-w-[1280px] mx-auto w-full">

        {/* Primary Stats */}
        <section>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              title="Active Loans"
              value={stats.activeLoans}
              subtitle="across all branches"
              icon={FileText}
              iconColor="text-blue-600"
              dark
            />
            <StatCard
              title="Outstanding Principal"
              value={formatCurrency(stats.outstandingPrincipal)}
              subtitle="total deployed"
              icon={Coins}
              iconColor="text-amber-600"
            />
            <StatCard
              title="Interest Income"
              value={formatCurrency(stats.interestIncome)}
              subtitle="this month"
              icon={TrendingUp}
              iconColor="text-emerald-600"
              trend={{ value: 12, label: "vs last month" }}
            />
            <StatCard
              title="Daily Collections"
              value={formatCurrency(stats.dailyCollections)}
              subtitle="today"
              icon={CreditCard}
              iconColor="text-violet-600"
            />
          </div>
        </section>

        {/* Secondary Stats */}
        <section>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-100">
                  <Users className="w-4 h-4 text-slate-600" />
                </div>
                <div>
                  <p className="text-xl font-bold font-mono text-[#0F172A]">{stats.totalCustomers}</p>
                  <p className="text-xs text-slate-400">Total Customers</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-50">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <p className="text-xl font-bold font-mono text-red-600">{stats.overdueLoans}</p>
                  <p className="text-xs text-slate-400">Overdue Loans</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-50">
                  <RefreshCw className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-xl font-bold font-mono text-amber-600">{stats.renewalsDue}</p>
                  <p className="text-xs text-slate-400">Renewals Due</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-50">
                  <Package className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xl font-bold font-mono text-emerald-600">{stats.closuresToday}</p>
                  <p className="text-xs text-slate-400">Closures Today</p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Recent Loans + Overdue Alerts */}
        <section className="grid md:grid-cols-2 gap-6">

          {/* Recent Loans */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Loans</CardTitle>
                  <CardSubtitle>Latest loan activity</CardSubtitle>
                </div>
                <Link
                  href="/loans"
                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-[#0F172A] transition-colors"
                >
                  View all <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {recentLoans.map((loan) => (
                  <Link
                    key={loan.id}
                    href={`/loans/${loan.id}`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-xs font-bold text-slate-600">
                      {loan.customerName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#0F172A] truncate">{loan.customerName}</p>
                      <p className="text-xs text-slate-400 font-mono">{loan.billNumber} · {formatDate(loan.date)}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold font-mono text-[#0F172A]">{formatCurrency(loan.amount)}</p>
                      <Badge variant={statusBadge[loan.status] || "default"}>
                        {loan.status}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Overdue Alerts */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-red-700 border-red-700">Overdue Alerts</CardTitle>
                  <CardSubtitle>Immediate attention required</CardSubtitle>
                </div>
                <Link
                  href="/overdue"
                  className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition-colors"
                >
                  View all <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {overdueAlerts.map((alert) => (
                  <div
                    key={alert.billNumber}
                    className="flex items-center gap-3 p-3 rounded-lg bg-red-50 border border-red-100"
                  >
                    <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#0F172A] truncate">{alert.customerName}</p>
                      <p className="text-xs text-slate-500 font-mono">{alert.billNumber} · {alert.phone}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-red-600">{alert.daysOverdue}d overdue</p>
                      <p className="text-xs text-slate-500 font-mono">{formatCurrency(alert.amount)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="section-title mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "New Loan", href: "/loans/new", icon: FileText, color: "bg-blue-50 text-blue-600" },
              { label: "Record Payment", href: "/payments/new", icon: CreditCard, color: "bg-emerald-50 text-emerald-600" },
              { label: "Add Customer", href: "/customers/new", icon: Users, color: "bg-violet-50 text-violet-600" },
              { label: "Update Gold Rate", href: "/settings?tab=gold-rate", icon: Coins, color: "bg-amber-50 text-amber-600" },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="card p-4 flex flex-col items-center gap-3 hover:shadow-[var(--shadow-card-hover)] transition-shadow text-center min-h-[80px] justify-center"
              >
                <div className={`p-2.5 rounded-lg ${action.color}`}>
                  <action.icon className="w-5 h-5" strokeWidth={2} />
                </div>
                <p className="text-xs font-semibold text-[#0F172A]">{action.label}</p>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
