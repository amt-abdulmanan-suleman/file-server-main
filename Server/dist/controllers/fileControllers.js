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
const transporter_1 = require("../utils/transporter");
const db_1 = __importDefault(require("../db"));
const getFiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.default.query('SELECT * FROM files');
        const files = result.rows.map(file => {
            file.url = `http://${req.headers.host}/${file.path}`;
            return file;
        });
        console.log(files);
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
    const query = 'SELECT name, path,no_of_downloads FROM files WHERE id = $1';
    const values = [fileId];
    try {
        const result = yield db_1.default.query(query, values);
        const file = result.rows[0];
        yield db_1.default.query('update files set no_of_downloads = $1 where id = $2', [file.no_of_downloads + 1, fileId]);
        res.download(file.path);
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
const sendFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fileId, user_email, receipient_email } = req.body;
    const query = 'SELECT * FROM files WHERE id = $1';
    const values = [fileId];
    try {
        const result = yield db_1.default.query(query, values);
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
        yield db_1.default.query('update files set no_of_sent = $1 where id = $2', [file.no_of_sent + 1, fileId]);
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
        const { rows } = yield db_1.default.query('select * from files where id=$1', [id]);
        res.status(200).json({
            success: true,
            file: rows[0]
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
    const query = 'INSERT INTO files (name, path, mimetype, user_id, no_of_downloads, no_of_sent,description) VALUES ($1, $2, $3, $4, $5, $6,$7) RETURNING name';
    const values = [title[0], file.path, file.mimetype, id, 0, 0, desc[0]];
    try {
        const { rows } = yield db_1.default.query(query, values);
        res.status(200).json({
            id: rows[0].id,
            success: true,
            message: `File uploaded successfully. name: ${rows[0].name});`
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
exports.postFile = postFile;
const deleteFiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield db_1.default.query('delete from files where id=$1', [id]);
        res.status(200).json({
            success: true,
            message: `File with id ${id} deleted`
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
