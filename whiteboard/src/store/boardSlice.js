import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pen: [],
  arrow: [],
  marker: [],
  Circles: [],
  Ellipses: [],
  rectangles: [],
  scribbles: [],
  Arrows:[],
  strokeWidth: 4,
  strokeColor: "#000000",
  shapes: [],
};

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    setStrokeWidth: (state, action) => {
      state.strokeWidth = action.payload;
      console.log(state.strokeWidth);
    },
    setStrokeColor: (state, action) => {
      state.strokeColor = action.payload;
    },
    addRectangle: (state, action) => {
      state.rectangles.push(action.payload);
      state.shapes.push({ id: action.payload.id, type: "rect" });
    },
    updateRectangle: (state, action) => {
      const { id, height, width } = action.payload;
      const rectangle = state.rectangles.find((rect) => rect.id === id);
      if (rectangle) {
        rectangle.height = height;
        rectangle.width = width;
      }
    },
    addScribble: (state, action) => {
      state.scribbles.push(action.payload);
      state.shapes.push({ id: action.payload.id, type: "scribble" });
    },
    updateScribble: (state, action) => {
      const { id, points } = action.payload;
      const scribble = state.scribbles.find((scrib) => scrib.id === id);
      if (scribble) {
        scribble.points = points;
      }
    },
    addMarker: (state, action) => {
      state.marker.push(action.payload);
      state.shapes.push({ id: action.payload.id, type: "marker" });
    },
    updateMarker: (state, action) => {
      const { id, points } = action.payload;
      const mark = state.marker.find((mark) => mark.id === id);
      if (mark) {
        mark.points = points;
      }
    },
    addCircle: (state, action) => {
      state.Circles.push(action.payload);
      state.shapes.push({ id: action.payload.id, type: "circle" });
    },
    updateCircle: (state, action) => {
      const { id, radius } = action.payload;
      const circle = state.Circles.find((c) => c.id === id);
      if (circle) {
        circle.radius = radius;
      }
    },
    addEllipse: (state, action) => {
      state.Ellipses.push(action.payload);
      state.shapes.push({ id: action.payload.id, type: "ellipse" });
    },
    updateEllipse: (state, action) => {
      const { id, radiusX, radiusY } = action.payload;
      const ellipse = state.Ellipses.find((t) => t.id === id);
      if (ellipse) {
        ellipse.radiusX = radiusX;
        ellipse.radiusY = radiusY;
      }
    },
    addArrow: (state, action) => {
      state.Arrows.push(action.payload);
    },
    updateArrow: (state, action) => {
      const { id, points } = action.payload;
      const arrow = state.Arrows.find((a) => a.id === id);
      if (arrow) {
        arrow.points = points;
      }
    },
    undoLastShape: (state) => {
      const lastShape = state.shapes.pop();
      if (!lastShape) return;

      switch (lastShape.type) {
        case "rect":
          state.rectangles = state.rectangles.filter(
            (rect) => rect.id !== lastShape.id
          );
          break;
        case "scribble":
          state.scribbles = state.scribbles.filter(
            (scribble) => scribble.id !== lastShape.id
          );
          break;
        case "marker":
          state.marker = state.marker.filter(
            (mark) => mark.id !== lastShape.id
          );
          break;
        default:
          break;
      }
    },
  },
});

export const {
  setStrokeWidth,
  setStrokeColor,
  addRectangle,
  updateRectangle,
  addScribble,
  updateScribble,
  undoLastShape,
  addMarker,
  updateMarker,
  addEllipse,
  addCircle,
  updateCircle,
  updateEllipse,
  addArrow,
  updateArrow
} = boardSlice.actions;

export default boardSlice.reducer;
