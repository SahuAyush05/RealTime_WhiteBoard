const { v4: uuid } = require("uuid");
const Project = require("../model/projectModel");
const {getSocketInstance}=require("../sockets/projectSockets")
const addPageToProject = async (req, res) => {
  console.log("Add page request received:", req.body);
  const { roomKey } = req.body;

  if (!roomKey) {
    return res.status(400).json({ error: "roomKey is required" });
  }

  try {
    const project = await Project.findOne({ roomKey });

    if (!project) {
      return res.status(404).json({ error: "No project found with the given roomKey" });
    }

    const newPage = {
      pageId: uuid(),
      Rectangles: [],
      Scribbles: [],
      Marker: [],
      Circles: [],
      Ellipses: [],
      Arrows: [],
      Lines: [],
      Shapes: [],
      createdAt: new Date(),
    };

    project.pages.push(newPage);
    await project.save();

    // Emit an event if sockets are being used
    // const io = getSocketInstance();
    // io.emit("pageAdded", { projectId: project._id, newPage });

    res.status(200).json({
      message: "Page added successfully",
      newPage,
    });
  } catch (error) {
    console.error("Error adding page to project:", error);
    res.status(500).json({ error: "Failed to add page to project" });
  }
};

module.exports = {
  addPageToProject,
};
