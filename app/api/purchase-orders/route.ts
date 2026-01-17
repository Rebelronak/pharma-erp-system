import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generatePONumber } from '@/lib/utils'

// GET all purchase orders
export async function GET() {
  try {
    const purchaseOrders = await prisma.purchaseOrder.findMany({
      include: {
        supplier: true,
        createdBy: {
          select: { id: true, name: true, email: true }
        },
        items: {
          include: {
            material: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(purchaseOrders)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch purchase orders' }, { status: 500 })
  }
}

// POST create purchase order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const orderNumber = 'PO-' + Date.now()

    const purchaseOrder = await prisma.purchaseOrder.create({
      data: {
        orderNumber,
        supplierId: body.supplierId,
        orderDate: body.orderDate ? new Date(body.orderDate) : new Date(),
        expectedDate: body.expectedDelivery ? new Date(body.expectedDelivery) : null,
        status: 'PENDING',
        totalAmount: body.totalAmount,
        createdById: body.userId,
        notes: body.notes || null,
      },
      include: {
        supplier: true,
        createdBy: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: body.userId,
        action: 'CREATE',
        entity: 'PurchaseOrder',
        entityId: purchaseOrder.id,
      }
    })

    return NextResponse.json(purchaseOrder, { status: 201 })
  } catch (error) {
    console.error('Purchase order creation error:', error)
    return NextResponse.json({ error: 'Failed to create purchase order' }, { status: 500 })
  }
}
