"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_1 = __importDefault(require("passport"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./config");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const fileRoutes_1 = __importDefault(require("./routes/fileRoutes"));
const emailRoutes_1 = __importDefault(require("./routes/emailRoutes"));
require("./middlewares/passport-middleware");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
/* Middleware to parse the body from requests*/
app.use(body_parser_1.default.json({ limit: '10mb' }));
app.use(body_parser_1.default.urlencoded({ limit: '10mb', extended: false }));
app.use(express_1.default.static('uploads'));
app.use('/uploads', express_1.default.static('uploads'));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(passport_1.default.initialize());
app.use('/auth', authRoutes_1.default);
app.use('/user', userRoutes_1.default);
app.use('/admin', adminRoutes_1.default);
app.use('/api/files', fileRoutes_1.default);
app.use('/', emailRoutes_1.default);
app.get('/', (req, res) => {
    res.send("<h1>Welcome to the File Server<h1/>");
});
app.listen(config_1.PORT, () => {
    console.log(`Server Running on Port ${config_1.PORT}`);
});
