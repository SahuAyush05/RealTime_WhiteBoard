import { useDispatch } from "react-redux";
import { io } from "socket.io-client";
import { addPage } from "../store/boardSlice";
let socket;

export const connectSocket = (url) => {
  if (!socket) {
    socket = io(url, {
      reconnection: true,
      reconnectionAttempts: 5, 
      timeout: 10000,
    });
    socket.on("connect", () => {
      console.log("Connected to Socket.IO server:", socket.id);
    });
    socket.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server");
    });
    socket.on("connect_error", (error) => {
      console.error("Connection error:", error.message);
    });
    socket.on("joined", (userId) => {
      console.log(`User ${userId} has joined the room`);
    });
  }
  return socket;
};

export const joinRoom = (roomKey, userId) => {
  if (socket) {
    socket.emit("joinRoom", { roomKey, userId });
    console.log(`Joined room: ${roomKey}`);
  } else {
    console.error("Socket connection not established");
  }
};

export const leaveRoom = (roomKey) => {
  if (socket) {
    socket.emit("leaveRoom", { roomKey });
    console.log(`Left room: ${roomKey}`);
  } else {
    console.error("Socket connection not established");
  }
};

export const emitAddPage = (roomKey,projectId) => {
  if (socket) {
    console.log(roomKey);
    socket.emit("addPage", { roomKey,projectId });
  } else {
    console.error("Socket connection not established");
  }
};

export const getSocket = () => socket;
