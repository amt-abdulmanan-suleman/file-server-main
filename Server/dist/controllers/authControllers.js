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
exports.resetPassword = exports.resetToken = exports.logOut = exports.logIn = exports.signUp = void 0;
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = require("jsonwebtoken");
const db_1 = __importDefault(require("../db"));
const config_1 = require("../config");
const emailControllers_1 = require("./emailControllers");
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@amalitech\.org$/;
    let role;
    if (emailRegex.test(email)) {
        role = "admin";
    }
    else {
        role = "user";
    }
    try {
        const hashedPassword = yield (0, bcryptjs_1.hash)(password, 10);
        const { rows } = yield db_1.default.query("insert into users(name,email,password,role) values ($1, $2, $3, $4) returning id,email", [
            name,
            email,
            hashedPassword,
            role
        ]);
        yield (0, emailControllers_1.sendVerificationEmail)(rows[0].id, rows[0].email);
        return res.status(201).json({
            success: true,
            message: "Verification Token Sent",
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
exports.signUp = signUp;
const logIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let user = req.user;
    if (!user) {
        throw new Error("User not found");
    }
    let payload = {
        id: user.id,
        email: user.email,
    };
    try {
        if (!config_1.SECRET) {
            throw new Error("Secret key is not defined");
        }
        const token = (0, jsonwebtoken_1.sign)(payload, config_1.SECRET);
        return res
            .status(200)
            .json({
            id: user.id,
            token: token,
            success: true,
            message: "Logged In",
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
exports.logIn = logIn;
const logOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return res
            .status(200)
            .json({
            success: true,
            message: 'Logged Out',
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
exports.logOut = logOut;
const resetToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const { rows } = yield db_1.default.query('select id from users where email = $1', [email]);
        if (rows[0]) {
            yield (0, emailControllers_1.sendVerificationEmail)(rows[0].id, email);
            res.status(200).json({
                success: true,
                data: { id: rows[0].id, email },
                message: 'Reset Verification Token Sent'
            });
        }
        else {
            res.status(500).json({
                success: false,
                message: 'Invalid email'
            });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({
                error: error.message,
            });
        }
    }
});
exports.resetToken = resetToken;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { password } = req.body;
    try {
        const hashedPassword = yield (0, bcryptjs_1.hash)(password, 10);
        yield db_1.default.query('update users set password = $1 where id = $2', [hashedPassword, id]);
        res.status(200).json({
            success: true,
            message: 'Password reset successful'
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
exports.resetPassword = resetPassword;
