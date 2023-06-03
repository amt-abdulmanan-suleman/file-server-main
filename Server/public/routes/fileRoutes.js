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
const router = express_1.default.Router();
router.get('/', auth_middleware_1.userAuth, fileControllers_1.getFiles);
router.get('/download/:id', auth_middleware_1.userAuth, fileControllers_1.downloadFile);
router.get('/:id', admin_middleware_1.adminAuth, fileControllers_1.getFile);
router.post('/send/', auth_middleware_1.userAuth, fileControllers_1.sendFile);
router.post('/upload', admin_middleware_1.adminAuth, file_middleware_1.default.single('file'), fileControllers_1.postFile);
router.delete('/:id', admin_middleware_1.adminAuth, fileControllers_1.deleteFiles);
exports.default = router;
