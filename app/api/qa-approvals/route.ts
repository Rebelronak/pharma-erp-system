import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all QA approvals
export async function GET() {
  try {
    const approvals = await prisma.qAApproval.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(approvals)
  } catch (error) {
    console.error('Error fetching QA approvals:', error)
    return NextResponse.json({ error: 'Failed to fetch QA approvals' }, { status: 500 })
  }
}

// POST create QA approval/rejection
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { batchId, inspectorId, status, testResults, remarks } = body

    // Check if batch exists
    const batch = await prisma.batch.findUnique({
      where: { id: batchId }
    })

    if (!batch) {
      return NextResponse.json({ error: 'Batch not found' }, { status: 404 })
    }

    // Create QA approval record
    const qaApproval = await prisma.qAApproval.create({
      data: {
        batchId,
        inspectorId,
        status,
        inspectionDate: new Date(),
        approvalDate: status === 'APPROVED' ? new Date() : null,
        testResults: testResults || 'Quality tests completed',
        remarks: remarks || null,
      }
    })

    // Update batch status based on QA result
    const newBatchStatus = status === 'APPROVED' 
      ? 'QA_APPROVED' 
      : status === 'REJECTED' 
        ? 'QA_REJECTED' 
        : 'IN_PROCESS'

    await prisma.batch.update({
      where: { id: batchId },
      data: {
        status: newBatchStatus,
        completionDate: status === 'APPROVED' ? new Date() : null,
      }
    })

    return NextResponse.json(qaApproval, { status: 201 })
  } catch (error) {
    console.error('QA approval error:', error)
    return NextResponse.json({ error: 'Failed to process QA approval' }, { status: 500 })
  }
}
