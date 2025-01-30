const { Server, Socket } = require("socket.io");
const Project = require("../model/projectModel");
const { v4: uuid } = require("uuid");
let io;
const { updateRectangle } = require("../controllers/shapeController");

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
        if (!projectId) {
          console.log("no project id");
        }
        console.log(roomKey, projectId);
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

    socket.on(
      "addShape",
      async ({ roomKey, projectId, shape, data, id, pageIdx }) => {
        try {
          if (
            !projectId ||
            !roomKey ||
            pageIdx === undefined ||
            shape === undefined
          ) {
            console.log("error hereeeee", pageIdx);
            return socket.emit("error", {
              message: "Missing required parameters",
            });
          }
          console.log(data);
          socket.broadcast.to(roomKey).emit("addShapeRes", {
            data,
            id,
            shape,
          });
        } catch (error) {
          console.error("Error in addShape:", error);
          socket.emit("error", { message: `Failed to add ${shape}` });
        }
      }
    );

    socket.on(
      "updateShape",
      async ({
        roomKey,
        projectId,
        pageIndex,
        id,
        updatedData,
        shape,
      }) => {
        try {
          if (!projectId || !id || pageIndex === undefined) {
            return socket.emit("error", {
              message: "Invalid update shape data",
            });
          }
          socket.broadcast.to(roomKey).emit("updateShapeRes", {
            updatedData,
            shape,
            id,
            pageIndex,
          });
        } catch (error) {
          console.error("Error in updateShape:", error.message);
          socket.emit("error", { message: "Failed to update shape" });
        }
      }
    );
    socket.on("finalShape", async ({ shapeData, projectId,pageIdx }) => {
      type = shapeData.type;
      data = shapeData.data;
      const project = await Project.findById(projectId);
      if (!project) {
        return socket.emit("error", { message: "Project not found" });
      }
      switch (type) {
        case "Rectangle": {
          const updateResult = await Project.updateOne(
            { _id: projectId, [`pages.${pageIdx}`]: { $exists: true } },
            { $push: { [`pages.${pageIdx}.Rectangles.data`]: data } }
          );
          break;
        }
        default:
          return socket.emit("error", {
            message: "Unsupported shape type",
          });
      }
      await project.save();
    });
    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getSocketInstance = () => io;

module.exports = { initializeSocket, getSocketInstance };
