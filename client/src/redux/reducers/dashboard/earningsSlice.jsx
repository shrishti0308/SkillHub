import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../api/axiosInstance'; // Use axiosInstance

// Async thunk to fetch the earnings (wallet balance + last 5 transactions)
export const fetchEarnings = createAsyncThunk(
    'earnings/fetchEarnings',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/api/users/${userId}/earnings`); // Adjust to your API endpoint
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response ? error.response.data : "Network Error"
            );
        }
    }
);

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
                state.transactions = action.payload.transactions.slice(0, 5); // Ensure only the latest 5 transactions
            })
            .addCase(fetchEarnings.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Failed to fetch earnings';
            });
    },
});

export default earningsSlice.reducer;
