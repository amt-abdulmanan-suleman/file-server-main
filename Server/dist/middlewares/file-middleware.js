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
const cloudinary_1 = require("cloudinary");
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const config_1 = require("../config");
cloudinary_1.v2.config({
    cloud_name: config_1.CLOUD_NAME,
    api_key: config_1.API_KEY,
    api_secret: config_1.API_SECRET
});
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: (req, file) => __awaiter(void 0, void 0, void 0, function* () {
        const format = yield determineFormat(file);
        return {
            folder: '/tmp',
            format: format
        };
    })
});
const upload = (0, multer_1.default)({ storage: storage });
function determineFormat(file) {
    return __awaiter(this, void 0, void 0, function* () {
        if (file.mimetype.startsWith('image/')) {
            return 'png';
        }
        else if (file.mimetype.startsWith('video/')) {
            return 'mp4';
        }
        else if (file.mimetype === "application/pdf") {
            return 'pdf';
        }
        throw new Error('Invalid file type');
    });
}
exports.default = upload;
