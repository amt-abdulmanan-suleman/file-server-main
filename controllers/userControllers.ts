import { Response, Request } from "express";
import db from "../db";

export const getAllUsers = async(req:Request,res:Response)=>{

    try {
        const response =await db.query('SELECT * FROM users');
        res.json(response)
    } catch (error) {
      res.json({message:error})  
    }
}

export const getUser =async (req:Request,res:Response)=>{
    const {id} = req.params;
    res.send(`get user with id ${id}`)
}

export const updateUser = async(req:Request,res:Response)=>{
    const {id} = req.params;
    res.send(`update user with id ${id}`)
}

export const deleteUser = async(req:Request,res:Response)=>{
    const {id} = req.params;
    res.send(`Delete user with id ${id}`)
}