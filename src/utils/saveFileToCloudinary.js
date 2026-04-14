import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  secure: true,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const saveToFileCloudinary = async (buffer, userId) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'notes-api/images',
        resource_type: 'image',
        public_id: `image_${userId}`,
        overwrite: true,
        unique_filename: false,
        transformation: [
          { width: 300, height: 300, crop: 'fill', gravity: 'auto' },
          { fetch_format: 'auto', quality: 'auto' },
        ],
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      },
    );
    uploadStream.end(buffer);
  });
};
