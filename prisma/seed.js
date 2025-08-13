import prisma from "../lib/prisma.js";
import bcrypt from 'bcryptjs';

async function main() {

//    const plainPassword = '123';
//    const hashedPassword = await bcrypt.hash(plainPassword, 10)
//    await prisma.user.upsert({
//      where: { username: '' },
//      update: {},
//      create: {
//        username: '',
//        password: hashedPassword,
//        role: 'USER'
//      }
//    });

const DEFAULT_AVATAR = "/assets/corgi/profile/default.webp";

async function migrateAvatars() {
  try {
    const result = await prisma.user.updateMany({
      where: {
        avatar: null
      },
      data: {
        avatar: DEFAULT_AVATAR
      }
    });

    console.log(`Updated ${result.count} users with default avatars`);
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateAvatars();
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  })