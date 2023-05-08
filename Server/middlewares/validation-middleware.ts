import { validationResult } from "express-validator";
import { Request,Response,NextFunction } from "express";



export const validationMiddleware = (req:Request,res:Response,next:NextFunction) =>{
    let err = validationResult(req)

    if(!err.isEmpty()){
        return res.status(400).json({
            errors:err.array()
        })
    }
    next()
}