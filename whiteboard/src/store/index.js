import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import enableReducer from "./enable";
const store = configureStore({
  reducer: {
    auth: authReducer,
    enable:enableReducer,
  },
});

export default store;
