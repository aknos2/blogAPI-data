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
import { uploadPageImage, uploadThumbnail } from '../utils/cloudinaryConfig.js';
import { authenticateJWT, optionalAuth } from '../middleware/auth.js'; // NEW

const postRouter = Router();

// Public routes - but with optional auth for admin posts
postRouter.get('/', optionalAuth, getAllPosts); // Now can show unpublished to admins
postRouter.get('/category/:category', getPostsByCategory);

// Authentication required
postRouter.post('/:id/like', authenticateJWT, toggleLikeHandler);

// Protected (admin only) - just replace passport.authenticate with authenticateJWT
postRouter.post('/', authenticateJWT, isAdmin, handleCreatePost);
postRouter.put('/:postId/pages/:pageId', authenticateJWT, isAdmin, updatePostPage);
postRouter.put('/:postId/meta', authenticateJWT, isAdmin, updatePostMeta);
postRouter.put('/:postId/thumbnail', authenticateJWT, isAdmin, uploadThumbnail.single('file'), handleUpdatePostThumbnail);
postRouter.put('/page-images/:pageImageId', authenticateJWT, isAdmin, uploadPageImage.single('file'), handleUpdatePageImage);
postRouter.put('/:postId/publication', authenticateJWT, isAdmin, handleTogglePublication);
postRouter.delete('/:id', authenticateJWT, isAdmin, removePost);

// Temp upload endpoints - same change
postRouter.post('/temp-upload/thumbnail', 
  authenticateJWT, 
  isAdmin, 
  uploadThumbnail.single('file'), 
  async (req, res) => {
    try {
      const imageUrl = req.file.path;
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
  authenticateJWT, 
  isAdmin, 
  uploadPageImage.single('file'), 
  async (req, res) => {
    try {
      const imageUrl = req.file.path;
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
