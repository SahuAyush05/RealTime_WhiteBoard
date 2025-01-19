import {createSlice} from "@reduxjs/toolkit";

const toolBoxSlice = createSlice({
    name: "toolBox",
    initialState: {
      currentTool: "pen",
    },
    reducers: {
      changeTool: (state, action) => {
        state.currentTool = action.payload; 
        console.log(state.currentTool);
      },
    },
  });
  
  export const { changeTool } = toolBoxSlice.actions;
  export default toolBoxSlice.reducer;