import { Response, Request } from "express";
import { transporter } from "../utils/transporter";
import db from "../db";



export const getFiles = async(req:Request,res:Response) =>{
    try {
        
        const result = await db.query('SELECT * FROM files');
        const files = result.rows.map(file => {
          file.url = `http://${req.headers.host}/${file.path}`
          return file
        });
        res.json({ files });
      } catch (error: unknown) {
        if (error instanceof Error) {
          return res.status(500).json({
            error: error.message,
          });
        }
    }
}

export const downloadFile = async(req:Request,res:Response) =>{
    const fileId = req.params.id;
    const query = 'SELECT name, path,no_of_downloads FROM files WHERE id = $1';
    const values = [fileId];
    try {
        const result = await db.query(query, values);
        const file = result.rows[0];
        await db.query('update files set no_of_downloads = $1 where id = $2',[file.no_of_downloads + 1,fileId]);
        res.download(file.path);
    } catch (error: unknown) {
        if (error instanceof Error) {
          return res.status(500).json({
            error: error.message,
          });
        }
    }
}

export const sendFile =async (req:Request,res:Response) => {
    const {fileId,user_email,receipient_email} = req.body
    const query = 'SELECT * FROM files WHERE id = $1';
    const values = [fileId];

    try {
        const result = await db.query(query,values);
        const file = result.rows[0];
        const filePath = file.path;
        const mailOptions = {
            from: user_email,
            to: receipient_email,
            subject: 'File Attachment',
            attachments: [
            {
                filename: file.name,
                path: filePath,
            },
            ],
        };
        await db.query('update files set no_of_sent = $1 where id = $2',[file.no_of_sent + 1,fileId])
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
            console.error(err);
            res.status(500).send('Error sending email');
            } else {
            console.log(`Email sent: ${info.response}`);
            res.status(200).send('File sent as email attachment');
            }
        });
    }catch (error: unknown) {
        if (error instanceof Error) {
          return res.status(500).json({
            error: error.message,
          });
        }
    }
}

export const getFile =async (req:Request,res:Response)=>{
  const {id} = req.params;
  try {
      const {rows} = await db.query('select * from files where id=$1',[id]);
      res.status(200).json({
          success:true,
          file:rows[0]
      })
  } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({
          error: error.message,
        });
      }
  }
}

export const postFile = async(req:Request,res:Response) =>{
    const file = req.file;
    const {id,desc,title} = req.body;
    if (!file) {
      return res.status(400).json({ error: "File not provided" });
    }
    const query = 'INSERT INTO files (name, path, mimetype, user_id, no_of_downloads, no_of_sent,description) VALUES ($1, $2, $3, $4, $5, $6,$7) RETURNING name';
    const values = [title[0], file.path, file.mimetype,id,0,0,desc[0]];
    try {
        const{rows} = await db.query(query,values)
        res.status(200).json({
            id:rows[0].id,
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
    const {id} = req.params;

    try{
      await db.query('delete from files where id=$1',[id]);
      res.status(200).json({
        success:true,
        message:`File with id ${id} deleted`
      })
    }catch (error: unknown) {
        if (error instanceof Error) {
          return res.status(500).json({
            error: error.message,
          });
        }
    }
}