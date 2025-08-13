import prisma from '../lib/prisma.js';
import asyncHandler from 'express-async-handler';

export const getUserStats = asyncHandler(async(req, res) => {
  const userId = req.user.id;
  
  // Use Promise.all to run queries concurrently
  const [comments, likes, user] = await Promise.all([
    prisma.comment.count({ where: { userId }}),
    prisma.like.count({ where: { userId }}),
    prisma.user.findUnique({ 
      where: { id: userId },
      select: { 
        username: true,
        avatar: true,
        role: true
      }
    })
  ]);

  res.json({
    comments, 
    likes, 
    username: user?.username || "User",
    role: user?.role,
    avatar: user?.avatar,
    userId
  });
});