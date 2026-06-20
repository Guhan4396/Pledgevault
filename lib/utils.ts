import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num)
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d)
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d)
}

export function formatWeight(grams: number | string): string {
  const num = typeof grams === "string" ? parseFloat(grams) : grams
  return `${num.toFixed(3)}g`
}

export function calculateDaysAgo(date: Date | string): number {
  const d = typeof date === "string" ? new Date(date) : date
  const now = new Date()
  return Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24))
}

export function calculateDaysUntil(date: Date | string): number {
  const d = typeof date === "string" ? new Date(date) : date
  const now = new Date()
  return Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

export function timeAgo(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  const seconds = Math.floor((new Date().getTime() - d.getTime()) / 1000)
  if (seconds < 60) return "just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export function getLoanStatusColor(status: string): string {
  switch (status) {
    case "ACTIVE": return "fresh"
    case "OVERDUE": return "danger"
    case "AUCTION_NOTICE_SENT": return "warning"
    case "AUCTIONED": return "danger"
    case "RENEWED": return "aging"
    case "CLOSED": return "stale"
    default: return "default"
  }
}

export function calculateInterest(
  principal: number,
  ratePerMonth: number,
  fromDate: Date,
  toDate: Date
): number {
  const months = (toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
  return principal * (ratePerMonth / 100) * months
}

export function generateBillNumber(prefix: string, sequence: number): string {
  return `${prefix}${String(sequence).padStart(6, "0")}`
}
