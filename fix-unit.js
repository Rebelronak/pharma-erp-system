const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function fixUnit() {
  try {
    const material = await prisma.material.update({
      where: { code: 'MAT-001' },
      data: { unit: 'pieces' }
    })
    console.log('✅ Updated MAT-001 unit from "kg" to "pieces"')
    console.log('Material:', material.name)
    console.log('New unit:', material.unit)
  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

fixUnit()
