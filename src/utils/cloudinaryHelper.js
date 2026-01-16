import cloudinary from '../config/cloudinary.js';
import logger from '../config/logger.js';

/**
 * Delete an image from Cloudinary
 * @param {string} url - Full Cloudinary image URL
 * @returns {Promise<void>}
 */
export const deleteFromCloudinary = async (url) => {
    if (!url) return;

    try {
        // 1. Extract Public ID
        // Example: https://res.cloudinary.com/demo/image/upload/v1234567890/folder/my_image.jpg
        // Public ID: folder/my_image

        // Split by '/' and get the last part (filename with extension)
        const parts = url.split('/');
        const filename = parts[parts.length - 1];

        // Remove extension (.jpg, .png etc)
        const publicIdWithExtension = filename.split('.')[0];

        // If you are using folders in cloudinary, you might need to extract the folder path too.
        // However, looking at standard multer-storage-cloudinary setup, usually the public_id is returned in the file object,
        // but here we are dealing with the URL stored in the DB.

        // A robust way to get public_id if we know the folder structure, 
        // but generic extraction is safer if we assume the standard Cloudinary URL structure.
        // For specific folder "blog-app/users", we might need to look for that.
        // Let's assume the filename (without extension) is the public_id or close enough for the root folder,
        // BUT if the app uses folders, we need the folder name.

        // Improved logic: Match everything after 'upload/' version part, but that's complex since version is optional.
        // Simplest approach for typical setups:
        // User profile pictures often have a folder.
        // Let's try to extract from the last few segments if known, or parse regex.

        const regex = /\/([^/]+)\.[a-z]{3,4}$/;
        const match = url.match(regex);
        // This only gets the filename. If it's in a folder 'users/pic', it won't work well just with filename.

        // Let's use a more generic approach:
        // Extract everything after the last 'upload/' and remove version (v12345/) if present.
        // .../upload/v1615456/users/profile.jpg  -> users/profile

        const splitUrl = url.split('upload/');
        if (splitUrl.length < 2) return; // Not a standard Cloudinary URL

        let publicId = splitUrl[1];

        // Remove version (v123456/)
        if (publicId.startsWith('v')) {
            const versionIndex = publicId.indexOf('/');
            if (versionIndex !== -1) {
                publicId = publicId.substring(versionIndex + 1);
            }
        }

        // Remove extension
        const extensionIndex = publicId.lastIndexOf('.');
        if (extensionIndex !== -1) {
            publicId = publicId.substring(0, extensionIndex);
        }

        // 2. Delete
        await cloudinary.uploader.destroy(publicId);
        logger.info(`🗑️ Deleted old image: ${publicId}`);

    } catch (error) {
        logger.error('❌ Cloudinary Delete Error:', error);
        // We don't throw here to avoid stopping the user update flow
    }
};
