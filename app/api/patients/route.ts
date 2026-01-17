import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generatePatientNumber } from '@/lib/utils'

// GET all patients
export async function GET() {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(patients)
  } catch (error) {
    console.error('Error fetching patients:', error)
    return NextResponse.json({ error: 'Failed to fetch patients' }, { status: 500 })
  }
}

// POST create patient
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const patient = await prisma.patient.create({
      data: {
        code: body.code,
        name: body.name,
        age: body.age,
        gender: body.gender,
        phone: body.phone || null,
        email: body.email || null,
        address: body.address || null,
        medicalHistory: body.medicalHistory || null,
      }
    })

    return NextResponse.json(patient, { status: 201 })
  } catch (error) {
    console.error('Patient creation error:', error)
    return NextResponse.json({ error: 'Failed to create patient' }, { status: 500 })
  }
}
