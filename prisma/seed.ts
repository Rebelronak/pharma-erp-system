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
  const qaPassword = await hashPassword('QA@123')
  const qaInspector = await prisma.user.upsert({
    where: { email: 'qa@pharmaerp.com' },
    update: {},
    create: {
      email: 'qa@pharmaerp.com',
      password: qaPassword,
      name: 'QA Inspector',
      role: 'QA_QC_INSPECTOR',
      isActive: true,
    },
  })
  console.log('Created QA user:', qaInspector.email)

  // Create doctor user
  const doctorPassword = await hashPassword('Doctor@123')
  const doctorUser = await prisma.user.upsert({
    where: { email: 'doctor@pharmaerp.com' },
    update: {},
    create: {
      email: 'doctor@pharmaerp.com',
      password: doctorPassword,
      name: 'Dr. Sarah Johnson',
      role: 'DOCTOR',
      isActive: true,
    },
  })
  console.log('Created doctor user:', doctorUser.email)

  // Create doctor profile
  const doctor = await prisma.doctor.upsert({
    where: { userId: doctorUser.id },
    update: {},
    create: {
      userId: doctorUser.id,
      licenseNumber: 'MD-2026-001',
      specialization: 'General Surgery',
      phone: '+1234567890',
      department: 'Surgery',
      hospitalName: 'City General Hospital',
      isActive: true,
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
      taxId: 'TAX123456',
      paymentTerms: 'Net 30',
      isActive: true,
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
      unitOfMeasure: 'kg',
      reorderLevel: 100,
      standardCost: 50.00,
      isActive: true,
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
      unitOfMeasure: 'units',
      reorderLevel: 1000,
      standardCost: 0.50,
      isActive: true,
    },
  })
  console.log('Created finished product:', paracetamolTablet.name)

  // Create sample patient
  const patient = await prisma.patient.upsert({
    where: { patientNumber: 'PT-SAMPLE01' },
    update: {},
    create: {
      patientNumber: 'PT-SAMPLE01',
      name: 'Jane Doe',
      dateOfBirth: new Date('1990-05-15'),
      gender: 'Female',
      phone: '+1122334455',
      email: 'jane.doe@example.com',
      address: '456 Patient Street, Medical City',
      bloodGroup: 'O+',
      allergies: 'None known',
      medicalHistory: 'Generally healthy',
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
