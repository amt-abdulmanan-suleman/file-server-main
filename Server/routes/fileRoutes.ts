import express from 'express';
import { deleteFiles, downloadFile, getFile, getFiles, postFile,sendFile } from '../controllers/fileControllers';
import upload from "../middlewares/file-middleware";
import { adminAuth } from '../middlewares/admin-middleware';
import { userAuth } from '../middlewares/auth-middleware';

const router = express.Router();

router.get('/',userAuth, getFiles)
router.get('/download/:id',userAuth,downloadFile)
router.get('/:id',adminAuth,getFile)
router.post('/send/:id',userAuth,sendFile)
router.post('/upload',adminAuth,upload.single('file'),postFile)
router.delete('/:id',adminAuth, deleteFiles)


export default router