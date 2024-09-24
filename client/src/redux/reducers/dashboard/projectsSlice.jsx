import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch projects taken up by the freelancer
export const fetchFreelancerJobs = createAsyncThunk(
    'jobs/fetchFreelancerJobs',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/api/jobs/freelancer/${userId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const jobsSlice = createSlice({
    name: 'jobs',
    initialState: {
        freelancerJobs: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFreelancerJobs.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchFreelancerJobs.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.freelancerJobs = action.payload;
            })
            .addCase(fetchFreelancerJobs.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export default jobsSlice.reducer;
