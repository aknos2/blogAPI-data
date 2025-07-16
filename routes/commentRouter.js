import { Router } from 'express';
import passport from 'passport';
import { createComment, deleteComment } from '../controller/commentController.js';
import { isCommentOwnerOrAdmin } from '../middleware/isCommentOwnerOrAdmin.js';

const commentRouter = Router();

commentRouter.post('/', passport.authenticate('jwt', { session: false }), createComment);

commentRouter.delete('/:id',
  passport.authenticate('jwt', { session: false }),
  isCommentOwnerOrAdmin,
  deleteComment
);

export default commentRouter;
