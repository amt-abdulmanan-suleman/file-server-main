import axios from 'axios'
import { Response, Request } from "express";
import { v2 as cloudinary } from 'cloudinary';
import { transporter } from "../utils/transporter";
import db from "../db";

export const getFiles = async (req: Request, res: Response) => {
  try {
    const result = await db.query('SELECT * FROM files');
    const files = result.rows.map((file: any) => {
      file.url = file.path;
      return file;
    });
    // console.log(files);
    res.json({ files });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  }
};


export const downloadFile = async (req: Request, res: Response) => {
  const fileId = req.params.id;
  const query = 'SELECT name, path, no_of_downloads FROM files WHERE id = $1';
  const values = [fileId];
  try {
    const result = await db.query(query, values);
    const file = result.rows[0];
    await db.query('UPDATE files SET no_of_downloads = $1 WHERE id = $2', [file.no_of_downloads + 1, fileId]);

    // Download the file from the URL
    const response = await axios.get(file.path, { responseType: 'arraybuffer' });

    // Set the appropriate content type based on the file type
    const contentType = getContentType(file.path);

    // Send the file to the client as a download
    res.set('Content-Type', contentType);
    res.set('Content-Disposition', `attachment; filename="${file.name}"`);
    res.send(response.data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  }
};

// Helper function to get the content type based on the file URL
function getContentType(url: string): string {
  const extension = url.split('.').pop();
  if (extension === 'png' || extension === 'jpg' || extension === 'jpeg' || extension === 'gif') {
    return 'image/png';
  } else if (extension === 'mp4' || extension === 'avi' || extension === 'mkv') {
    return 'video/mp4';
  } else if (extension === 'pdf') {
    return 'application/pdf';
  }
  return 'application/octet-stream';
}
export const sendFile = async (req: Request, res: Response) => {
  const { fileId, user_email, receipient_email } = req.body;
  console.log(user_email, receipient_email)
  const query = 'SELECT * FROM files WHERE id = $1';
  const values = [fileId];

  try {
    const result = await db.query(query, values);
    const file = result.rows[0];
    console.log(file)
    const mailOptions = {
      from: user_email,
      to: receipient_email,
      subject: 'File Attachment',
      html: `
        <html>
          <body>
            <h1>Embedded Media</h1>
            ${file.mimetype.startsWith('image/') ? `<img src="${file.path}" alt="Image" />` : ''}
            <br/>
            ${file.mimetype.startsWith('video/') ? `
              <video width="320" height="240" controls>
                <source src="${file.path}" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ` : ''}
            <br/>
            ${file.mimetype === "application/pdf" ? `
              <embed src="${file.path}" type="application/pdf" width="100%" height="600px" />
            ` : ''}
            <br/>
            <a href="${file.path}" download>Download File</a>
          </body>
        </html>
      `,
    };
    await db.query('UPDATE files SET no_of_sent = $1 WHERE id = $2', [file.no_of_sent + 1, fileId]);
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error sending email');
      } else {
        console.log(`Email sent: ${info.response}`);
        res.status(200).send('File sent as email attachment');
      }
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  }
};

export const getFile = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query('SELECT * FROM files WHERE id = $1', [id]);
    res.status(200).json({
      success: true,
      file: rows[0],
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  }
};



export const postFile = async (req: Request, res: Response) => {
  const file = req.file;
  const { id, desc, title } = req.body;
  
  if (!file) {
    return res.status(400).json({ error: "File not provided" });
  }
  
  console.log("first")

  const processUploadResult = async (result:any) => {
    console.log('second')
    
    const query = 'INSERT INTO files (name, path, mimetype, user_id, no_of_downloads, no_of_sent, description) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING name,id';
    const values = [title, result.secure_url, file.mimetype, id, 0, 0, desc];
  
    try {
      const { rows } = await db.query(query, values);
      res.status(200).json({
        id: rows[0].id,
        success: true,
        message: `File uploaded successfully. name: ${rows[0].name}`,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({
          error: error.message,
        });
      }
    }
  };
  if (file.mimetype.startsWith('video/')){
    cloudinary.uploader
    .upload(file.path, 
      { resource_type: "video", 
        public_id: file.filename,
        chunk_size: 6000000,
     })
    .then(result=>console.log(result));
  } else{
    cloudinary.uploader.upload(
      file.path,
      { public_id: file.filename },
      (error, result) => {
        if (error) {
          
          return res.status(500).json({ error: 'Something went wrong during file upload.' });
        }
    
        if (result) {
          processUploadResult(result);
        } else {
          console.log('Something went wrong');
        }
      }
    );
  }
  
};

export const deleteFiles = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM files WHERE id = $1', [id]);
    res.status(200).json({
      success: true,
      message: `File with id ${id} deleted`,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  }
};
