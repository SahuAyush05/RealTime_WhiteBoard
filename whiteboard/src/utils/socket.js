import { io } from "socket.io-client";
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

export const emitAddPage = (roomKey, projectId) => {
  if (socket) {
    socket.emit("addPage", { roomKey, projectId });
  } else {
    console.error("Socket connection not established");
  }
};

export const addShape = (roomKey, projectId, shape, data, id, pageIdx) => {
  if (socket) {
    socket.emit("addShape", { roomKey, projectId, shape, data, id, pageIdx });
  } else {
    console.log("Socket Connection not established");
  }
};

export const updateShape = ({
  roomKey,
  projectId,
  pageIndex,
  id,
  updatedData,
  shape,
}) => {
  if (socket) {
    socket.emit("updateShape", {
      roomKey,
      projectId,
      pageIndex,
      id,
      updatedData,
      shape,
    });
  } else {
    console.log("Socket connect not established");
  }
};

export const sendShapeData = ({ shapeData, projectId, pageIdx }) => {
  
  if (socket) {
    socket.emit("finalShape", { shapeData, projectId, pageIdx });
  } else {
    console.log("Socket connect not established");
  }
};
export const getSocket = () => socket;
