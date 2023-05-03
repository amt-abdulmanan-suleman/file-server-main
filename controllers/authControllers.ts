import { Response,Request} from "express"
import {hash} from 'bcryptjs';
import {sign} from 'jsonwebtoken'
import db from "../db";
import { SECRET } from "../config";



interface AuthenticatedRequest extends Request {
    user?: { id: string; email: string; name:string
        created_at:Date };
  }

export const signUp = async(req:Request,res:Response) => {
    const {name, email, password} = req.body;
    try {
        const hashedPassword = await hash(password,10);

        await db.query('insert into users(name,email,password) values ($1, $2, $3)',[name,email,hashedPassword])

        return res.status(201).json({
            success:true,
            message:'Registration Successful'
        })
    } catch (error:unknown) {
        if (error instanceof Error) {
            return res.status(500).json({
                error: error.message
            })
        }
    }
}

export const logIn = async(req:AuthenticatedRequest, res:Response) =>{
    let user = req.user;
    if(!user){
        throw new Error('User not found')
    }

    let payload = {
        id:user.id,
        email:user.email
    }
    try {
        if (!SECRET) {
            throw new Error('Secret key is not defined');
          }
        const token = sign(payload, SECRET)

        return res.status(200).cookie('token',token,{httpOnly:true}).json({
            success:true,
            message:'Logged In'
        })
    } catch (error:unknown) {
        if (error instanceof Error) {
            return res.status(500).json({
                error: error.message
            })
        }
    }
}