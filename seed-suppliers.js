const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function seedSuppliers() {
  try {
    // Check existing
    const existingSupplier = await prisma.supplier.findFirst()
    const existingUser = await prisma.user.findFirst()
    
    console.log('Existing suppliers:', await prisma.supplier.count())
    console.log('Existing users:', await prisma.user.count())

    if (!existingSupplier) {
      // Create a default supplier
      const supplier = await prisma.supplier.create({
        data: {
          code: 'SUP-001',
          name: 'Default Supplier',
          contactPerson: 'John Doe',
          phone: '1234567890',
          email: 'supplier@example.com',
          address: '123 Supply Street',
        }
      })
      console.log('✅ Created supplier:', supplier.code)
    } else {
      console.log('✅ Supplier already exists:', existingSupplier.code)
    }

    if (!existingUser) {
      // Create admin user
      const user = await prisma.user.create({
        data: {
          email: 'admin@pharma.com',
          password: 'admin123',
          name: 'Admin User',
          role: 'ADMIN',
        }
      })
      console.log('✅ Created user:', user.email)
    } else {
      console.log('✅ User already exists:', existingUser.email)
    }

    console.log('\n📊 Database ready!')
    console.log('Suppliers:', await prisma.supplier.count())
    console.log('Users:', await prisma.user.count())

  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

seedSuppliers()
