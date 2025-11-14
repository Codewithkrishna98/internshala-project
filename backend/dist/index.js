"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const db_1 = require("./config/db");
const item_1 = __importDefault(require("./routes/item"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Allow frontend to send cookies
app.use((0, cors_1.default)({
    origin: "http://localhost:3000", credentials: true
}));
app.use("/api/auth", auth_1.default);
app.use("/api/items", item_1.default);
(0, db_1.connectDB)().then(() => {
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
});
