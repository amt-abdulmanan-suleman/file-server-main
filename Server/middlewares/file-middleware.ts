import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { API_KEY, API_SECRET, CLOUD_NAME } from '../config';

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const format = await determineFormat(file);
    return {
      folder: '/tmp',
      format: format
    };
  }
});

const upload = multer({ storage: storage });

async function determineFormat(file: Express.Multer.File): Promise<string> {
  if (file.mimetype.includes('image')) {
    return 'png';
  } else if (file.mimetype.includes('video')) {
    return 'mp4';
  } else if (file.mimetype.includes('pdf')) {
    return 'pdf';
  }
  throw new Error('Invalid file type');
}

export default upload;
