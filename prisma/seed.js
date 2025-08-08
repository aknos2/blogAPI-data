import prisma from "../lib/prisma.js";
import bcrypt from 'bcryptjs';

async function main() {
//    // 1. Find existing admin user
//   const admin = await prisma.user.findUnique({
//     where: { username: 'admin' }
//   });

//   if (!admin) {
//     throw new Error("Admin user not found. Please create one first.");
//   }

//   const userId = admin.id;

//   // 2. Normalize and upsert tags
//   function normalizeTagName(name) {
//     return name.trim().toLowerCase();
//   }

//   const rawTagNames = ["Friends", "Food"];
//   const uniqueTagNames = [...new Set(rawTagNames.map(normalizeTagName))];

//   const tags = await Promise.all(
//     uniqueTagNames.map(name =>
//       prisma.tag.upsert({
//         where: { name },
//         update: {},
//         create: { name }
//       })
//     )
//   );

//  // 3. Create the post WITHOUT thumbnail first
//   const post = await prisma.post.create({
//     data: {
//       title: 'Eating with Kitty',
//       published: true,
//       author: {
//         connect: { id: userId }
//       },
//       tags: {
//         connect: tags.map(tag => ({ id: tag.id }))
//       }
//     }
//   });

//   // 4. Create the thumbnail (after the post) and connect it via postId
//   const thumbnail = await prisma.postImage.create({
//     data: {
//       url: '/assets/corgi/articles/day1/corgi-eating-plant.webp',
//       altText: 'Corgi eating',
//       caption: 'Corgi and Kitty',
//       post: {
//         connect: { id: post.id }
//       }
//     }
//   });

//   // 5. Update the post to point to the thumbnail
//   await prisma.post.update({
//     where: { id: post.id },
//     data: {
//       thumbnailId: thumbnail.id
//     }
//   });
// To check your table name, you can also use:
const tableInfo = await prisma.$queryRaw`
  SELECT table_name 
  FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name LIKE '%tag%'
`;
console.log(tableInfo);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

    // // 1. Hash admin password
  // const plainPassword = 'admin123';
  // const hashedPassword = await bcrypt.hash(plainPassword, 10);

  // const admin = await prisma.user.upsert({
  //   where: { username: 'admin' },
  //   update: {},
  //   create: {
  //     username: 'admin',
  //     password: hashedPassword,
  //     role: 'ADMIN'
  //   }
  // });

    // // 6. Create pages and images
  // const pagesData = [
  //   {
  //     pageNum: 1,
  //     layout: 'titlePage',
  //     heading: 'Today I run all around the parkie',
  //     subtitle: "I'm speedy-speed, can't catch me!",
  //     content: 'I wuv nature!',
  //     image: {
  //       url: '/assets/corgi/articles/day1/corgi-running.webp',
  //       altText: 'Corgi running'
  //     }
  //   },
  //   {
  //     pageNum: 2,
  //     layout: 'horizontalImage',
  //     subtitle: 'The wind feels so nice!',
  //     content: 'Little tired but breeze is great!',
  //     image: {
  //       url: '/assets/corgi/articles/day1/corgi-breeze.webp',
  //       altText: 'Corgi in breeze'
  //     }
  //   },
  //   {
  //     pageNum: 3,
  //     layout: 'horizontalImage',
  //     subtitle: 'Found some yummy plants',
  //     content: 'Today was a good day.',
  //     image: {
  //       url: '/assets/corgi/articles/day1/corgi-eating-plant.webp',
  //       altText: 'Corgi eating plant'
  //     }
  //   }
  // ];

  // for (const page of pagesData) {
  //   const createdPage = await prisma.postPage.create({
  //     data: {
  //       postId: post.id,
  //       pageNum: page.pageNum,
  //       layout: page.layout,
  //       heading: page.heading || null,
  //       subtitle: page.subtitle,
  //       content: page.content
  //     }
  //   });

  //   const image = await prisma.postImage.create({
  //     data: {
  //       url: page.image.url,
  //       altText: page.image.altText,
  //       postId: post.id,
  //       caption: page.subtitle
  //     }
  //   });

  //   await prisma.pageImage.create({
  //     data: {
  //       pageId: createdPage.id,
  //       imageId: image.id,
  //       order: 1,
  //       caption: page.subtitle
  //     }
  //   });
  // }