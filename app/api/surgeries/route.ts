import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all surgeries
export async function GET() {
  try {
    const surgeries = await prisma.surgery.findMany({
      include: {
        patient: true,
        doctor: true,
      },
      orderBy: { surgeryDate: 'desc' }
    })

    return NextResponse.json(surgeries)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch surgeries' }, { status: 500 })
  }
}

// POST create surgery record
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const surgeryNumber = `SRG-${Date.now()}`

    const surgery = await prisma.surgery.create({
      data: {
        surgeryNumber,
        patientId: body.patientId,
        doctorId: body.doctorId,
        surgeryType: body.surgeryType,
        surgeryDate: new Date(body.surgeryDate),
        outcome: body.outcome,
        notes: body.notes,
      },
      include: {
        patient: true,
        doctor: true,
      }
    })

    return NextResponse.json(surgery, { status: 201 })
  } catch (error) {
    console.error('Surgery creation error:', error)
    return NextResponse.json({ error: 'Failed to create surgery record' }, { status: 500 })
  }
}
