import express from 'express';
import { deleteFiles, downloadFile, getFile, getFiles, postFile, sendFile } from '../controllers/fileControllers';
import upload from "../middlewares/file-middleware";
import { adminAuth } from '../middlewares/admin-middleware';
import { userAuth } from '../middlewares/auth-middleware';
import path from 'path';

const router = express.Router();

router.get('/', userAuth, getFiles);
router.get('/download/:id', userAuth, downloadFile);
router.get('/:id', adminAuth, getFile);
router.post('/send/', userAuth, sendFile);
router.post('/upload', adminAuth, upload.single('file'), postFile);
router.delete('/:id', adminAuth, deleteFiles);

// Set the correct MIME type for file downloads
router.use('/uploads', express.static('uploads', { 
  setHeaders: (res, filePath) => {
    const ext = path.extname(filePath);
    const contentType = getContentType(ext);
    res.setHeader('Content-Type', contentType);
  },
}));

export default router;

// Function to determine the MIME type based on file extension
function getContentType(fileExt:string) {
  switch (fileExt) {
    case '.pdf':
      return 'application/pdf';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.gif':
      return 'image/gif';
    // Add more cases for other file types if needed
    default:
      return 'application/octet-stream';
  }
}
 