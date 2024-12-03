import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../api/axiosInstance"; // Use axiosInstance instead of axios

// Async thunk to fetch projects taken up by the freelancer
export const fetchFreelancerJobs = createAsyncThunk(
  "jobs/fetchFreelancerJobs",
  async (userId, { rejectWithValue }) => {
    try {
      // Axios instance will automatically add baseURL and token
      const response = await axiosInstance.get(
        `/api/jobs/freelancer/${userId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : "Network Error"
      );
    }
  }
);

const jobsSlice = createSlice({
  name: "jobs",
  initialState: {
    freelancerJobs: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFreelancerJobs.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFreelancerJobs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.freelancerJobs = action.payload;
      })
      .addCase(fetchFreelancerJobs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch jobs";
      });
  },
});

export default jobsSlice.reducer;
