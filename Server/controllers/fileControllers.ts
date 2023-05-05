import { Response, Request } from "express";
import db from "../db";



export const getFiles = async(req:Request,res:Response) =>{
    res.send('get al files')
}

export const getFile = async(req:Request,res:Response) =>{
    res.send(`get a file ${req.params.id}`)
}


export const postFile = async(req:Request,res:Response) =>{
    const file = req.file;
    const {id} = req.body;
    const query = 'INSERT INTO files (name, path, mimetype, user_id, no_of_downloads, no_of_sent) VALUES ($1, $2, $3, $4, $5, $6) RETURNING name';
    const values = [file?.filename, file?.path, file?.mimetype,id,0,0];
    try {
        const{rows} = await db.query(query,values)

        res.status(200).json({
            success:true,
            message:`File uploaded successfully. name: ${rows[0].name});`
        })
    } catch (error: unknown) {
        if (error instanceof Error) {
          return res.status(500).json({
            error: error.message,
          });
        }
    }
}
export const deleteFiles = async(req:Request,res:Response) =>{
    res.send(`Delete a file ${req.params.id}`)
}