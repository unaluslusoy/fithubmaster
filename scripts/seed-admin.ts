import { PrismaClient, AdminRole, AccountStatus } from "@prisma/client"

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
})

async function main() {
  const email = "unaluslusoy@todestek.net"
  // Note: Password 'Unal.123' will be managed by Auth Provider (Firebase) in production.
  // Here we just seed the DB record.
  const passwordHash = "firebase_managed_placeholder" 

  console.log(`Checking for existing admin: ${email}...`)

  const existingAdmin = await prisma.admin.findUnique({
    where: { email },
  })

  if (existingAdmin) {
    console.log("Super Admin already exists.")
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
