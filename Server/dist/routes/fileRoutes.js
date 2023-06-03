"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fileControllers_1 = require("../controllers/fileControllers");
const file_middleware_1 = __importDefault(require("../middlewares/file-middleware"));
const admin_middleware_1 = require("../middlewares/admin-middleware");
const auth_middleware_1 = require("../middlewares/auth-middleware");
const path_1 = __importDefault(require("path"));
const router = express_1.default.Router();
router.get('/', auth_middleware_1.userAuth, fileControllers_1.getFiles);
router.get('/download/:id', auth_middleware_1.userAuth, fileControllers_1.downloadFile);
router.get('/:id', admin_middleware_1.adminAuth, fileControllers_1.getFile);
router.post('/send/', auth_middleware_1.userAuth, fileControllers_1.sendFile);
router.post('/upload', admin_middleware_1.adminAuth, file_middleware_1.default.single('file'), fileControllers_1.postFile);
router.delete('/:id', admin_middleware_1.adminAuth, fileControllers_1.deleteFiles);
// Set the correct MIME type for file downloads
router.use('/uploads', express_1.default.static('uploads', {
    setHeaders: (res, filePath) => {
        const ext = path_1.default.extname(filePath);
        const contentType = getContentType(ext);
        res.setHeader('Content-Type', contentType);
    },
}));
exports.default = router;
// Function to determine the MIME type based on file extension
function getContentType(fileExt) {
    switch (fileExt) {
        case '.pdf':
            return 'application/pdf';
        case '.jpg':
        case '.jpeg':
            return 'image/jpeg';
        case '.png':
            return 'image/png';
        case '.gif':
            return 'image/gif';
        // Add more cases for other file types if needed
        default:
            return 'application/octet-stream';
    }
}
