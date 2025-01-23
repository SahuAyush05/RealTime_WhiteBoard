const { Server, Socket } = require("socket.io");
const Project = require("../model/projectModel");
const { v4: uuid } = require('uuid');
let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // Client origin
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`New client connected: ${socket.id}`);

    socket.on("joinRoom", ({ roomKey, userId }) => {
      socket.join(roomKey);
      socket.to(roomKey).emit("joined", userId);
      console.log(`User ${userId} joined room ${roomKey}`);
    });

    socket.on("whiteboardUpdate", ({ roomKey, data }) => {
      socket.to(roomKey).emit("whiteboardUpdate", data);
    });
    socket.on("addPage", async ({ roomKey, projectId }) => {
      try {
        if(!projectId){
          console.log("no project id");
        }
        console.log(roomKey,projectId);
        const project = await Project.findById(projectId);
        if (!project) {
          return socket.emit("error", { message: "Project not found" });
        }
        const newPage = {
          id: uuid(),
          Rectangles: [],
          Scribbles: [],
          Markers: [],
          Circles: [],
          Ellipses: [],
          Arrows: [],
          Lines: [],
          Shapes: [],
        };
        project.pages.push(newPage);
        await project.save();
        io.to(roomKey).emit("pageAdded", {
          newPage,
          pages: project.pages,
        });
      } catch (err) {
        console.error(err);
        socket.emit("error", { message: "Failed to add page" });
      }
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getSocketInstance = () => io;

module.exports = { initializeSocket, getSocketInstance };
