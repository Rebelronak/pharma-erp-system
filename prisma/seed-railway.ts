import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Create admin user
  const adminPassword = await bcrypt.hash('Admin@123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@pharmaerp.com' },
    update: {},
    create: {
      email: 'admin@pharmaerp.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
      active: true,
    }
  })
  console.log('Admin user created:', admin.email)

  // Create default supplier
  const supplier = await prisma.supplier.upsert({
    where: { code: 'SUP-001' },
    update: {},
    create: {
      code: 'SUP-001',
      name: 'Default Supplier',
      contactPerson: 'John Doe',
      phone: '123-456-7890',
      email: 'supplier@example.com',
      address: '123 Supply Street',
      active: true,
    }
  })
  console.log('Supplier created:', supplier.name)

  // Create sample materials
  const paracetamolFinished = await prisma.material.upsert({
    where: { code: 'MAT-001' },
    update: {},
    create: {
      code: 'MAT-001',
      name: 'Paracetamol 500mg',
      type: 'FINISHED',
      unit: 'pieces',
      reorderLevel: 100,
      active: true,
    }
  })
  console.log('Material created:', paracetamolFinished.name)

  const paracetamolRaw = await prisma.material.upsert({
    where: { code: 'MAT-002' },
    update: {},
    create: {
      code: 'MAT-002',
      name: 'Paracetamol Powder',
      type: 'RAW',
      unit: 'kg',
      reorderLevel: 100,
      active: true,
    }
  })
  console.log('Material created:', paracetamolRaw.name)

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
