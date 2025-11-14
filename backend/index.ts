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
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

app.use(express.json());
app.use(cookieParser());

// Allow frontend to send cookies
app.use(cors({
   origin: "https://auth-project-bykishan.vercel.app/", credentials: true
}));

app.use("/api/auth", authRoutes);
app.use("/api/items", itemsRoutes);


connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on ${PORT}`));
});
