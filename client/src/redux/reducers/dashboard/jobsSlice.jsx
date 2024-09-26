import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    recentJobs: [
        {
            _id: "66f436640adb04612cb0c37f",
            title: "Frontend Development for E-commerce Website",
            description: "Develop frontend components for an e-commerce website using React and Redux.",
            budget: 1000,
            employer: "66f2a5f3b8add7538ab0b02e",
            status: "open",
            freelancer: null,
            bidAccepted: false,
        },
    ],
};

const jobsSlice = createSlice({
    name: 'jobs',
    initialState,
    reducers: {
        setRecentJobs: (state, action) => {
            state.recentJobs = action.payload;
        },
        updateRecentJobs: (state, action) => {
            state.recentJobs = { ...state.recentJobs, ...action.recentJobs };
        },
    },
});

export const { setRecentJobs, updateRecentJobs } = jobsSlice.actions;

export const selectRecentJobs = (state) => state.jobs.recentJobs;

export default jobsSlice.reducer;
