import express from 'express';
import { deleteFiles, getFile, getFiles, postFile } from '../controllers/fileControllers';
import upload from "../middlewares/file-middleware";

const router = express.Router();

router.get('/', getFiles)
router.get('/:id', getFile)
router.post('/',upload.single('file'),postFile)
router.delete('/:id', deleteFiles)

export default router