import prisma from '../lib/prisma.js';

// Get all posts with optional pagination & sorting
const displayAllPosts = async ({ page = 1, pageSize = 10, sortBy = 'createdAt', order = 'desc' }) => {
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  return prisma.post.findMany({
    skip,
    take,
    orderBy: {
      [sortBy]: order,
    },
    include: {
      author: {
        select: { id: true, username: true },
      },
      comments: {
        select: { id: true, createdAt: true, userId: true, postId: true },
      },
      categories: true,
    },
  });
};

const showUnpublishedPosts = async () => {
  return prisma.post.findMany({
    where: { published: false },
    include: {
      author: true,
      comments: true,
    },
  });
};

const deletePost = async (id) => {
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) throw new Error('Post not found');

  return prisma.post.delete({ where: { id } });
};

const findPostsByCategory = async (categoryName) => {
  return prisma.post.findMany({
    where: {
      categories: {
        some: {
          name: categoryName,
        },
      },
    },
    include: {
      author: true,
      comments: true,
    },
  });
};

const increasePostViewCount = async (postId) => {
  return prisma.post.update({
    where: { id: postId },
    data: { views: { increment: 1}},
  });
};

const editPost = async (postId, { title, content, categoryId, published }) => {
  return prisma.post.update({
    where: { id: postId },
    data: {
      title, 
      content, 
      categoryId, 
      published
    }
  });
}

const toggleLike = async (userId, postId) => {
  const existingLike = await prisma.like.findUnique({
    where: {
      userId_postId: { userId, postId },
    },
  });

  if (existingLike) {
    await prisma.like.delete({
      where: {
        userId_postId: { userId, postId },
      },
    });
    return { liked: false };
  } else {
    await prisma.like.create({
      data: {
        user: { connect: { id: userId } },
        post: { connect: { id: postId } },
      },
    });
    return { liked: true };
  }
};

const getPostLikeCount = async (postId) => {
  return prisma.like.count({
    where: { postId },
  });
};


export {
  displayAllPosts,
  showUnpublishedPosts,
  deletePost,
  findPostsByCategory,
  increasePostViewCount,
  editPost,
  getPostLikeCount,
  toggleLike
};
