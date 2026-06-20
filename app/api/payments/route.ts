import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const { loanId, amount, notes } = body

    if (!loanId || !amount) {
      return NextResponse.json({ error: "Loan ID and amount are required" }, { status: 400 })
    }

    const loan = await prisma.loan.findUnique({ where: { id: loanId } })
    if (!loan) return NextResponse.json({ error: "Loan not found" }, { status: 404 })
    if (loan.status === "CLOSED") return NextResponse.json({ error: "Loan is already closed" }, { status: 400 })

    const payAmount = parseFloat(amount)
    const interestDue = parseFloat(loan.accruedInterest.toString())
    const principalDue = parseFloat(loan.outstandingPrincipal.toString())

    // Allocation: interest first, then principal
    let interestPaid = 0
    let principalPaid = 0
    let remaining = payAmount

    if (remaining >= interestDue) {
      interestPaid = interestDue
      remaining -= interestDue
    } else {
      interestPaid = remaining
      remaining = 0
    }

    if (remaining > 0) {
      principalPaid = Math.min(remaining, principalDue)
    }

    const newAccruedInterest = interestDue - interestPaid
    const newOutstandingPrincipal = principalDue - principalPaid
    const isClosed = newOutstandingPrincipal <= 0

    const receiptNumber = `RCP${Date.now()}`

    const [payment] = await prisma.$transaction([
      prisma.payment.create({
        data: {
          loanId,
          amount: payAmount,
          interestPaid,
          principalPaid,
          paymentType: isClosed ? "FULL" : principalPaid > 0 ? "PARTIAL" : "INTEREST",
          receiptNumber,
          notes,
        },
      }),
      prisma.loan.update({
        where: { id: loanId },
        data: {
          accruedInterest: newAccruedInterest,
          outstandingPrincipal: newOutstandingPrincipal,
          totalPaid: { increment: payAmount },
          status: isClosed ? "CLOSED" : loan.status,
        },
      }),
    ])

    return NextResponse.json({ payment, receiptNumber, isClosed }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
