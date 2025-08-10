import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


export const thumbnailStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'doggo-blog-thumbnails',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [
      { quality: 'auto', fetch_format: 'auto' },
      { width: 1200, height: 1200, crop: 'fill', gravity: 'auto' }
    ]
  }
});

export const pageImageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'doggo-blog-page-images',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [
      { quality: 'auto', fetch_format: 'auto' },
    ]
  }
});

export const uploadThumbnail = multer({ storage: thumbnailStorage });
export const uploadPageImage = multer({ storage: pageImageStorage });

export default cloudinary;
