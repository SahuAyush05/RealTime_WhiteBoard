const Project = require("../model/projectModel");
const { v4: uuid } = require("uuid");
const { getSocketInstance } = require("../sockets/projectSockets");
function generateRoomKey() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}
const createProject = async (req, res) => {
  console.log("Request received:", req.body);
  const { userId, name } = req.body;

  if (!userId || !name) {
    return res.status(400).json({ error: "userId and name are required" });
  }

  try {
    const roomKey = generateRoomKey();
    const newProject = await Project.create({
      name,
      userId,
      pages: [
        {
          pageId: uuid(),
          Rectangles:{ id: uuid(), data: [] },
          Scribbles:{ id: uuid(), data: [] },
          Markers: { id: uuid(), data: [] },
          Circles: { id: uuid(), data: [] },
          Ellipses: { id: uuid(), data: [] },
          Arrows: { id: uuid(), data: [] },
          Lines: { id: uuid(), data: [] },
          Shapes:[],
          createdAt: new Date(),
        },
      ],
      roomKey,
    });

    // const io = getSocketInstance();
    // io.emit("projectCreated", { projectId: newProject._id, roomKey });
    res.status(200).json({
      message: "Project created successfully",
      _id: newProject._id,
      roomKey,
      pages: newProject.pages,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ error: "Failed to create project" });
  }
};

const joinProject = async (req, res) => {
  console.log("Join session request received:", req.query);
  const { roomKey } = req.query;

  if (!roomKey) {
    return res.status(400).json({ error: "roomKey is required" });
  }

  try {
    const project = await Project.findOne({ roomKey });

    if (!project) {
      return res
        .status(404)
        .json({ error: "No project found with the given roomKey" });
    }

    res.status(200).json({
      message: "Session joined successfully",
      project,
    });
  } catch (error) {
    console.error("Error joining session:", error);
    res.status(500).json({ error: "Failed to join session" });
  }
};

module.exports = {
  createProject,
  joinProject,
};
