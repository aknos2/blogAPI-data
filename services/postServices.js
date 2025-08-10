import prisma from '../lib/prisma.js';

const postWithAllRelations = {
  author: {
    select: { id: true, username: true },
  },
  comments: {
    select: { id: true, createdAt: true, userId: true, postId: true },
  },
  tags: true,
  thumbnail: true,
  Like: {
    select: {
      userId: true,
    },
  },
  postPage: {
    orderBy: { pageNum: 'asc' },
    include: {
      PageImage: {
        include: {
          image: true,
        },
      },
    },
  },
};

const displayAllPosts = async (includeUnpublished = false) => {
  return prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    where: includeUnpublished ? {} : { published: true },
    include: postWithAllRelations,
  });
};

const togglePostPublication = async (postId) => {
  const post = await prisma.post.findUnique({ 
    where: { id: postId }
  });

  if (!post) throw new Error("Post not found");

  return prisma.post.update({
    where: { id: postId },
    data: { published: !post.published }
  });
};

const deletePost = async (id) => {
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) throw new Error('Post not found');

  return prisma.post.delete({ where: { id } });
};

const findPostsByCategory = async (tagName) => {
  return prisma.post.findMany({
    where: {
      tags: {
        some: {
          name: tagName,
          mode: "insensitive" // Case-insensitive search
        },
      },
    },
    include: postWithAllRelations,
  });
};

const increasePostViewCount = async (postId) => {
  return prisma.post.update({
    where: { id: postId },
    data: { views: { increment: 1}},
  });
};

const editPostPage = async (pageId, { subtitle, heading, content }) => {
  // First verify the page exists
  const existingPage = await prisma.postPage.findUnique({
    where: { id: pageId }
  });
  
  if (!existingPage) {
    throw new Error('Post page not found');
  }

  return prisma.postPage.update({
    where: { id: pageId },
    data: {
      subtitle,
      content, 
      heading
    }
  });
}

const editPostMeta = async (postId, { title, createdAt, tags }) => {
  // First verify the page exists
  const existingPost = await prisma.post.findUnique({
    where: { id: postId }
  });
  
  if (!existingPost) {
    throw new Error('Post not found');
  }

  // Process tags: normalize to lowercase and remove duplicates
  const processedTags = tags ? 
    [...new Set(tags.map(tag => tag.toLowerCase().trim()).filter(Boolean))] : 
    undefined;

  return prisma.post.update({
    where: { id: postId },
    data: {
      ...(title && {title}),
      ...(createdAt && {createdAt: new Date(createdAt)}),
      ...(processedTags && {
        tags: {
          set: [],
          connectOrCreate: processedTags.map((tagName) => ({
            where: { name: tagName },
            create: { name: tagName }
          }))
        }
      })
    },
    include: { tags: true } //return updated tags
  });
}

const updatePostThumbnail = async (postId, imageUrl) => {
  const existingPost = await prisma.post.findUnique({ where: { id: postId } });
  if (!existingPost) throw new Error("Post not found");

  const image = await prisma.postImage.create({
    data: { url: imageUrl, 
            postId 
          }
  });

  return prisma.post.update({
    where: { id: postId },
    data: {
    thumbnail: {
        upsert: {
          create: { 
            url: imageUrl, 
            postId 
          },
          update: { 
            url: imageUrl 
          }
        }
      }
    },
    include: postWithAllRelations
  });
};

const updatePageImage = async (pageImageId, imageUrl) => {
  const existingPageImage = await prisma.pageImage.findUnique({
    where: { id: pageImageId },
    include: { page: true }
  });
  if (!existingPageImage) throw new Error("PageImage not found");

  return prisma.pageImage.update({
    where: { id: pageImageId },
    data: { 
      image: {
        upsert: {
          create: {
            url: imageUrl,
            postId: existingPageImage.page.postId
          },
          update: {
            url: imageUrl
          }
        }
      }
    },
    include: {
      image: true,
      page: true
    }
  });
};


const toggleLike = async (userId, postId) => {
  // Verify post exists
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) {
    throw new Error('Post not found');
  }
  
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
  deletePost,
  findPostsByCategory,
  increasePostViewCount,
  editPostPage,
  getPostLikeCount,
  toggleLike,
  editPostMeta,
  togglePostPublication,
  updatePageImage,
  updatePostThumbnail
};
