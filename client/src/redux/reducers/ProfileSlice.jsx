import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    userProfile: {
        name: '',
        email: '',
        bio: '',
        info: {
            skills: [],
            portfolio: '',
            experience: [],
        },
        previousWorks: [],
    },
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setUserProfile: (state, action) => {
            state.userProfile = action.payload;
        },
        updateUserProfile: (state, action) => {
            state.userProfile = { ...state.userProfile, ...action.payload };
        },
    },
});

export const { setUserProfile, updateUserProfile } = profileSlice.actions;

export const selectUserProfile = (state) => state.profile.userProfile;

export default profileSlice.reducer;
