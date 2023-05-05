import { Response,Request } from "express";

export const validateAdmin =async(req:Request, res:Response) => {
    res.send(`You're an admin ${req.body.id}`);
}