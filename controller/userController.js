import prisma from '../lib/prisma.js';
import asyncHandler from 'express-async-handler';

export const getUserStats = asyncHandler(async(req, res) => {
  const userId = req.user.id;

  const comments = await prisma.comment.count({ where: { userId }});
  const likes = await prisma.like.count({ where: { userId }});
  const user = await prisma.user.findUnique({ 
    where: { id: userId },
    select: { username: true }
  });
  const role = await prisma.user.findUnique({ 
    where: { id: userId },
    select: { role: true }
  });

  res.json({comments, 
            likes, 
            username: user?.username || "User",
            role,
            userId
          });
});