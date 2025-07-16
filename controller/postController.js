import asyncHandler from 'express-async-handler';
import {
  displayAllPosts,
  showUnpublishedPosts,
  deletePost,
  findPostsByCategory,
  editPost,
  increasePostViewCount,
  toggleLike,
  getPostLikeCount
} from '../services/postServices.js';

export const getAllPosts = asyncHandler(async (req, res) => {
  const { page, pageSize, sortBy, order } = req.query;

  const posts = await displayAllPosts({
    page: parseInt(page) || 1,
    pageSize: parseInt(pageSize) || 10,
    sortBy: sortBy || 'createdAt',
    order: order || 'desc',
  });

  res.json(posts);
});

export const getUnpublishedPosts = asyncHandler(async (req, res) => {
  const posts = await showUnpublishedPosts();
  res.json(posts);
});

export const removePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deleted = await deletePost(id);
  res.json({ message: 'Post deleted', deleted });
});

export const getPostsByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;
  const posts = await findPostsByCategory(category);
  res.json(posts);
});

export const createPost = asyncHandler(async (req, res) => {
  const { title, content, categoryId } = req.body;

  const post = await prisma.post.create({
    data: {
      title,
      content,
      published: false,
      authorId: req.user.id,
      category: {
        connect: { id: categoryId },
      },
    },
  });

  res.status(201).json(post);
});

export const updatePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, content, categoryId, published } = req.body;
  const updated = await editPost(id, { title, content, categoryId, published });
  res.json({ message: 'Post updated', updated})
});

export const incrementPostViews = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const post = await increasePostViewCount(id);
  res.json({ views: post.views });
});


export const toggleLikeHandler = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { id: postId } = req.params;

  const result = await toggleLike(userId, postId);
  const totalLikes = await getPostLikeCount(postId);

  res.json({
    message: result.liked ? 'Post liked' : 'Post unliked',
    liked: result.liked,
    totalLikes,
  });
});