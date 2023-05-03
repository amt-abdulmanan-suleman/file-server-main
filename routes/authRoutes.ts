import express from 'express'
import registerValidation from '../validators/auth'


import { signUp,logIn } from '../controllers/authControllers';
import { validationMiddleware } from '../middlewares/validation-middleware';


const router = express.Router();
router.post('/signup',registerValidation,validationMiddleware,signUp)

router.post('/login',logIn)

export default router;