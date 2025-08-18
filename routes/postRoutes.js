import { Router } from 'express';
import {
  getAllPosts,
  removePost,
  getPostsByCategory,
  toggleLikeHandler,
  updatePostPage,
  updatePostMeta,
  handleTogglePublication,
  handleUpdatePostThumbnail,
  handleUpdatePageImage,
  handleCreatePost
} from '../controller/postController.js';
import { isAdmin } from '../middleware/isAdmin.js';
import passport from 'passport';
import { uploadPageImage, uploadThumbnail } from '../utils/cloudinaryConfig.js';

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
postRouter.post('/', passport.authenticate('jwt', { session: false }), isAdmin, handleCreatePost);
postRouter.put('/:postId/pages/:pageId', passport.authenticate('jwt', { session: false }), isAdmin, updatePostPage);
postRouter.put('/:postId/meta', passport.authenticate('jwt', { session: false }), isAdmin, updatePostMeta);
postRouter.put('/:postId/thumbnail', passport.authenticate('jwt', { session: false }), isAdmin, uploadThumbnail.single('file'), handleUpdatePostThumbnail);
postRouter.put('/page-images/:pageImageId', passport.authenticate('jwt', { session: false }), isAdmin, uploadPageImage.single('file'), handleUpdatePageImage);
postRouter.put('/:postId/publication', passport.authenticate('jwt', {session: false}), isAdmin, handleTogglePublication);
postRouter.delete('/:id', passport.authenticate('jwt', { session: false }), isAdmin, removePost);


// Temporary upload endpoints for CreatePostForm
postRouter.post('/temp-upload/thumbnail', 
  passport.authenticate('jwt', { session: false }), 
  isAdmin, 
  uploadThumbnail.single('file'), 
  async (req, res) => {
    try {
      const imageUrl = req.file.path; // Cloudinary URL
      res.json({ 
        success: true, 
        url: imageUrl,
        message: 'Thumbnail uploaded successfully' 
      });
    } catch (error) {
      console.error('Thumbnail upload error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Thumbnail upload failed' 
      });
    }
  }
);

postRouter.post('/temp-upload/page-image', 
  passport.authenticate('jwt', { session: false }), 
  isAdmin, 
  uploadPageImage.single('file'), 
  async (req, res) => {
    try {
      const imageUrl = req.file.path; // Cloudinary URL
      res.json({ 
        success: true, 
        url: imageUrl,
        message: 'Page image uploaded successfully' 
      });
    } catch (error) {
      console.error('Page image upload error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Page image upload failed' 
      });
    }
  }
);

export default postRouter;
