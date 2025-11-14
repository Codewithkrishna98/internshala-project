import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import { connectDB } from "./config/db";
import itemsRoutes from "./routes/item";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// Normalize client URL (remove trailing slash if present)
const rawClient = process.env.CLIENT_URL || "http://localhost:3000";
const CLIENT_URL = rawClient.replace(/\/+$/, "");

// Allowed origins
const WHITELIST = [
  CLIENT_URL,
  "http://localhost:3000"
];

// Dynamic CORS handler
const corsOptions = {
  origin: (origin: string | undefined, callback: Function) => {
    if (!origin) return callback(null, true); // allow tools like Postman

    const cleanOrigin = origin.replace(/\/+$/, ""); // remove trailing slashes

    if (WHITELIST.includes(cleanOrigin)) {
      callback(null, true);
    } else {
      console.log("❌ Blocked by CORS:", cleanOrigin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"]
};

// MUST come before routes
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // handle preflight

app.use(express.json());
app.use(cookieParser());

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/items", itemsRoutes);

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on ${PORT}`));
});
