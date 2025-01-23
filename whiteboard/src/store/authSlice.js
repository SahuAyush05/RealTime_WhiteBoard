import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {jwtDecode} from "jwt-decode";

const API_URL = "http://localhost:5000/api/auth";

export const signUp = createAsyncThunk(
  "auth/signUp",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/signup`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const token = response.data.token;
      const decodedToken = jwtDecode(token);
      localStorage.setItem("token", token);
      return { token, decodedToken };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Sign-up failed");
    }
  }
);

export const signIn = createAsyncThunk(
  "auth/signIn",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/login`, credentials);
      const token = response.data.token;
      const decodedToken = jwtDecode(token);
      localStorage.setItem("token", token);
      return { token, decodedToken };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Sign-in failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    user: [],
    status: "idle",
    error: null,
    isAuthenticated:false,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      state.token = null;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUp.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
        state.user = action.payload.decodedToken;
        state.isAuthenticated=true;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(signIn.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
        state.user = action.payload.decodedToken.user;
        state.isAuthenticated=true;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
