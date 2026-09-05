import { db } from '../db.ts';

const seedName = 'Prisma contract verification location';

try {
  const existing = await db.orm.public.Location.where({ name: seedName }).first();
  const location =
    existing ??
    (await db.orm.public.Location.create({
      name: seedName,
      description: 'Created by the Prisma contract verification seed.',
      address: 'Contract verification test address',
      sortOrder: 999,
    }));

  const verified = await db.orm.public.Location.where({ id: location.id }).first();
  if (!verified) {
    throw new Error(`Location ${location.id} was not readable after seeding.`);
  }

  console.log(
    JSON.stringify(
      {
        action: existing ? 'already-existed' : 'created',
        location: verified,
      },
      null,
      2,
    ),
  );
} finally {
  await db.close();
}
