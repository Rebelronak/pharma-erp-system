import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const processInventory = await prisma.processInventory.findMany({
      include: {
        material: true,
        batch: {
          include: {
            qaApproval: true,
          },
        },
      },
      orderBy: { startDate: 'desc' },
    });

    // Group by batch
    const groupedInventory = processInventory.reduce((acc: any, item) => {
      const key = item.batchId;
      if (!acc[key]) {
        acc[key] = {
          batch: item.batch,
          materials: [],
          totalValue: 0,
        };
      }
      acc[key].materials.push({
        id: item.id,
        material: item.material,
        quantity: item.quantity,
        startDate: item.startDate,
      });
      return acc;
    }, {});

    return NextResponse.json(Object.values(groupedInventory));
  } catch (error) {
    console.error('Error fetching process inventory:', error);
    return NextResponse.json({ error: 'Failed to fetch process inventory' }, { status: 500 });
  }
}
