import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const branchId = searchParams.get("branchId")

    const rate = await prisma.goldRate.findFirst({
      where: branchId ? { branchId } : undefined,
      orderBy: { effectiveDate: "desc" },
    })

    return NextResponse.json(rate || { ratePerGram: 6850, purity: "22K" })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    if (!["OWNER", "BRANCH_MANAGER"].includes(user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { branchId, ratePerGram, purity = "22K" } = await req.json()
    if (!branchId || !ratePerGram) {
      return NextResponse.json({ error: "branchId and ratePerGram are required" }, { status: 400 })
    }

    const rate = await prisma.goldRate.create({
      data: { branchId, ratePerGram, purity, setBy: user.userId },
    })

    return NextResponse.json(rate, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
