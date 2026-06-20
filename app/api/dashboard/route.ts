import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth"

export async function GET() {
  try {
    const user = await getAuthUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const branchFilter = user.role === "OWNER" ? {} : { branchId: { in: user.branchIds } }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [activeLoans, overdueLoans, todayPayments, closuresToday, totalCustomers] = await Promise.all([
      prisma.loan.count({ where: { ...branchFilter, status: "ACTIVE" } }),
      prisma.loan.count({ where: { ...branchFilter, status: "OVERDUE" } }),
      prisma.payment.findMany({
        where: {
          paymentDate: { gte: today },
          loan: branchFilter,
        },
        select: { amount: true, interestPaid: true },
      }),
      prisma.loan.count({ where: { ...branchFilter, status: "CLOSED", updatedAt: { gte: today } } }),
      prisma.customer.count({ where: branchFilter }),
    ])

    const portfolioSums = await prisma.loan.aggregate({
      where: { ...branchFilter, status: { in: ["ACTIVE", "OVERDUE", "RENEWED"] } },
      _sum: { outstandingPrincipal: true, accruedInterest: true },
    })

    const dailyCollections = todayPayments.reduce((sum, p) => sum + parseFloat(p.amount.toString()), 0)
    const interestIncome = todayPayments.reduce((sum, p) => sum + parseFloat(p.interestPaid.toString()), 0)

    return NextResponse.json({
      activeLoans,
      overdueLoans,
      closuresToday,
      totalCustomers,
      dailyCollections,
      interestIncome,
      outstandingPrincipal: parseFloat(portfolioSums._sum.outstandingPrincipal?.toString() || "0"),
      accruedInterest: parseFloat(portfolioSums._sum.accruedInterest?.toString() || "0"),
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
