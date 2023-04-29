import express from 'express'
import { validateAdmin } from '../controllers/adminControllers';

const router = express.Router();

router.post('/valid',validateAdmin)

export default router