import express from 'express';
import { deleteFiles, getFile, getFiles, postFile } from '../controllers/fileControllers';

const router = express.Router();

router.get('/',getFiles)
router.get('/:id',getFile)
router.post('/',postFile)
router.delete('/:id',deleteFiles)

export default router