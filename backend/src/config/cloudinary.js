import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isAudio = file.mimetype.startsWith('audio/');
    return {
      folder: isAudio ? 'bdaybash/music' : 'bdaybash',
      resource_type: isAudio ? 'video' : 'image', // Cloudinary uses 'video' for audio
      allowed_formats: isAudio
        ? ['mp3', 'wav', 'ogg', 'm4a', 'aac']
        : ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      ...(isAudio ? {} : { transformation: [{ quality: 'auto', fetch_format: 'auto' }] }),
    };
  },
});

export const upload = multer({ storage });
export { cloudinary };
