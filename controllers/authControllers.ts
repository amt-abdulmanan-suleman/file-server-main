import { Response,Request } from "express"

export const signUp = async(req:Request,res:Response) => {
    const {name,email, phone} = req.body;
    res.send(`info: ${name},${email},${phone}`)
}

export const logIn = async(req:Request, res:Response) =>{
    const {email, phone} = req.body;
    res.send(`info:${email},${phone}`)
}