const Project = require("../model/projectModel");

const updateRectangle = async (
  projectId,
  pageIndex,
  rectangleId,
  updatedData
) => {
  try {
    const { height, width } = updatedData;
    console.log(pageIndex);
    console.log(rectangleId);
    const project = await Project.findOne({ _id: projectId });
    if (project) {
      const rectangle = project.pages[pageIndex].Rectangles.data.find(
        (r) => r.id === rectangleId
      );
      if (rectangle) {
        rectangle.height = height;
        rectangle.width = width;
        await project.save();
      } else {
        console.log(rectangleId);
      }
    }
  } catch (error) {
    console.error("Error updating rectangle:", error);
    throw error;
  }
};

module.exports = { updateRectangle };
