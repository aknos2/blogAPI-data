import asyncHandler from 'express-async-handler';
import prisma from '../lib/prisma.js';
import {
  displayAllPosts,
  deletePost,
  findPostsByCategory,
  increasePostViewCount,
  toggleLike,
  getPostLikeCount,
  editPostPage,
  editPostMeta,
  togglePostPublication,
} from '../services/postServices.js';

export const getAllPosts = asyncHandler(async (req, res) => {
  // If admin is logged in, show both published & unpublished
  const includeUnpublished = req.user?.role === 'ADMIN';
  const posts = await displayAllPosts(includeUnpublished);
  res.json(posts);
});

export const handleTogglePublication = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const updatedPost = await togglePostPublication(postId);
  res.json(updatedPost);
});

export const removePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deleted = await deletePost(id);
  res.json({ message: 'Post deleted', deleted });
});

export const getPostsByCategory = asyncHandler(async (req, res) => {
  const { tag } = req.params;
  const posts = await findPostsByCategory(tag);
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

export const updatePostPage = asyncHandler(async (req, res) => {
  const { pageId } = req.params;
  const { heading, subtitle, content } = req.body;
  
  const updated = await editPostPage(pageId, { heading, subtitle, content });
  res.json({ message: 'Post page updated', updated });
});

export const updatePostMeta = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { title, createdAt, tags } = req.body;
  
  const updated = await editPostMeta(postId, { title, createdAt, tags });
  res.json({ message: 'Post updated', updated });
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