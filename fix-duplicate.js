const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function fixDuplicate() {
  try {
    // Find all inventory entries for the batch
    const inventory = await prisma.finishedInventory.findMany({
      where: {
        batchId: "30dfb749-94db-46b4-a0cb-6de4aa345a42"
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    console.log(`Found ${inventory.length} inventory entries`)

    if (inventory.length > 1) {
      // Keep the first one, delete the rest
      for (let i = 1; i < inventory.length; i++) {
        await prisma.finishedInventory.delete({
          where: { id: inventory[i].id }
        })
        console.log(`Deleted duplicate entry ${i}`)
      }
      console.log('✅ Duplicate entries removed!')
    } else {
      console.log('No duplicates found')
    }

    // Verify final count
    const final = await prisma.finishedInventory.count()
    console.log(`Final inventory count: ${final}`)

  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

fixDuplicate()
