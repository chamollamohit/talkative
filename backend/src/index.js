import express from "express";
import dotenv from "dotenv";
import cookieparser from "cookie-parser";
import cors from "cors";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { server, app, io } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieparser());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: ["http://localhost:5173", process.env.FRONTEND_URL],
        credentials: true,
    }),
);

app.use("/health-check", (req, res) => {
    res.json("System Running fine");
});

// Routes

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

server.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
    connectDB();
});
