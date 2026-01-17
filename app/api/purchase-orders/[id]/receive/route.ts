import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Receive purchase order and add to raw inventory
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()

    const purchaseOrder = await prisma.purchaseOrder.findUnique({
      where: { id },
      include: {
        items: true,
        supplier: true
      }
    })

    if (!purchaseOrder) {
      return NextResponse.json({ error: 'Purchase order not found' }, { status: 404 })
    }

    if (purchaseOrder.status === 'RECEIVED' || purchaseOrder.status === 'COMPLETED') {
      return NextResponse.json(
        { error: 'Purchase order already received' },
        { status: 400 }
      )
    }

    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      // Add items to raw inventory
      for (const item of purchaseOrder.items) {
        await tx.rawInventory.create({
          data: {
            materialId: item.materialId,
            quantity: item.quantity,
            supplierId: purchaseOrder.supplierId,
            purchaseDate: new Date(),
            purchasePrice: item.unitPrice,
            batchNumber: body.batchNumbers?.[item.id],
            lotNumber: body.lotNumbers?.[item.id],
            expiryDate: body.expiryDates?.[item.id] 
              ? new Date(body.expiryDates[item.id]) 
              : null,
          }
        })

        // Update received quantity
        await tx.purchaseOrderItem.update({
          where: { id: item.id },
          data: {
            receivedQty: item.quantity
          }
        })
      }

      // Update purchase order status
      const updatedPO = await tx.purchaseOrder.update({
        where: { id },
        data: {
          status: 'RECEIVED',
          receivedDate: new Date(),
        }
      })

      return updatedPO
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'RECEIVE_PURCHASE_ORDER',
        entity: 'PurchaseOrder',
        entityId: id,
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Purchase order receive error:', error)
    return NextResponse.json({ error: 'Failed to receive purchase order' }, { status: 500 })
  }
}
