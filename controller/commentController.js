import asyncHandler from 'express-async-handler';
import prisma from '../lib/prisma.js';

export const createComment = asyncHandler(async (req, res) => {
  const { content, postId } = req.body;

  const comment = await prisma.comment.create({
    data: {
      content,
      post: { connect: { id: postId } },
      user: { connect: { id: req.user.id } },
    },
  });

  res.status(201).json(comment);
});

export const deleteComment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const comment = await prisma.comment.findUnique({ where: { id } });
  if (!comment) throw new Error('Comment not found');

  const deleted = await prisma.comment.delete({ where: { id } });

  res.json({ message: 'Comment deleted', deleted });
});
