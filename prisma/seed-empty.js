const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('Creating admin user...')

  // Create one admin user for system access
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@pharmaerp.com' },
    update: {},
    create: {
      email: 'admin@pharmaerp.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
      active: true,
    },
  })

  console.log('✅ Admin user created')
  console.log('📧 Email: admin@pharmaerp.com')
  console.log('🔑 Password: admin123')
  console.log('\n✨ Database is ready with zero data - all counts will start from 0!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
