import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

// Profile Picture Upload
const profileStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'blog-app/profiles',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
        transformation: [{ width: 500, height: 500, crop: 'limit' }],
    },
});

export const upload = multer({
    storage: profileStorage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Blog Image Upload
const blogStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'blog-app/blogs',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
        transformation: [{ width: 1200, height: 630, crop: 'limit' }], // OG image size
    },
});

export const blogUpload = multer({
    storage: blogStorage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB for blog images
    }
});
