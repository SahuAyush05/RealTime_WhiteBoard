import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import enableReducer from "./enable";
import toolBoxReducer from "./toolBoxSlice";
import boardReducer from "./boardSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    enable:enableReducer,
    toolBox:toolBoxReducer,
    board:boardReducer
  },
});

export default store;
