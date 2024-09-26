import { createSlice } from '@reduxjs/toolkit';

// Initial state for bids
const initialState = {
    bids: [],
};

// Create the slice
const biddingSlice = createSlice({
    name: 'bids',
    initialState,
    reducers: {
        setBids: (state, action) => {
            state.bids = action.payload;
        },
        updateBids: (state,action) => {
            state.bids = {...state.bids,...action.bids};
        },
    },
});

// Export the actions
export const { setBids, updateBids } = biddingSlice.actions;

// Export the selector
export const selectBidsForUser = (state) => state.bids.bids;

// Export the reducer
export default biddingSlice.reducer;
