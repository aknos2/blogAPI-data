import { Router } from 'express';
import { createComment, deleteComment, displayCommentsFromPost } from '../controller/commentController.js';
import { isCommentOwnerOrAdmin } from '../middleware/isCommentOwnerOrAdmin.js';
import { authenticateJWT } from '../middleware/auth.js';

const commentRouter = Router();

commentRouter.get('/post/:postId', displayCommentsFromPost);

commentRouter.post('/', authenticateJWT, createComment);

commentRouter.delete('/:id',
  authenticateJWT,
  isCommentOwnerOrAdmin,
  deleteComment
);

export default commentRouter;