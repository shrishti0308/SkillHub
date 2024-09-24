import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch user transactions from the API
export const fetchUserTransactions = createAsyncThunk(
    'earnings/fetchUserTransactions',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/api/transactions/user/${userId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const earningsSlice = createSlice({
    name: 'earnings',
    initialState: {
        transactions: [],
        totalEarnings: 0,
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserTransactions.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUserTransactions.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.transactions = action.payload;

                // Calculate total earnings by summing up credit transactions
                state.totalEarnings = action.payload
                    .filter((transaction) => transaction.transactionType === 'credit')
                    .reduce((total, transaction) => total + transaction.amount, 0);
            })
            .addCase(fetchUserTransactions.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export default earningsSlice.reducer;
