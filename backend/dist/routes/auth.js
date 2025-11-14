"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/auth.ts
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = require("../middleware/auth");
dotenv_1.default.config();
const router = express_1.default.Router();
// Use jsonwebtoken's Secret type so TS accepts the secret
const JWT_SECRET = process.env.JWT_SECRET || "secret";
const COOKIE_NAME = process.env.COOKIE_NAME || "auth_token";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
// Prepare SignOptions with the right type
const jwtOptions = {
    // cast expiresIn to the SignOptions["expiresIn"] type to satisfy TS
    expiresIn: JWT_EXPIRES_IN,
};
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password)
            return res.status(400).json({ message: "Missing fields" });
        const existing = await User_1.default.findOne({ email });
        if (existing)
            return res.status(400).json({ message: "User already exists" });
        const salt = await bcryptjs_1.default.genSalt(10);
        const hash = await bcryptjs_1.default.hash(password, salt);
        const user = new User_1.default({
            name,
            email,
            password: hash,
            role: role === "admin" ? "admin" : "user",
        });
        await user.save();
        // create JWT (typed)
        const token = jsonwebtoken_1.default.sign({ id: user._id, name: user.name, email: user.email, role: user.role }, JWT_SECRET, jwtOptions);
        // set cookie
        res.cookie(COOKIE_NAME, token, {
            httpOnly: true,
            sameSite: "lax",
            // secure: true, // enable when using https
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        });
        return res.json({
            message: "Registered",
            user: { name: user.name, email: user.email, role: user.role },
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
});
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ message: "Missing fields" });
        const user = await User_1.default.findOne({ email });
        if (!user)
            return res.status(400).json({ message: "Invalid credentials" });
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ message: "Invalid credentials" });
        const token = jsonwebtoken_1.default.sign({ id: user._id, name: user.name, email: user.email, role: user.role }, JWT_SECRET, jwtOptions);
        res.cookie(COOKIE_NAME, token, {
            httpOnly: true,
            sameSite: "lax",
            // secure: true,
            maxAge: 1000 * 60 * 60 * 24 * 7,
        });
        return res.json({
            message: "Logged in",
            user: { name: user.name, email: user.email, role: user.role },
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
});
router.post("/logout", (req, res) => {
    res.clearCookie(COOKIE_NAME);
    return res.json({ message: "Logged out" });
});
// For this route we type req to include a user property injected by verifyJWT middleware.
// This avoids the "Property 'user' does not exist on type 'Request'" TS error.
router.get("/me", auth_1.verifyJWT, async (req, res) => {
    // verifyJWT middleware should have attached `user` to req
    return res.json({ user: req.user ?? null });
});
exports.default = router;
