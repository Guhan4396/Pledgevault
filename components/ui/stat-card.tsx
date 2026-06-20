import { cn } from "@/lib/utils"
import { Card, CardContent } from "./card"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  iconColor?: string
  trend?: { value: number; label: string }
  className?: string
  dark?: boolean
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = "text-slate-600",
  trend,
  className,
  dark,
}: StatCardProps) {
  if (dark) {
    return (
      <div className={cn("card-dark p-5 flex flex-col gap-3", className)}>
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-400">{title}</p>
          <div className="p-2 rounded-lg bg-white/10">
            <Icon className="w-4 h-4 text-white" strokeWidth={2} />
          </div>
        </div>
        <div>
          <p className="text-2xl font-bold font-mono text-white">{value}</p>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        {trend && (
          <div className="flex items-center gap-1">
            <span className={cn("text-xs font-medium", trend.value >= 0 ? "text-emerald-400" : "text-red-400")}>
              {trend.value >= 0 ? "+" : ""}{trend.value}%
            </span>
            <span className="text-xs text-slate-500">{trend.label}</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <Card className={cn("p-5 flex flex-col gap-3 hover:shadow-[var(--shadow-card-hover)] transition-shadow", className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{title}</p>
        <div className="p-2 rounded-lg bg-slate-100">
          <Icon className={cn("w-4 h-4", iconColor)} strokeWidth={2} />
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold font-mono text-[#0F172A]">{value}</p>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      {trend && (
        <div className="flex items-center gap-1">
          <span className={cn("text-xs font-medium", trend.value >= 0 ? "text-emerald-600" : "text-red-600")}>
            {trend.value >= 0 ? "+" : ""}{trend.value}%
          </span>
          <span className="text-xs text-slate-400">{trend.label}</span>
        </div>
      )}
    </Card>
  )
}
