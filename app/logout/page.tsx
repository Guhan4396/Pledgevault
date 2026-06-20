"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    fetch("/api/auth/logout", { method: "POST" }).finally(() => {
      router.push("/login")
    })
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <p className="text-slate-500">Signing out…</p>
    </div>
  )
}
