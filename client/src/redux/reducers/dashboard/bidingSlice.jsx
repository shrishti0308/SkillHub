import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    userbids: [
        {
            _id: "66f562d85c0bb68a5e6d3656",
            amount: 130,
            job: "66f52626009e180435652773",
            freelancer: "66f2a5f3b8add7538ab0b02e",
            status: "pending",
            createdAt: "2024-09-26T13:34:16.180Z",
            updatedAt: "2024-09-26T13:34:16.180Z",
            __v: 0
        },
    ],
    bidDetails: {},  // New state to store individual bid details
    status: 'idle',
    error: null
};

const biddingSlice = createSlice({
    name: 'bids',
    initialState,
    reducers: {
        setBids: (state, action) => {
            state.userbids = action.payload;
        },
        setBidDetails: (state, action) => {
            state.bidDetails = action.payload;
        },
        updateBids: (state, action) => {
            state.userbids = {...state.userbids, ...action.payload};
        },
    },
});

// Export the actions
export const { setBids, setBidDetails, updateBids } = biddingSlice.actions;

// Selector to get all bids
export const selectBidsForUser = (state) => state.bids.userbids;

// Selector to get specific bid details
export const selectBidDetails = (state) => state.bids.bidDetails;

// Export the reducer
export default biddingSlice.reducer;
