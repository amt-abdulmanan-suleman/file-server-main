import {check} from 'express-validator';
import { Request } from 'express';
import db from '../db';
import { compare } from 'bcryptjs';
interface User {
    id: number;
    name: string;
    email: string;
    password: string;
  }
const password = check('password').isLength({min:6, max:15}).withMessage('Password has to be between 6 and 15 chars')
const email = check('email').isEmail().withMessage('Please provide a valid email')
const emailExists = check('email').custom(async (value)=>{
    const {rows} = await db.query('SELECT * FROM users WHERE email = $1',[value])

    if(rows.length){
        throw new Error('User already exists')
    }
})
const name = check('name').isLength({min:10,max:50}).withMessage('Name has to be between 10 and 50 chars long')


const validLoginFields = check('email').custom(async(value,{req})=>{
    const user = await db.query('SELECT * FROM users WHERE email = $1',[value])

    if(!user.rows.length){
        throw new Error('Email doesnot exists')
    }

    const validPassword = await compare(req.body.password,user.rows[0].password);
    if(!validPassword){
        throw new Error("Wrong password")
    }
    req.user = user.rows[0] as User
})

const register = {
    registerValidation:[name,password,email,emailExists],
    loginValidation:[validLoginFields]
}

export default register;