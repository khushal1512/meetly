import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Check if we already have desks
  const deskCount = await prisma.desk.count()
  
  if (deskCount === 0) {
    console.log('Seeding 10 desks...')
    const desks = Array.from({ length: 10 }).map((_, i) => ({
      name: `Desk ${i + 1}`,
    }))

    await prisma.desk.createMany({
      data: desks,
    })
    console.log('Seeded 10 desks successfully.')
  } else {
    console.log('Desks already exist. Skipping seed.')
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
