import asyncHandler from 'express-async-handler';
import prisma from '../lib/prisma.js';

export const createComment = asyncHandler(async (req, res) => {
  const { content, postId } = req.body;

  if (!content || !postId) {
    res.status(400);
    throw new Error('Missing content or postId');
  }

  const comment = await prisma.comment.create({
    data: {
      content,
      post: { connect: { id: postId } },
      user: { connect: { id: req.user.id } },
    },
    include: {
     user: {
        select: {
          id: true,
          username: true,
          role: true
        }
      }
    }
  });

  res.status(201).json(comment);
});

export const deleteComment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const comment = await prisma.comment.findUnique({ where: { id } });
  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  const deleted = await prisma.comment.delete({ where: { id } });

  res.json({ message: 'Comment deleted', deleted });
});

export const displayCommentsFromPost = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const comments = await prisma.comment.findMany({
    where: { postId },
    include: {
    user: {
      select: {
        id: true,
        username: true,
        role: true
      }
    }
  }, //to show commenter info
    orderBy: { createdAt: 'desc' }
  });

  res.json(comments);
});