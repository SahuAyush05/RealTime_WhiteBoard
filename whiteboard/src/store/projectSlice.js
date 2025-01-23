import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createProject = createAsyncThunk(
  "project/createProject",
  async (projectData, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:5000/api/projects/create-project", projectData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const joinProject = createAsyncThunk(
  "project/joinProject",
  async (roomKey, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/projects/join-project`, {
        params: { roomKey }, 
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to join the project");
    }
  }
);

const initialState = {
  project: null, 
  loading: false,
  error: null,
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    resetProject(state) {
      state.project = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.project = action.payload;
        state.loading = false;
      })
      .addCase(createProject.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(joinProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(joinProject.fulfilled, (state, action) => {
        state.project = action.payload.project; 
        //console.log("&&&&&&&",state.project);
        state.loading = false;
      })
      .addCase(joinProject.rejected, (state, action) => {
        state.error = action.payload; 
        state.loading = false;
      });
  },
});

export const { resetProject } = projectSlice.actions;

export default projectSlice.reducer;