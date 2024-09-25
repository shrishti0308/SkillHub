import { createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../../api/axiosInstance';

// Initialize state with token from localStorage
const initialState = {
    accessToken: localStorage.getItem('accessToken') || null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAccessToken: (state, action) => {
            state.accessToken = action.payload;
            localStorage.setItem('accessToken', action.payload);
        },
    },
});

// Async thunk for signup
export const signup = (userInfo, password, role) => async (dispatch) => {
    try {
        const response = await axiosInstance.post('/user/register', {
            ...userInfo,
            password,
            role,
        });

        if (response.data.success) {
            const accessToken = response.data.token;
            dispatch(setAccessToken(accessToken));
        }
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error registering user');
    }
};

// Async thunk for login
export const login = (usernameOrEmail, password) => async (dispatch) => {
    try {
        const response = await axiosInstance.post('/user/login', {
            usernameOrEmail,
            password,
        });

        if (response.data.success) {
            const accessToken = response.data.token;
            dispatch(setAccessToken(accessToken));
        }
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error logging in user');
    }
};

// Selector to get accessToken from state
export const selectAccessToken = (state) => state.auth.accessToken;

// Export the action created automatically by the slice
export const { setAccessToken } = authSlice.actions;

// Export the reducer to add it to the store
export default authSlice.reducer;
