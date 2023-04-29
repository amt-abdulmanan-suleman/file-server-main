import { Response, Request } from "express";

export const getFiles = async(req:Request,res:Response) =>{
    res.send('get al files')
}

export const getFile = async(req:Request,res:Response) =>{
    res.send(`get a file ${req.params.id}`)
}
export const postFile = async(req:Request,res:Response) =>{
    res.send(`post a file`)
}
export const deleteFiles = async(req:Request,res:Response) =>{
    res.send(`Delete a file ${req.params.id}`)
}