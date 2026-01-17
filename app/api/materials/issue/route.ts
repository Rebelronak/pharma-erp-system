import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Issue materials from Raw Inventory to Process Inventory
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { batchId, materialId, quantity, issuedById } = body

    // Check if batch exists and is in correct status
    const batch = await prisma.batch.findUnique({
      where: { id: batchId }
    })

    if (!batch || batch.status === 'COMPLETED' || batch.status === 'CANCELLED') {
      return NextResponse.json(
        { error: 'Invalid batch or batch is not active' },
        { status: 400 }
      )
    }

    // Check raw inventory availability
    const rawInventory = await prisma.rawInventory.findFirst({
      where: { 
        materialId,
        quantity: { gte: quantity }
      }
    })

    if (!rawInventory) {
      return NextResponse.json(
        { error: 'Insufficient raw inventory' },
        { status: 400 }
      )
    }

    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      // Deduct from raw inventory
      await tx.rawInventory.update({
        where: { id: rawInventory.id },
        data: {
          quantity: { decrement: quantity }
        }
      })

      // Add to process inventory
      const processInventory = await tx.processInventory.create({
        data: {
          materialId,
          batchId,
          quantity,
        }
      })

      // Create material issue record
      const materialIssue = await tx.materialIssue.create({
        data: {
          batchId,
          materialId,
          quantity,
          issuedById,
          issuedDate: new Date(),
        }
      })

      // Update batch material actual quantity
      await tx.batchMaterial.updateMany({
        where: {
          batchId,
          materialId,
        },
        data: {
          actualQuantity: { increment: quantity },
          issuedAt: new Date(),
        }
      })

      return { processInventory, materialIssue }
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: issuedById,
        action: 'ISSUE_MATERIAL',
        entity: 'MaterialIssue',
        entityId: result.materialIssue.id,
        changes: JSON.stringify(result),
      }
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Material issue error:', error)
    return NextResponse.json({ error: 'Failed to issue material' }, { status: 500 })
  }
}
