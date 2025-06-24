import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const productData = [
    { name: 'HIV Testing Kit', price: 1000 },
    { name: 'Condom Pack', price: 800 },
    { name: 'Pregnancy Test Strip', price: 500 },
    { name: 'Lubricant', price: 300 },
    { name: 'Plan B - Postinor', price: 1200 },
  ];
  await prisma.product.createMany({ data: productData });

  const allProducts = await prisma.product.findMany();

  const locationNames = [
    'Abdulsalam Abubukar Hall, University of Ibadan.',
    'SUB, University of Ibadan.',
  ];
  const locations: any[] = [];

  for (const name of locationNames) {
    const location = await prisma.location.create({
      data: { name },
    });
    locations.push(location);

    for (let i = 1; i <= 4; i++) {
      const box = await prisma.box.create({
        data: {
          boxNumber: `BOX-${i}-${location.name}`,
          locationId: location.id,
        },
      });

      await prisma.accessCode.create({
        data: {
          code: `${box.boxNumber}-ACCESS`,
          boxId: box.id,
          locationId: location.id,
        },
      });
    }
  }

  for (const product of allProducts) {
    await prisma.purchaseCode.create({
      data: {
        code: `PCODE-${product.name.toUpperCase().replace(/\s+/g, '-')}`,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
        maxOrderQuantity: 4,
        totalOrderLimit: 1000,
        products: { connect: { id: product.id } },
      },
    });
  }

  await prisma.purchaseCode.create({
    data: {
      code: 'UNIVERSAL-PCODE',
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      maxOrderQuantity: 4,
      totalOrderLimit: 5000,
      products: {
        connect: allProducts.map((p: any) => ({ id: p.id })),
      },
    },
  });

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
