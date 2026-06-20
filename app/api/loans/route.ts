import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser, canAccessBranch } from "@/lib/auth"
import { generateBillNumber } from "@/lib/utils"

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const branchId = searchParams.get("branchId") || ""
    const status = searchParams.get("status") || ""

    const where: Record<string, unknown> = {}

    if (branchId) {
      if (!canAccessBranch(user, branchId)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }
      where.branchId = branchId
    } else if (user.role !== "OWNER") {
      where.branchId = { in: user.branchIds }
    }

    if (status) where.status = status

    const loans = await prisma.loan.findMany({
      where,
      include: {
        customer: { select: { id: true, name: true, phone: true } },
        branch: { select: { id: true, name: true } },
        ornaments: true,
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    })

    return NextResponse.json(loans)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const {
      customerId,
      branchId,
      ornaments = [],
      principalAmount,
      interestRate,
      ltvPercent = 75,
      loanDays = 180,
      netWeight,
      goldRatePerGram,
      notes,
    } = body

    if (!customerId || !branchId || !principalAmount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!canAccessBranch(user, branchId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const branch = await prisma.branch.update({
      where: { id: branchId },
      data: { billSequence: { increment: 1 } },
    })

    const billNumber = generateBillNumber(branch.billPrefix, branch.billSequence)

    const loanDate = new Date()
    const maturityDate = new Date(loanDate)
    maturityDate.setDate(maturityDate.getDate() + loanDays)
    const gracePeriodEnd = new Date(maturityDate)
    gracePeriodEnd.setDate(gracePeriodEnd.getDate() + 7)

    const grossWeight = ornaments.reduce((s: number, o: { grossWeight: string | number }) => s + parseFloat(String(o.grossWeight || 0)), 0)
    const stoneWeight = ornaments.reduce((s: number, o: { stoneWeight: string | number }) => s + parseFloat(String(o.stoneWeight || 0)), 0)
    const goldValue = netWeight * goldRatePerGram

    const loan = await prisma.loan.create({
      data: {
        billNumber,
        customerId,
        branchId,
        grossWeight,
        stoneWeight,
        netWeight,
        goldValue,
        ltvPercent,
        principalAmount,
        interestRate: interestRate || 2,
        outstandingPrincipal: principalAmount,
        goldRateSnapshot: goldRatePerGram,
        loanDate,
        maturityDate,
        gracePeriodEnd,
        notes,
        ornaments: {
          create: ornaments.map((o: { description: string; grossWeight: string; stoneWeight: string; netWeight: string; purity: string }) => ({
            description: o.description,
            grossWeight: parseFloat(o.grossWeight || "0"),
            stoneWeight: parseFloat(o.stoneWeight || "0"),
            netWeight: parseFloat(o.netWeight || "0"),
            purity: o.purity || "22K",
            tagNumber: billNumber,
          })),
        },
      },
      include: {
        customer: true,
        ornaments: true,
      },
    })

    return NextResponse.json(loan, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
