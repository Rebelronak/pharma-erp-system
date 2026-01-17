const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function addInventory() {
  try {
    const batch = await prisma.batch.findFirst({
      where: { status: 'QA_APPROVED' }
    })

    if (batch) {
      // Create expiry date 2 years from now
      const expiryDate = new Date()
      expiryDate.setFullYear(expiryDate.getFullYear() + 2)
      
      const inventory = await prisma.finishedInventory.create({
        data: {
          materialId: batch.productId,
          batchId: batch.id,
          quantity: batch.plannedQuantity,
          lotNumber: batch.batchNumber,
          expiryDate: expiryDate
        }
      })
      console.log('✅ Finished goods inventory created!')
      console.log('Material ID:', inventory.materialId)
      console.log('Quantity:', inventory.quantity, 'units')
    } else {
      console.log('No QA approved batch found')
    }
  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

addInventory()
