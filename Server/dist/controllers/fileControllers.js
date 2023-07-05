"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFiles = exports.postFile = exports.getFile = exports.sendFile = exports.downloadFile = exports.getFiles = void 0;
const axios_1 = __importDefault(require("axios"));
const cloudinary_1 = require("cloudinary");
const transporter_1 = require("../utils/transporter");
const db_1 = __importDefault(require("../db"));
const getFiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.default.query('SELECT * FROM files');
        const files = result.rows.map((file) => {
            file.url = file.path;
            return file;
        });
        // console.log(files);
        res.json({ files });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({
                error: error.message,
            });
        }
    }
});
exports.getFiles = getFiles;
const downloadFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fileId = req.params.id;
    const query = 'SELECT name, path, no_of_downloads FROM files WHERE id = $1';
    const values = [fileId];
    try {
        const result = yield db_1.default.query(query, values);
        const file = result.rows[0];
        yield db_1.default.query('UPDATE files SET no_of_downloads = $1 WHERE id = $2', [file.no_of_downloads + 1, fileId]);
        // Download the file from the URL
        const response = yield axios_1.default.get(file.path, { responseType: 'arraybuffer' });
        // Set the appropriate content type based on the file type
        const contentType = getContentType(file.path);
        // Send the file to the client as a download
        res.set('Content-Type', contentType);
        res.set('Content-Disposition', `attachment; filename="${file.name}"`);
        res.send(response.data);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({
                error: error.message,
            });
        }
    }
});
exports.downloadFile = downloadFile;
// Helper function to get the content type based on the file URL
function getContentType(url) {
    const extension = url.split('.').pop();
    if (extension === 'png' || extension === 'jpg' || extension === 'jpeg' || extension === 'gif') {
        return 'image/png';
    }
    else if (extension === 'mp4' || extension === 'avi' || extension === 'mkv') {
        return 'video/mp4';
    }
    else if (extension === 'pdf') {
        return 'application/pdf';
    }
    return 'application/octet-stream';
}
const sendFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fileId, user_email, receipient_email } = req.body;
    console.log(user_email, receipient_email);
    const query = 'SELECT * FROM files WHERE id = $1';
    const values = [fileId];
    try {
        const result = yield db_1.default.query(query, values);
        const file = result.rows[0];
        console.log(file);
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
        yield db_1.default.query('UPDATE files SET no_of_sent = $1 WHERE id = $2', [file.no_of_sent + 1, fileId]);
        transporter_1.transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error sending email');
            }
            else {
                console.log(`Email sent: ${info.response}`);
                res.status(200).send('File sent as email attachment');
            }
        });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({
                error: error.message,
            });
        }
    }
});
exports.sendFile = sendFile;
const getFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const { rows } = yield db_1.default.query('SELECT * FROM files WHERE id = $1', [id]);
        res.status(200).json({
            success: true,
            file: rows[0],
        });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({
                error: error.message,
            });
        }
    }
});
exports.getFile = getFile;
const postFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    const { id, desc, title } = req.body;
    if (!file) {
        return res.status(400).json({ error: "File not provided" });
    }
    console.log("first");
    const processUploadResult = (result) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('second');
        const query = 'INSERT INTO files (name, path, mimetype, user_id, no_of_downloads, no_of_sent, description) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING name,id';
        const values = [title, result.secure_url, file.mimetype, id, 0, 0, desc];
        try {
            const { rows } = yield db_1.default.query(query, values);
            res.status(200).json({
                id: rows[0].id,
                success: true,
                message: `File uploaded successfully. name: ${rows[0].name}`,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({
                    error: error.message,
                });
            }
        }
    });
    if (file.mimetype.startsWith('video/')) {
        cloudinary_1.v2.uploader
            .upload(file.path, { resource_type: "video",
            public_id: file.filename,
            chunk_size: 6000000,
        })
            .then(result => console.log(result));
    }
    else {
        cloudinary_1.v2.uploader.upload(file.path, { public_id: file.filename }, (error, result) => {
            if (error) {
                return res.status(500).json({ error: 'Something went wrong during file upload.' });
            }
            if (result) {
                processUploadResult(result);
            }
            else {
                console.log('Something went wrong');
            }
        });
    }
});
exports.postFile = postFile;
const deleteFiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield db_1.default.query('DELETE FROM files WHERE id = $1', [id]);
        res.status(200).json({
            success: true,
            message: `File with id ${id} deleted`,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({
                error: error.message,
            });
        }
    }
});
exports.deleteFiles = deleteFiles;
