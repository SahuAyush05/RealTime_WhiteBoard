import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  marker: [],
  pen: [],
};

const penSlice = createSlice({
  name: "pen",
  initialState,
  reducers: {
    addMarker: (state, action) => {
      state.marker.push(action.payload);
    },
    updateMarker: (state, action) => {
      const { id, points } = action.payload;
      const mark = state.marker.find((mark) => mark.id === id);
      if (mark) {
        mark.points = points;
      }
    },
    addPen: (state, action) => {
      state.pen.push(action.payload);
    },
    updatePen: (state, action) => {
      const { id, points } = action.payload;
      const pen = state.pen.find((pen) => pen.id === id);
      if (pen) {
        pen.points = points;
      }
    },
  },
});

export const { addMarker, updateMarker, addPen, updatePen } = penSlice.actions;
export default penSlice.reducer;
