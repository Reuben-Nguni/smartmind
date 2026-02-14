import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Create storage engine for images
const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'smartmind/images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  }
});

// Create storage engine for PDFs
const pdfStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'smartmind/pdfs',
    allowed_formats: ['pdf'],
    resource_type: 'raw'
  }
});

// Create storage engine for videos
const videoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'smartmind/videos',
    allowed_formats: ['mp4', 'webm', 'mov'],
    resource_type: 'video'
  }
});

// Create upload middleware
export const uploadImage = multer({ storage: imageStorage });
export const uploadPDF = multer({ storage: pdfStorage });
export const uploadVideo = multer({ storage: videoStorage });

// Generic upload for any file
export const uploadAny = multer({
  storage: new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'smartmind/uploads',
      resource_type: 'auto'
    }
  })
});

export default cloudinary;

