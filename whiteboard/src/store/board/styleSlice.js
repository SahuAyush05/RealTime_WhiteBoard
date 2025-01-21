import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  strokeWidth: 4,
  strokeColor: "#000000",
};

const stylesSlice = createSlice({
  name: "styles",
  initialState,
  reducers: {
    setStrokeWidth: (state, action) => {
      state.strokeWidth = action.payload;
    },
    setStrokeColor: (state, action) => {
      state.strokeColor = action.payload;
    },
  },
});

export const { setStrokeWidth, setStrokeColor } = stylesSlice.actions;
export default stylesSlice.reducer;
