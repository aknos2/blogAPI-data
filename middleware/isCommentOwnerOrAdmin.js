export const isCommentOwnerOrAdmin = async (req, res, next) => {
  const { id } = req.params;
  const comment = await prisma.comment.findUnique({ where: { id } });

  if (!comment) return res.status(404).json({ message: 'Comment not found' });

  // Allow if user is the owner or an admin
  if (req.user.id === comment.userId || req.user.role === 'ADMIN') {
    return next();
  }

  return res.status(403).json({ message: 'Access denied' });
};