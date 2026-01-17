const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkInventory() {
  try {
    console.log('=== FINISHED GOODS INVENTORY ===')
    const inventory = await prisma.finishedInventory.findMany({
      include: {
        material: { select: { code: true, name: true } },
        batch: { select: { batchNumber: true, status: true } }
      }
    })
    console.log(JSON.stringify(inventory, null, 2))

    console.log('\n=== YOUR BATCHES ===')
    const batches = await prisma.batch.findMany()
    console.log(JSON.stringify(batches, null, 2))

    console.log('\n=== YOUR MATERIALS ===')
    const materials = await prisma.material.findMany()
    console.log(JSON.stringify(materials, null, 2))

  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

checkInventory()
