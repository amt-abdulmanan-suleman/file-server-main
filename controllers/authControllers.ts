import { Response,Request} from "express"
import {hash} from 'bcryptjs'
import db from "../db";

interface MyError{
    code:number;
    message:string
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

export const logIn = async(req:Request, res:Response) =>{
    const {email, phone} = req.body;
    res.send(`info:${email},${phone}`)
}