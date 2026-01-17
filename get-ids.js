const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function getIds() {
  const user = await prisma.user.findFirst()
  const supplier = await prisma.supplier.findFirst()
  
  console.log('\n=== USE THESE IDS ===')
  console.log('User ID:', user.id)
  console.log('Supplier ID:', supplier.id)
  console.log('=====================\n')
  
  await prisma.$disconnect()
}

getIds()
