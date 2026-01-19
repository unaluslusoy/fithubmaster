import { PrismaClient, AdminRole, AccountStatus } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
})

async function main() {
  const email = "unaluslusoy@todestek.net"
  // Development: Use a real hash for local login testing without Firebase
  const passwordText = "Unal.123"
  const passwordHash = await hash(passwordText, 12)

  console.log(`Checking for existing admin: ${email}...`)

  const existingAdmin = await prisma.admin.findUnique({
    where: { email },
  })

  if (existingAdmin) {
    console.log("Super Admin already exists. Updating password for local dev...")
    await prisma.admin.update({
      where: { email },
      data: { passwordHash }
    })
    console.log("Password updated to 'Unal.123'")
    return
  }

  console.log("Creating Super Admin...")

  const admin = await prisma.admin.create({
    data: {
      email,
      firstName: "Super",
      lastName: "Admin",
      passwordHash,
      role: AdminRole.SUPER_ADMIN, // Correct enum access
      status: AccountStatus.ACTIVE, // Correct enum access
    },
  })

  console.log(`Super Admin created with ID: ${admin.id}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
