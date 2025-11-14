"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.verifyJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET || "secret";
const verifyJWT = (req, res, next) => {
    // token is in httpOnly cookie
    const token = req.cookies?.[process.env.COOKIE_NAME || "auth_token"];
    if (!token)
        return res.status(401).json({ message: "No token, unauthorized" });
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        return res.status(401).json({ message: "Token invalid" });
    }
};
exports.verifyJWT = verifyJWT;
const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.user)
            return res.status(401).json({ message: "Unauthorized" });
        if (req.user.role !== role)
            return res.status(403).json({ message: "Forbidden" });
        next();
    };
};
exports.requireRole = requireRole;
