import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch the earnings (wallet balance + last 5 transactions)
export const fetchEarnings = createAsyncThunk('earnings/fetchEarnings', async (userId) => {
    const response = await axios.get(`/api/users/${userId}/earnings`); // Endpoint to fetch user earnings
    return response.data;
});

const earningsSlice = createSlice({
    name: 'earnings',
    initialState: {
        wallet: 0,
        transactions: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchEarnings.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchEarnings.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.wallet = action.payload.wallet;
                state.transactions = action.payload.transactions;
            })
            .addCase(fetchEarnings.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default earningsSlice.reducer;
