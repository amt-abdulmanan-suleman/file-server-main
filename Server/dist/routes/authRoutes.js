"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../validators/auth"));
const authControllers_1 = require("../controllers/authControllers");
const validation_middleware_1 = require("../middlewares/validation-middleware");
const auth_middleware_1 = require("../middlewares/auth-middleware");
const router = express_1.default.Router();
router.post('/signup', auth_1.default.registerValidation, validation_middleware_1.validationMiddleware, authControllers_1.signUp);
router.post('/login', auth_1.default.loginValidation, validation_middleware_1.validationMiddleware, authControllers_1.logIn);
router.post('/logout', auth_middleware_1.userAuth, authControllers_1.logOut);
router.post('/reset-token', authControllers_1.resetToken);
router.post('/reset-password/:id', authControllers_1.resetPassword);
exports.default = router;
