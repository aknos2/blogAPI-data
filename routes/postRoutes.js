import { Router } from 'express';
import {
  getAllPosts,
  getUnpublishedPosts,
  removePost,
  getPostsByCategory,
  createPost,
  updatePost,
  toggleLikeHandler
} from '../controller/postController.js';
import { isAdmin } from '../middleware/isAdmin.js';
import passport from 'passport';

const postRouter = Router();

// Public
postRouter.get('/', getAllPosts);
postRouter.get('/category/:category', getPostsByCategory);
postRouter.post(
  '/:id/like',
  passport.authenticate('jwt', { session: false }),
  toggleLikeHandler
);

// Protected (admin only)
postRouter.get('/unpublished', passport.authenticate('jwt', { session: false }), isAdmin, getUnpublishedPosts);
postRouter.post('/', passport.authenticate('jwt', { session: false }), isAdmin, createPost);
postRouter.put('/:id', passport.authenticate('jwt', { session: false }), isAdmin, updatePost);
postRouter.delete('/:id', passport.authenticate('jwt', { session: false }), isAdmin, removePost);

export default postRouter;
