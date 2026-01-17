import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateBatchNumber } from '@/lib/utils'

// GET all batches
export async function GET() {
  try {
    const batches = await prisma.batch.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(batches)
  } catch (error) {
    console.error('Error fetching batches:', error)
    return NextResponse.json({ error: 'Failed to fetch batches' }, { status: 500 })
  }
}

// POST create new batch
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const batchNumber = generateBatchNumber()

    const batch = await prisma.batch.create({
      data: {
        batchNumber,
        productId: body.productId,
        plannedQuantity: Number(body.plannedQuantity),
        actualQuantity: 0,
        startDate: new Date(body.startDate),
        notes: body.notes || null,
        status: 'IN_PROCESS'
      }
    })

    return NextResponse.json(batch, { status: 201 })
  } catch (error) {
    console.error('Batch creation error:', error)
    return NextResponse.json({ error: 'Failed to create batch' }, { status: 500 })
  }
}
