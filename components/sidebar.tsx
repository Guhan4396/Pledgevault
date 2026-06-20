"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  Package,
  BarChart3,
  Settings,
  GitBranch,
  LogOut,
  Coins,
  AlertTriangle,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/loans", label: "Loans", icon: FileText },
  { href: "/payments", label: "Payments", icon: CreditCard },
  { href: "/inventory", label: "Inventory", icon: Package },
  { href: "/overdue", label: "Overdue", icon: AlertTriangle },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/branches", label: "Branches", icon: GitBranch },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-[#0F172A] border-r border-slate-800">
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-800">
        <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center">
          <Coins className="w-5 h-5 text-[#0F172A]" strokeWidth={2.5} />
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-tight">PledgeVault</p>
          <p className="text-slate-400 text-[10px]">Gold Loan Manager</p>
        </div>
      </div>

      <div className="mx-3 mt-3 px-3 py-2.5 rounded-lg bg-amber-400/10 border border-amber-400/20">
        <p className="text-amber-400 text-[10px] font-semibold uppercase tracking-wide">Today&apos;s Gold Rate</p>
        <p className="text-amber-300 text-sm font-bold font-mono mt-0.5">₹6,850 / gram</p>
        <p className="text-amber-400/60 text-[10px]">22K • Last updated 2h ago</p>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group min-h-[44px]",
                isActive
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon
                className={cn("w-4 h-4 shrink-0", isActive ? "text-amber-400" : "text-slate-500 group-hover:text-slate-300")}
                strokeWidth={2}
              />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-slate-800">
        <div className="flex items-center gap-3 px-3 py-2.5">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
            OM
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">Owner</p>
            <p className="text-slate-500 text-[10px] truncate">Main Branch</p>
          </div>
          <Link
            href="/logout"
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-500 hover:text-white transition-colors"
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </aside>
  )
}

export function MobileNav() {
  const pathname = usePathname()
  const mobileItems = navItems.slice(0, 5)

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex z-40 md:hidden">
      {mobileItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex-1 flex flex-col items-center gap-1 py-2 min-h-[56px] justify-center transition-colors",
              isActive ? "text-[#0F172A]" : "text-slate-400"
            )}
          >
            <item.icon className={cn("w-5 h-5", isActive ? "text-[#0F172A]" : "text-slate-400")} strokeWidth={2} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
