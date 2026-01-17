import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generatePrescriptionNumber } from '@/lib/utils'

// GET all prescriptions
export async function GET() {
  try {
    const prescriptions = await prisma.prescription.findMany({
      include: {
        patient: true,
        doctor: {
          include: {
            user: {
              select: { id: true, name: true, email: true }
            }
          }
        },
        medicines: true,
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(prescriptions)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch prescriptions' }, { status: 500 })
  }
}

// POST create prescription
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const prescriptionNumber = generatePrescriptionNumber()

    const prescription = await prisma.prescription.create({
      data: {
        prescriptionNumber,
        patientId: body.patientId,
        doctorId: body.doctorId,
        prescriptionDate: new Date(),
        diagnosis: body.diagnosis,
        notes: body.notes,
        medicines: {
          create: body.medicines.map((med: any) => ({
            medicineName: med.medicineName,
            dosage: med.dosage,
            frequency: med.frequency,
            duration: med.duration,
            quantity: med.quantity,
            instructions: med.instructions,
          }))
        }
      },
      include: {
        patient: true,
        doctor: {
          include: {
            user: true
          }
        },
        medicines: true,
      }
    })

    return NextResponse.json(prescription, { status: 201 })
  } catch (error) {
    console.error('Prescription creation error:', error)
    return NextResponse.json({ error: 'Failed to create prescription' }, { status: 500 })
  }
}
