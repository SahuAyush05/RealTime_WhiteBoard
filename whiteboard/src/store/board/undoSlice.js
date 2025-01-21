import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  shapesHistory: [],
};

const undoSlice = createSlice({
  name: "undo",
  initialState,
  reducers: {
    undoLastShape: (state) => {
      const lastShape = state.shapesHistory.pop();
      if (!lastShape) return;
    },
    addToHistory: (state, action) => {
      state.shapesHistory.push(action.payload);
    },
  },
});

export const { undoLastShape, addToHistory } = undoSlice.actions;
export default undoSlice.reducer;
