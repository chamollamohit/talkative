import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", process.env.FRONTEND_URL],
    },
});

export function getSocketIdFromUserId(userId) {
    return userSocketMap[userId];
}

const userSocketMap = {};

io.on("connection", (socket) => {
    console.log("User connected", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) userSocketMap[userId] = socket.id;

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("typing", (receiverId) => {
        const recieverSocketId = getSocketIdFromUserId(receiverId);
        if (recieverSocketId) {
            io.to(recieverSocketId).emit("display-typing", userId);
        }
    });

    socket.on("stopped-typing", (receiverId) => {
        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("hide-typing", userId);
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { app, server, io };
