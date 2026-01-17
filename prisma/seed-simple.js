const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create Users
  console.log('Creating users...')
  const adminPassword = await bcrypt.hash('Admin@123', 10)
  
  const admin = await prisma.user.create({
    data: {
      email: 'admin@pharmaerp.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
      active: true,
    },
  })
  console.log('✅ Admin user created')

  // Create Suppliers
  console.log('Creating suppliers...')
  const supplier1 = await prisma.supplier.create({
    data: {
      code: 'SUP001',
      name: 'MedChem Supplies Inc',
      contactPerson: 'John Doe',
      phone: '+1-555-0101',
      email: 'contact@medchem.com',
      address: '123 Industrial Ave, Boston, MA',
      active: true,
    },
  })
  console.log('✅ Suppliers created')

  // Create Materials
  console.log('Creating materials...')
  const rawMaterial = await prisma.material.create({
    data: {
      code: 'RAW001',
      name: 'Acetaminophen API',
      type: 'RAW',
      unit: 'kg',
      reorderLevel: 100,
      description: 'Active Pharmaceutical Ingredient',
      active: true,
    },
  })

  const finishedProduct = await prisma.material.create({
    data: {
      code: 'FIN001',
      name: 'Paracetamol Tablet 500mg',
      type: 'FINISHED',
      unit: 'tablets',
      reorderLevel: 10000,
      description: 'Pain reliever',
      active: true,
    },
  })
  console.log('✅ Materials created')

  // Create Raw Inventory
  console.log('Creating raw inventory...')
  await prisma.rawInventory.create({
    data: {
      materialId: rawMaterial.id,
      quantity: 500,
      lotNumber: 'LOT-ACE-2026-001',
      expiryDate: new Date('2027-12-31'),
      purchasePrice: 45.50,
      supplierId: supplier1.id,
    },
  })
  console.log('✅ Raw inventory created')

  // Create Batch
  console.log('Creating batches...')
  const batch = await prisma.batch.create({
    data: {
      batchNumber: 'BATCH-2026-001',
      productId: finishedProduct.id,
      plannedQuantity: 50000,
      actualQuantity: 49800,
      status: 'COMPLETED',
      startDate: new Date('2026-01-10'),
      completionDate: new Date('2026-01-14'),
      notes: 'First production batch',
    },
  })
  console.log('✅ Batches created')

  // Create QA Approval
  console.log('Creating QA approval...')
  await prisma.qAApproval.create({
    data: {
      batchId: batch.id,
      status: 'APPROVED',
      inspectorId: admin.id,
      inspectionDate: new Date('2026-01-14'),
      approvalDate: new Date('2026-01-14'),
      remarks: 'All quality parameters within limits',
    },
  })
  console.log('✅ QA Approval created')

  // Create Finished Inventory
  console.log('Creating finished inventory...')
  await prisma.finishedInventory.create({
    data: {
      materialId: finishedProduct.id,
      batchId: batch.id,
      quantity: 49800,
      lotNumber: 'LOT-FIN-2026-001',
      expiryDate: new Date('2028-01-31'),
      approvedDate: new Date('2026-01-14'),
      available: true,
    },
  })
  console.log('✅ Finished inventory created')

  // Create Doctor
  console.log('Creating doctors...')
  await prisma.doctor.create({
    data: {
      code: 'DOC001',
      name: 'Dr. John Smith',
      specialization: 'Cardiology',
      phone: '+1-555-1001',
      email: 'dr.smith@hospital.com',
      licenseNumber: 'MED-12345',
      active: true,
    },
  })
  console.log('✅ Doctors created')

  // Create Patient
  console.log('Creating patients...')
  await prisma.patient.create({
    data: {
      code: 'PAT001',
      name: 'Michael Brown',
      age: 45,
      gender: 'Male',
      phone: '+1-555-2001',
      email: 'michael.b@email.com',
      address: '789 Oak Street, Boston, MA',
      active: true,
    },
  })
  console.log('✅ Patients created')

  console.log('🎉 Database seeded successfully!')
  console.log('\n📝 Login credentials:')
  console.log('  Email: admin@pharmaerp.com')
  console.log('  Password: Admin@123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
