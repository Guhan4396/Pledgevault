import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser, canAccessBranch } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search") || ""
    const branchId = searchParams.get("branchId") || ""

    const where: Record<string, unknown> = {}

    if (branchId) {
      if (!canAccessBranch(user, branchId)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }
      where.branchId = branchId
    } else if (user.role !== "OWNER") {
      where.branchId = { in: user.branchIds }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { phone: { contains: search } },
      ]
    }

    const customers = await prisma.customer.findMany({
      where,
      include: {
        loans: {
          where: { status: { in: ["ACTIVE", "OVERDUE", "RENEWED"] } },
          select: { id: true, status: true, principalAmount: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    })

    return NextResponse.json(customers)
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
    const { name, phone, email, aadhaar, pan, address, branchId } = body

    if (!name || !phone || !branchId) {
      return NextResponse.json({ error: "Name, phone and branchId are required" }, { status: 400 })
    }

    if (!canAccessBranch(user, branchId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const existing = await prisma.customer.findUnique({
      where: { phone_branchId: { phone, branchId } },
    })
    if (existing) {
      return NextResponse.json({ error: "A customer with this phone number already exists" }, { status: 409 })
    }

    const customer = await prisma.customer.create({
      data: { name, phone, email, aadhaar, pan, address, branchId },
    })

    return NextResponse.json(customer, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
