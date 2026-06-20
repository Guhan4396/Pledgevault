import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  const mainBranch = await prisma.branch.upsert({
    where: { id: "main-branch" },
    update: {},
    create: {
      id: "main-branch",
      name: "Main Branch - Chennai",
      address: "15, Anna Salai, Chennai - 600002",
      phone: "044-28540001",
      billPrefix: "GL",
      billSequence: 0,
    },
  })

  await prisma.branchSettings.upsert({
    where: { branchId: mainBranch.id },
    update: {},
    create: {
      branchId: mainBranch.id,
      businessName: "Sri Lakshmi Gold Loans",
      defaultInterestRate: 2,
      defaultLtvPercent: 75,
      defaultGraceDays: 7,
      defaultLoanDays: 180,
    },
  })

  const hashedPassword = await bcrypt.hash("admin123", 12)
  const owner = await prisma.user.upsert({
    where: { email: "owner@pledgevault.com" },
    update: {},
    create: {
      email: "owner@pledgevault.com",
      name: "Owner",
      password: hashedPassword,
      role: "OWNER",
    },
  })

  await prisma.userBranch.upsert({
    where: { userId_branchId: { userId: owner.id, branchId: mainBranch.id } },
    update: {},
    create: { userId: owner.id, branchId: mainBranch.id },
  })

  const loanOfficerPwd = await bcrypt.hash("officer123", 12)
  const officer = await prisma.user.upsert({
    where: { email: "officer@pledgevault.com" },
    update: {},
    create: {
      email: "officer@pledgevault.com",
      name: "Loan Officer",
      password: loanOfficerPwd,
      role: "LOAN_OFFICER",
    },
  })

  await prisma.userBranch.upsert({
    where: { userId_branchId: { userId: officer.id, branchId: mainBranch.id } },
    update: {},
    create: { userId: officer.id, branchId: mainBranch.id },
  })

  await prisma.goldRate.create({
    data: {
      branchId: mainBranch.id,
      ratePerGram: 6850,
      purity: "22K",
      setBy: owner.id,
    },
  })

  console.log("✅ Seed complete!")
  console.log("   Owner: owner@pledgevault.com / admin123")
  console.log("   Officer: officer@pledgevault.com / officer123")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
