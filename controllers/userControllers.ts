import { Response, Request } from "express";

export const getAllUsers = (req:Request,res:Response)=>{
    res.send('get all users')
}

export const getUser = (req:Request,res:Response)=>{
    const {id} = req.params;
    res.send(`get user with id ${id}`)
}

export const updateUser = (req:Request,res:Response)=>{
    const {id} = req.params;
    res.send(`update user with id ${id}`)
}

export const deleteUser = (req:Request,res:Response)=>{
    const {id} = req.params;
    res.send(`Delete user with id ${id}`)
}