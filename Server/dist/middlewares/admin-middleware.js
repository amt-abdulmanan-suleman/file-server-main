"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAuth = void 0;
const passport_1 = __importDefault(require("passport"));
const adminAuth = (req, res, next) => {
    passport_1.default.authenticate("jwt", { session: false }, (err, user, info) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Internal server error" });
        }
        if (!user) {
            return res.status(401).json({ message: "Unauthorized access: you must be logged in" });
        }
        if (user.role !== "admin") {
            return res
                .status(401)
                .json({ message: "Unauthorized access: you must be an admin to perform this action" });
        }
        req.user = user;
        next();
    })(req, res, next);
};
exports.adminAuth = adminAuth;
