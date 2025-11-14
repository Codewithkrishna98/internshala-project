// backend/src/routes/auth.ts
import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { SignOptions, Secret } from "jsonwebtoken";
import User from "../models/User";
import dotenv from "dotenv";
import { verifyJWT } from "../middleware/auth";

dotenv.config();

const router = express.Router();

// Use jsonwebtoken's Secret type so TS accepts the secret
const JWT_SECRET: Secret = (process.env.JWT_SECRET as Secret) || "secret";
const COOKIE_NAME = process.env.COOKIE_NAME || "auth_token";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// Prepare SignOptions with the right type
const jwtOptions: SignOptions = {
  // cast expiresIn to the SignOptions["expiresIn"] type to satisfy TS
  expiresIn: JWT_EXPIRES_IN as unknown as SignOptions["expiresIn"],
};

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "Missing fields" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hash,
      role: role === "admin" ? "admin" : "user",
    });
    await user.save();

    // create JWT (typed)
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      jwtOptions
    );

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
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Missing fields" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      jwtOptions
    );

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
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/logout", (req: Request, res: Response) => {
  res.clearCookie(COOKIE_NAME);
  return res.json({ message: "Logged out" });
});

// For this route we type req to include a user property injected by verifyJWT middleware.
// This avoids the "Property 'user' does not exist on type 'Request'" TS error.
router.get(
  "/me",
  verifyJWT,
  async (req: Request & { user?: any }, res: Response) => {
    // verifyJWT middleware should have attached `user` to req
    return res.json({ user: req.user ?? null });
  }
);

export default router;
