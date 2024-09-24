import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchBidsForUser = createAsyncThunk('bids/fetchBidsForUser', async (_, { getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        const response = await axios.get(`/api/bids/user/${auth.userId}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

const biddingSlice = createSlice({
    name: 'bids',
    initialState: {
        bids: [],
        status: 'idle',
        error: null,
    },
    reducers: {
        // You can define additional reducers here if needed
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBidsForUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchBidsForUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.bids = action.payload;
            })
            .addCase(fetchBidsForUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export default biddingSlice.reducer;
