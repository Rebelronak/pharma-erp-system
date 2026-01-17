import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const finishedInventory = await prisma.finishedInventory.findMany({
      where: { available: true },
      include: {
        material: true,
        batch: true,
      },
      orderBy: { approvedDate: 'desc' },
    });

    // Group by material
    const groupedInventory = finishedInventory.reduce((acc: any, item) => {
      const key = item.materialId;
      if (!acc[key]) {
        acc[key] = {
          material: item.material,
          totalQuantity: 0,
          batches: [],
        };
      }
      acc[key].totalQuantity += item.quantity;
      acc[key].batches.push({
        id: item.id,
        batchNumber: item.batch.batchNumber,
        lotNumber: item.lotNumber,
        quantity: item.quantity,
        expiryDate: item.expiryDate,
        approvedDate: item.approvedDate,
      });
      return acc;
    }, {});

    return NextResponse.json(Object.values(groupedInventory));
  } catch (error) {
    console.error('Error fetching finished inventory:', error);
    return NextResponse.json({ error: 'Failed to fetch finished inventory' }, { status: 500 });
  }
}
