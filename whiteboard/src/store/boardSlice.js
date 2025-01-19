import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  rectangles: [],
  scribbles: [],
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
} = boardSlice.actions;

export default boardSlice.reducer;
