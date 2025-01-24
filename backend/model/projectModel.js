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
  pageID: String,
  Rectangles: [shapeSchema],
  Scribbles: [shapeSchema],
  Markers: [shapeSchema],
  Circles: [shapeSchema],
  Ellipses: [shapeSchema],
  Arrows: [shapeSchema],
  Lines: [shapeSchema],
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
