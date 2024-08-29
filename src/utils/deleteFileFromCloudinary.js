import cloudinary from 'cloudinary';

cloudinary.v2.config({
    secure: true,
    cloud_name: env("CLOUD_NAME"),
    api_key: env("API_KEY"),
    api_secret: env("API_SECRET"),
});

import {env} from './env.js';

export const deleteFileFromCloudinary = async (url) => {
    try {
        const publicId = url.split('/').pop().split('.')[0];

        await cloudinary.v2.uploader.destroy(publicId);

        console.log(`File with public ID ${publicId} deleted successfully.`);
    } catch (error) {
        console.error('Error deleting file from Cloudinary:', error);
        throw new Error('Error deleting file from Cloudinary');
    }
};
