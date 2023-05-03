import {check} from 'express-validator';
import db from '../db';


const password = check('password').isLength({min:6, max:15}).withMessage('Password has to be between 6 and 15 chars')
const email = check('email').isEmail().withMessage('Please provide a valid email')
const emailExists = check('email').custom(async (value)=>{
    const {rows} = await db.query('SELECT * FROM users WHERE email = $1',[value])

    if(rows.length){
        throw new Error('User already exists')
    }
})
const name = check('name').isLength({min:10,max:50}).withMessage('Name has to be between 10 and 50 chars long')

const register = {registerValidation:[name,password,email,emailExists]}

export default register.registerValidation