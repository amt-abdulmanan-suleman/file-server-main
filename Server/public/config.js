"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POSTGRES_URL = exports.EMAIL_PWD = exports.EMAIL_USER = exports.SECRET = exports.PASSWORD = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.PORT = process.env.PORT;
exports.PASSWORD = process.env.PASSWORD;
exports.SECRET = process.env.SECRET;
exports.EMAIL_USER = process.env.EMAIL;
exports.EMAIL_PWD = process.env.EMAILPWD;
exports.POSTGRES_URL = process.env.POSTGRES_URL;
