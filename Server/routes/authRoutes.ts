import express from 'express'
import validator from '../validators/auth'


import { signUp,logIn, logout } from '../controllers/authControllers';
import { validationMiddleware } from '../middlewares/validation-middleware';
import { userAuth } from '../middlewares/auth-middleware';


const router = express.Router();
router.post('/signup',validator.registerValidation,validationMiddleware,signUp)

router.post('/login',validator.loginValidation,validationMiddleware,logIn)
router.get('/logout',userAuth,logout)

export default router;