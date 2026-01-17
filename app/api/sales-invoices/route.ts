import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateInvoiceNumber } from '@/lib/utils'

// GET all sales invoices
export async function GET() {
  try {
    const salesInvoices = await prisma.salesInvoice.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(salesInvoices)
  } catch (error) {
    console.error('Error fetching sales invoices:', error)
    return NextResponse.json({ error: 'Failed to fetch sales invoices' }, { status: 500 })
  }
}

// POST create sales invoice
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const invoiceNumber = 'INV-' + Date.now()

    const salesInvoice = await prisma.salesInvoice.create({
      data: {
        invoiceNumber,
        customerName: body.customerName,
        customerContact: body.phone || null,
        invoiceDate: body.invoiceDate ? new Date(body.invoiceDate) : new Date(),
        totalAmount: body.totalAmount,
        status: 'PAID',
        notes: body.notes || null,
        createdById: body.userId,
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    return NextResponse.json(salesInvoice, { status: 201 })
  } catch (error) {
    console.error('Sales invoice creation error:', error)
    return NextResponse.json({ error: 'Failed to create sales invoice' }, { status: 500 })
  }
}
