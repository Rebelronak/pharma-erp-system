import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

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
    },
  })
  console.log('✅ Created admin user:', admin.email)

  // Create QA inspector
  const qaPassword = await bcrypt.hash('QA@123', 10)
  const qaInspector = await prisma.user.upsert({
    where: { email: 'qa@pharmaerp.com' },
    update: {},
    create: {
      email: 'qa@pharmaerp.com',
      password: qaPassword,
      name: 'QA Inspector',
      role: 'QA_QC_INSPECTOR',
      active: true,
    },
  })
  console.log('Created QA user:', qaInspector.email)

  // Create doctor user
  const doctorPassword = await bcrypt.hash('Doctor@123', 10)
  const doctorUser = await prisma.user.upsert({
    where: { email: 'doctor@pharmaerp.com' },
    update: {},
    create: {
      email: 'doctor@pharmaerp.com',
      password: doctorPassword,
      name: 'Dr. Sarah Johnson',
      role: 'DOCTOR',
      active: true,
    },
  })
  console.log('Created doctor user:', doctorUser.email)

  // Create doctor profile
  const doctor = await prisma.doctor.upsert({
    where: { code: 'DOC-001' },
    update: {},
    create: {
      code: 'DOC-001',
      name: 'Dr. Sarah Johnson',
      specialization: 'General Surgery',
      phone: '+1234567890',
      email: 'doctor@pharmaerp.com',
      active: true,
    },
  })
  console.log('Created doctor profile')

  // Create supplier
  const supplier = await prisma.supplier.upsert({
    where: { code: 'SUP-001' },
    update: {},
    create: {
      code: 'SUP-001',
      name: 'PharmaChem Supplies Ltd',
      contactPerson: 'John Smith',
      email: 'sales@pharmachem.com',
      phone: '+1987654321',
      address: '123 Industrial Park, Medical City',
      active: true,
    },
  })
  console.log('Created supplier:', supplier.name)

  // Create materials
  const paracetamol = await prisma.material.upsert({
    where: { code: 'MAT-001' },
    update: {},
    create: {
      code: 'MAT-001',
      name: 'Paracetamol API',
      type: 'RAW',
      description: 'Active Pharmaceutical Ingredient - Paracetamol',
      unit: 'kg',
      reorderLevel: 100,
      active: true,
    },
  })
  console.log('Created material:', paracetamol.name)

  const paracetamolTablet = await prisma.material.upsert({
    where: { code: 'FIN-001' },
    update: {},
    create: {
      code: 'FIN-001',
      name: 'Paracetamol 500mg Tablets',
      type: 'FINISHED',
      description: 'Finished product - Paracetamol tablets 500mg',
      unit: 'pieces',
      reorderLevel: 1000,
      active: true,
    },
  })
  console.log('Created finished product:', paracetamolTablet.name)

  // Create sample patient
  const patient = await prisma.patient.upsert({
    where: { code: 'PAT-001' },
    update: {},
    create: {
      code: 'PAT-001',
      name: 'Jane Doe',
      age: 35,
      gender: 'FEMALE',
      phone: '+1122334455',
      address: '456 Patient Street, Medical City',
      active: true,
    },
  })
  console.log('Created sample patient:', patient.name)

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
