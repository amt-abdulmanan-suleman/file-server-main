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
exports.verifyEmail = exports.sendVerificationEmail = void 0;
const db_1 = __importDefault(require("../db"));
const transporter_1 = require("../utils/transporter");
const config_1 = require("../config");
function sendVerificationEmail(userId, email) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = Math.floor(100000 + Math.random() * 900000);
        yield db_1.default.query('INSERT INTO verification_tokens (user_id, email, token) VALUES ($1, $2, $3)', [userId, email, token]);
        const mailOptions = {
            from: config_1.EMAIL_USER,
            to: email,
            subject: 'Verify your email address',
            html: `
      <p>Hello,</p>
      <p>Thank you for signing up! Please this is your verification token:</p>
      <p>${token}</p>
    `,
        };
        yield transporter_1.transporter.sendMail(mailOptions);
    });
}
exports.sendVerificationEmail = sendVerificationEmail;
function verifyEmail(token) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield db_1.default.query('SELECT user_id FROM verification_tokens WHERE token = $1', [token]);
        const { rows } = result;
        if (rows.length === 0) {
            throw new Error('Invalid token');
        }
        const userId = rows[0].user_id;
        yield db_1.default.query('UPDATE users SET isVerified = true WHERE id = $1', [userId]);
        yield db_1.default.query('DELETE FROM verification_tokens WHERE token = $1', [token]);
        return userId;
    });
}
exports.verifyEmail = verifyEmail;
