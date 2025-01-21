import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  rectangles: [],
  circles: [],
  ellipses: [],
};

const shapeSlice = createSlice({
  name: "shapes",
  initialState,
  reducers: {
    addRectangle: (state, action) => {
      state.rectangles.push(action.payload);
    },
    updateRectangle: (state, action) => {
      const { id, height, width } = action.payload;
      const rectangle = state.rectangles.find((rect) => rect.id === id);
      if (rectangle) {
        rectangle.height = height;
        rectangle.width = width;
      }
    },
    addCircle: (state, action) => {
      state.circles.push(action.payload);
    },
    updateCircle: (state, action) => {
      const { id, radius } = action.payload;
      const circle = state.circles.find((circle) => circle.id === id);
      if (circle) {
        circle.radius = radius;
      }
    },
    addEllipse: (state, action) => {
      state.ellipses.push(action.payload);
    },
    updateEllipse: (state, action) => {
      const { id, radiusX, radiusY } = action.payload;
      const ellipse = state.ellipses.find((t) => t.id === id);
      if (ellipse) {
        ellipse.radiusX = radiusX;
        ellipse.radiusY = radiusY;
      }
    },
  },
});

export const { addRectangle, updateRectangle, addCircle, updateCircle, addEllipse, updateEllipse } = shapeSlice.actions;
export default shapeSlice.reducer;