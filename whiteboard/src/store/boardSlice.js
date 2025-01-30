import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuid } from "uuid";

const initialState = {
  pages: [
    {
      id: uuid(),
      Rectangles: [],
      Scribbles: [],
      Markers: [],
      Circles: [],
      Ellipses: [],
      Arrows: [],
      Lines: [],
      Shapes: [],
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
    initializeBoard(state, action) {
      const { pages } = action.payload;
      console.log(action.payload);
      state.pages = pages;
      state.activePageIndex = 0;
      state.strokeWidth = 4;
      state.strokeColor = "#000000";
    },
    addPage(state, action) {
      state.pages.push(action.payload);
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
      page.Rectangles.data.push(action.payload);
      console.log(page.Rectangles);
      page.Shapes.push({
        id: action.payload.id,
        type: "Rectangle",
        data: action.payload,
      });
    },
    updateRectangle(state, action) {
      const { id, updatedData, pageIndex } = action.payload;
      const rectangle = state.pages[pageIndex].Rectangles.data.find(
        (rect) => rect.id === id
      );
      const shape = state.pages[pageIndex].Shapes.find((sh) => sh.id === id);
      if (rectangle) {
        rectangle.data.height = updatedData.height;
        rectangle.data.width = updatedData.width;
      }
      if (shape) {
        shape.data.data.height = updatedData.height;
        shape.data.data.width = updatedData.width;
      }
    },
    addScribble(state, action) {
      const page = state.pages[state.activePageIndex];
      page.Scribbles.data.push(action.payload);
      page.Shapes.push({
        id: action.payload.id,
        type: "scribble",
        data: action.payload,
      });
    },
    updateScribble(state, action) {
      const { id, updatedData, pageIndex } = action.payload;
      const scribble = state.pages[pageIndex].Scribbles.data.find(
        (scrib) => scrib.id === id
      );
      const shape = state.pages[pageIndex].Shapes.find((sh) => sh.id === id);
      if (scribble) {
        scribble.data.points = updatedData.points;
      }
      if (shape) {
        shape.data.data.points = updatedData.points;
      }
    },
    addMarker(state, action) {
      const page = state.pages[state.activePageIndex];
      page.Markers.data.push(action.payload);
      page.Shapes.push({
        id: action.payload.id,
        type: "marker",
        data: action.payload,
      });
    },
    updateMarker(state, action) {
      const { id, updatedData, pageIndex } = action.payload;
      const marker = state.pages[pageIndex].Markers.data.find(
        (mark) => mark.id === id
      );
      const shape = state.pages[pageIndex].Shapes.find((sh) => sh.id === id);
      if (marker) {
        marker.data.points = updatedData.points;
      }
      if (shape) {
        shape.data.data.points = updatedData.points;
      }
    },
    addCircle(state, action) {
      const page = state.pages[state.activePageIndex];
      page.Circles.data.push(action.payload);
      page.Shapes.push({
        id: action.payload.id,
        type: "circle",
        data: action.payload,
      });
    },
    updateCircle(state, action) {
      const { id, updatedData, pageIndex } = action.payload;
      const circle = state.pages[state.activePageIndex].Circles.data.find(
        (c) => c.id === id
      );
      const shape = state.pages[pageIndex].Shapes.find((sh) => sh.id === id);
      if (circle) {
        circle.data.radius = updatedData.radius;
      }
      if (shape) {
        shape.data.data.radius = updatedData.radius;
      }
    },
    addEllipse(state, action) {
      const page = state.pages[state.activePageIndex];
      page.Ellipses.data.push(action.payload);
      page.Shapes.push({
        id: action.payload.id,
        type: "ellipse",
        data: action.payload,
      });
    },
    updateEllipse(state, action) {
      const { id, updatedData, pageIndex } = action.payload;
      const ellipse = state.pages[pageIndex].Ellipses.data.find(
        (t) => t.id === id
      );
      const shape = state.pages[pageIndex].Shapes.find((sh) => sh.id === id);
      if (ellipse) {
        ellipse.data.radiusX = updatedData.radiusX;
        ellipse.data.radiusY = updatedData.radiusY;
      }
      if (shape) {
        shape.data.data.radiusX = updatedData.radiusX;
        shape.data.data.radiusY = updatedData.radiusY;
      }
    },
    addArrow(state, action) {
      const page = state.pages[state.activePageIndex];
      page.Arrows.data.push(action.payload);
      page.Shapes.push({
        id: action.payload.id,
        type: "arrow",
        data: action.payload,
      });
    },
    updateArrow(state, action) {
      const { id, updatedData, pageIndex } = action.payload;
      const arrow = state.pages[pageIndex].Arrows.data.find((a) => a.id === id);
      const shape = state.pages[pageIndex].Shapes.find((sh) => sh.id === id);
      if (arrow) {
        arrow.data.points = updatedData.points;
      }
      if (shape) {
        shape.data.data.points = updatedData.points;
      }
    },
    // addText(state, action) {
    //   const page = state.pages[state.activePageIndex];
    //   page.texts.push(action.payload);
    //   page.shapes.push({ id: action.payload.id, type: "text" });
    // },
    // updateText(state, action) {
    //   const { id, newText } = action.payload;
    //   const textItem = state.pages[state.activePageIndex].texts.find(
    //     (text) => text.id === id
    //   );
    //   if (textItem) {
    //     textItem.text = newText;
    //     textItem.isEditing = false;
    //   }
    // },
    // startEditing(state, action) {
    //   const { id, index } = action.payload;
    //   state.pages[index].texts.forEach((text) => {
    //     text.isEditing = text.id === id;
    //   });
    // },
    // setEditingOff(state) {
    //   state.pages.forEach((page) =>
    //     page.texts.forEach((text) => (text.isEditing = false))
    //   );
    // },
    // addImage(state, action) {
    //   const page = state.pages[state.activePageIndex];
    //   page.images.push(action.payload);
    // },
    // updateImage(state, action) {
    //   const { id, index, ...updateData } = action.payload;
    //   const page = state.pages[index];
    //   const imageIndex = page.images.findIndex((img) => img.id === id);
    //   if (imageIndex !== -1) {
    //     page.images[imageIndex] = { ...page.images[imageIndex], ...updateData };
    //   }
    // },
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
  // addText,
  // updateText,
  // startEditing,
  // setEditingOff,
  // addImage,
  // updateImage,
  addPage,
  setActivePage,
  initializeBoard,
} = boardSlice.actions;

export default boardSlice.reducer;
