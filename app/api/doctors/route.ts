import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const doctors = await prisma.doctor.findMany({
      where: { active: true },
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: {
            surgeries: true,
            prescriptions: true,
          },
        },
      },
    });
    return NextResponse.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return NextResponse.json({ error: 'Failed to fetch doctors' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, name, specialization, phone, email, licenseNumber } = body;

    if (!code || !name || !specialization) {
      return NextResponse.json(
        { error: 'Code, name, and specialization are required' },
        { status: 400 }
      );
    }

    const doctor = await prisma.doctor.create({
      data: {
        code,
        name,
        specialization,
        phone,
        email,
        licenseNumber,
      },
    });

    return NextResponse.json(doctor, { status: 201 });
  } catch (error) {
    console.error('Error creating doctor:', error);
    return NextResponse.json({ error: 'Failed to create doctor' }, { status: 500 });
  }
}
