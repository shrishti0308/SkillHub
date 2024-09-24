import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch available jobs from the API
export const fetchAvailableJobs = createAsyncThunk('jobs/fetchAvailableJobs', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get('/api/jobs');
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

const jobsSlice = createSlice({
    name: 'jobs',
    initialState: {
        jobs: [],
        status: 'idle',
        error: null,
    },
    reducers: {
        // You can define additional reducers here if needed
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAvailableJobs.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAvailableJobs.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.jobs = action.payload;
            })
            .addCase(fetchAvailableJobs.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export default jobsSlice.reducer;
