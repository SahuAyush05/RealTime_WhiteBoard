import {createSlice} from "@reduxjs/toolkit";

const enableSlice = createSlice({
    name: "enable",
    initialState: {
      tabs: false,
    },
    reducers: {
      enableCanva: (state, action) => {
        state.tabs = action.payload; 
      },
    },
  });
  
  export const { enableCanva } = enableSlice.actions;
  export default enableSlice.reducer;