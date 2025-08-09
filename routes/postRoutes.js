import { Router } from 'express';
import {
  getAllPosts,
  removePost,
  getPostsByCategory,
  createPost,
  toggleLikeHandler,
  updatePostPage,
  updatePostMeta,
  handleTogglePublication
} from '../controller/postController.js';
import { isAdmin } from '../middleware/isAdmin.js';
import passport from 'passport';

const postRouter = Router();

// Public
postRouter.get(
  '/',
  passport.authenticate('jwt', { session: false, failWithError: false }),
  getAllPosts
);
postRouter.get('/category/:category', getPostsByCategory);
postRouter.post(
  '/:id/like',
  passport.authenticate('jwt', { session: false }),
  toggleLikeHandler
);

// Protected (admin only)
postRouter.post('/', passport.authenticate('jwt', { session: false }), isAdmin, createPost);
postRouter.put('/:postId/pages/:pageId', passport.authenticate('jwt', { session: false }), isAdmin, updatePostPage);
postRouter.put('/:postId/meta', passport.authenticate('jwt', { session: false }), isAdmin, updatePostMeta);
postRouter.put('/:postId/publication', passport.authenticate('jwt', {session: false}), isAdmin, handleTogglePublication);
postRouter.delete('/:id', passport.authenticate('jwt', { session: false }), isAdmin, removePost);

export default postRouter;
