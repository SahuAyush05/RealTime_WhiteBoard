const mongoose = require("mongoose");

const shapeSchema = new mongoose.Schema({
  data: {
    x: Number,
    y: Number,
    width: Number,
    height: Number,
    radius: Number,
    color: String,
    strokeWidth: Number,
    points: [Number],
    radiusX: Number,
    radiusY: Number,
    Dash: [Number],
  },
  id: String,
});

const pageSchema = new mongoose.Schema({
  pageId: String,
  Rectangles: { id: String, data: [shapeSchema] },
  Scribbles: { id: String, data: [shapeSchema] },
  Markers: { id: String, data: [shapeSchema] },
  Circles: { id: String, data: [shapeSchema] },
  Ellipses: { id: String, data: [shapeSchema] },
  Arrows: { id: String, data: [shapeSchema] },
  Lines: { id: String, data: [shapeSchema] },
  Shapes: [{ id: Number, type: String }],
  createdAt: { type: Date, default: Date.now },
});

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pages: [pageSchema],
    roomKey: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "projects" }
);

const Project = mongoose.model("Project", projectSchema);
module.exports = Project;
