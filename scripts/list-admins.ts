
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const admins = await prisma.admin.findMany()
  console.log("Mevcut Adminler:")
  admins.forEach(a => {
    console.log(`- ${a.firstName} ${a.lastName} (${a.email}) ID: ${a.id}`)
  })
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
