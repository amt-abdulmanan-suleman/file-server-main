import express from 'express'
import validator from '../validators/auth'


import { signUp,logIn } from '../controllers/authControllers';
import { validationMiddleware } from '../middlewares/validation-middleware';


const router = express.Router();
router.post('/signup',validator.registerValidation,validationMiddleware,signUp)

router.post('/login',validator.loginValidation,validationMiddleware,logIn)

export default router;