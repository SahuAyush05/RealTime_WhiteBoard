import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuid } from "uuid";

const initialState = {
  pages: [
    {
      id: uuid(),
      rectangles: [],
      scribbles: [],
      marker: [],
      Circles: [],
      Ellipses: [],
      Arrows: [],
      texts: [],
      images: [],
      shapes: [],
    },
  ],
  activePageIndex: 0,
  strokeWidth: 4,
  strokeColor: "#000000",
};

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    addPage(state, action) {
      state.pages.push({
        id: action.payload.id,
        rectangles: [],
        scribbles: [],
        marker: [],
        Circles: [],
        Ellipses: [],
        Arrows: [],
        texts: [],
        images: [],
        shapes: [],
      });
    },
    setActivePage(state, action) {
      state.activePageIndex = action.payload;
    },
    setStrokeWidth(state, action) {
      state.strokeWidth = action.payload;
    },
    setStrokeColor(state, action) {
      state.strokeColor = action.payload;
    },
    addRectangle(state, action) {
      const page = state.pages[state.activePageIndex];
      page.rectangles.push(action.payload);
      page.shapes.push({ id: action.payload.id, type: "rect" });
    },
    updateRectangle(state, action) {
      const { id, height, width} = action.payload;
      const rectangle = state.pages[state.activePageIndex].rectangles.find((rect) => rect.id === id);
      if (rectangle) {
        rectangle.height = height;
        rectangle.width = width;
      }
    },
    addScribble(state, action) {
      const page = state.pages[state.activePageIndex];
      page.scribbles.push(action.payload);
      page.shapes.push({ id: action.payload.id, type: "scribble" });
    },
    updateScribble(state, action) {
      const { id, points } = action.payload;
      const scribble = state.pages[state.activePageIndex].scribbles.find((scrib) => scrib.id === id);
      if (scribble) {
        scribble.points = points;
      }
    },
    addMarker(state, action) {
      const page = state.pages[state.activePageIndex];
      page.marker.push(action.payload);
      page.shapes.push({ id: action.payload.id, type: "marker" });
    },
    updateMarker(state, action) {
      const { id, points } = action.payload;
      const marker = state.pages[state.activePageIndex].marker.find((mark) => mark.id === id);
      if (marker) {
        marker.points = points;
      }
    },
    addCircle(state, action) {
      const page = state.pages[state.activePageIndex];
      page.Circles.push(action.payload);
      page.shapes.push({ id: action.payload.id, type: "circle" });
    },
    updateCircle(state, action) {
      const { id, radius } = action.payload;
      const circle = state.pages[state.activePageIndex].Circles.find((c) => c.id === id);
      if (circle) {
        circle.radius = radius;
      }
    },
    addEllipse(state, action) {
      const page = state.pages[state.activePageIndex];
      page.Ellipses.push(action.payload);
      page.shapes.push({ id: action.payload.id, type: "ellipse" });
    },
    updateEllipse(state, action) {
      const { id, radiusX, radiusY} = action.payload;
      const ellipse = state.pages[state.activePageIndex].Ellipses.find((t) => t.id === id);
      if (ellipse) {
        ellipse.radiusX = radiusX;
        ellipse.radiusY = radiusY;
      }
    },
    addArrow(state, action) {
      const page = state.pages[state.activePageIndex];
      page.Arrows.push(action.payload);
      page.shapes.push({ id: action.payload.id, type: "arrow" });
    },
    updateArrow(state, action) {
      const { id, points} = action.payload;
      const arrow = state.pages[state.activePageIndex].Arrows.find((a) => a.id === id);
      if (arrow) {
        arrow.points = points;
      }
    },
    addText(state, action) {
      const page = state.pages[state.activePageIndex];
      page.texts.push(action.payload);
      page.shapes.push({ id: action.payload.id, type: "text" });
    },
    updateText(state, action) {
      const { id, newText} = action.payload;
      const textItem = state.pages[state.activePageIndex].texts.find((text) => text.id === id);
      if (textItem) {
        textItem.text = newText;
        textItem.isEditing = false;
      }
    },
    startEditing(state, action) {
      const { id, index } = action.payload;
      state.pages[index].texts.forEach((text) => {
        text.isEditing = text.id === id;
      });
    },
    setEditingOff(state) {
      state.pages.forEach((page) =>
        page.texts.forEach((text) => (text.isEditing = false))
      );
    },
    addImage(state, action) {
      const page = state.pages[state.activePageIndex];
      page.images.push(action.payload);
    },
    updateImage(state, action) {
      const { id, index, ...updateData } = action.payload;
      const page = state.pages[index];
      const imageIndex = page.images.findIndex((img) => img.id === id);
      if (imageIndex !== -1) {
        page.images[imageIndex] = { ...page.images[imageIndex], ...updateData };
      }
    },
    undoLastShape(state) {
      const page = state.pages[state.activePageIndex];
      const lastShape = page.shapes.pop();
      if (!lastShape) return;
      const { id, type } = lastShape;
      const shapeArray = page[`${type}s`];
      if (shapeArray) {
        page[`${type}s`] = shapeArray.filter((shape) => shape.id !== id);
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
  updateArrow,
  addText,
  updateText,
  startEditing,
  setEditingOff,
  addImage,
  updateImage,
  addPage,
  setActivePage
} = boardSlice.actions;

export default boardSlice.reducer;
