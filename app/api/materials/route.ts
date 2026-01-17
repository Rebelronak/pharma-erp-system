import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all materials
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    const materials = await prisma.material.findMany({
      where: type ? { type: type as any } : undefined,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(materials)
  } catch (error) {
    console.error('Error fetching materials:', error)
    return NextResponse.json({ error: 'Failed to fetch materials' }, { status: 500 })
  }
}

// POST create new material
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const material = await prisma.material.create({
      data: {
        code: body.code,
        name: body.name,
        type: body.type,
        unit: body.unit || 'units',
        reorderLevel: Number(body.reorderLevel) || 100,
      }
    })

    return NextResponse.json(material, { status: 201 })
  } catch (error) {
    console.error('Error creating material:', error)
    return NextResponse.json({ error: 'Failed to create material' }, { status: 500 })
  }
}
