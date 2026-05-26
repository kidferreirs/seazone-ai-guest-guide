import { PrismaClient, Prisma } from "@prisma/client"

import { properties } from "../src/data/properties"

const prisma = new PrismaClient()

async function main() {
  for (const property of properties) {
    const propertyJson = property as unknown as Prisma.InputJsonValue

    await prisma.property.upsert({
      where: {
        code: property.code,
      },

      update: {
        data: propertyJson,
      },

      create: {
        code: property.code,
        data: propertyJson,
      },
    })
  }

  console.log("Seed completed")
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })