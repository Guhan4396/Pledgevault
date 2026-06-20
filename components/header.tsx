"use client"

import { Bell, Search, Menu } from "lucide-react"
import { useState } from "react"

interface HeaderProps {
  title?: string
  subtitle?: string
  onMenuClick?: () => void
}

export function Header({ title = "Dashboard", subtitle, onMenuClick }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 md:px-6 py-3 flex items-center gap-4">
      <button
        onClick={onMenuClick}
        className="md:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600 min-h-[44px] min-w-[44px] flex items-center justify-center"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex-1">
        <h1 className="text-base font-bold text-[#0F172A] leading-tight">{title}</h1>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setSearchOpen(!searchOpen)}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Search"
        >
          <Search className="w-4 h-4" />
        </button>
        <button
          className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
        </button>
      </div>
    </header>
  )
}
