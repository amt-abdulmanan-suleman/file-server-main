"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationMiddleware = void 0;
const express_validator_1 = require("express-validator");
const validationMiddleware = (req, res, next) => {
    let err = (0, express_validator_1.validationResult)(req);
    if (!err.isEmpty()) {
        return res.status(400).json({
            errors: err.array()
        });
    }
    next();
};
exports.validationMiddleware = validationMiddleware;
