import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const rawInventory = await prisma.rawInventory.findMany({
      include: {
        material: true,
        supplier: true,
      },
      orderBy: { receivedDate: 'desc' },
    });

    // Group by material and sum quantities
    const groupedInventory = rawInventory.reduce((acc: any, item) => {
      const key = item.materialId;
      if (!acc[key]) {
        acc[key] = {
          material: item.material,
          totalQuantity: 0,
          lots: [],
        };
      }
      acc[key].totalQuantity += item.quantity;
      acc[key].lots.push({
        id: item.id,
        lotNumber: item.lotNumber,
        quantity: item.quantity,
        expiryDate: item.expiryDate,
        supplier: item.supplier.name,
        receivedDate: item.receivedDate,
      });
      return acc;
    }, {});

    return NextResponse.json(Object.values(groupedInventory));
  } catch (error) {
    console.error('Error fetching raw inventory:', error);
    return NextResponse.json({ error: 'Failed to fetch raw inventory' }, { status: 500 });
  }
}
