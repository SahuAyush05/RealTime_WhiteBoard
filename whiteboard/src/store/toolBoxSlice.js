import { createSlice } from "@reduxjs/toolkit";

const toolBoxSlice = createSlice({
  name: "toolBox",
  initialState: {
    currentTool: "pen",
    markerColor: "black",
    penType: "straight",
    penDash: [],
  },
  reducers: {
    changeTool: (state, action) => {
      state.currentTool = action.payload;
      console.log(state.currentTool);
    },
    changeMarkerColor: (state, action) => {
      state.markerColor = action.payload;
      console.log(state.markerColor);
    },
    changeDashValue:(state,action)=>{
      state.penDash=action.payload;
    }
  },
});
export const { changeTool, changeMarkerColor,changeDashValue } = toolBoxSlice.actions;
export default toolBoxSlice.reducer;
