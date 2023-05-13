import { Response, Request } from "express";
import db from "../db";

export const getAllUsers = async(req:Request,res:Response)=>{

    try {
        const {rows} = await db.query('SELECT id,name,email,created_at FROM users');
        return res.status(200).json({
            success:true,
            users:rows
        })
    } catch (error) {
      res.json({message:error})  
    }
}

export const getUser =async (req:Request,res:Response)=>{
    const {id} = req.params;
    try {
        const {rows} = await db.query('select * from users where id=$1',[id]);
        res.status(200).json({
            success:true,
            user:rows[0]
        })
    } catch (error: unknown) {
        if (error instanceof Error) {
          return res.status(500).json({
            error: error.message,
          });
        }
    }
}

export const updateUser = async(req:Request,res:Response)=>{
    const {id} = req.params;
    res.send(`update user with id ${id}`)
}

export const deleteUser = async(req:Request,res:Response)=>{
    const {id} = req.params;
    res.send(`Delete user with id ${id}`)
}