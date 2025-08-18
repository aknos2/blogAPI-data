import prisma from "../lib/prisma.js";
import bcrypt from 'bcryptjs';

async function main() {
  const DEFAULT_AVATAR = '/assets/corgi/profile/white-cat-icon.png';

  const plainPassword = 'tomiyoshi3218';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {}, // keep empty if you don't want to change existing admin
    create: {
      username: 'admin',
      password: hashedPassword,
      role: 'ADMIN',
      avatar: DEFAULT_AVATAR
    }
  });

  console.log('✅ Admin user seeded successfully');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
