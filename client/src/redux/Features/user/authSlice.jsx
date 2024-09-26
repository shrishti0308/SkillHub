import { createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../../api/axiosInstance';

// Initialize state with token and role from localStorage
const initialState = {
    accessToken: localStorage.getItem('accessToken') || null,
    role: localStorage.getItem('role') || null, // Add role to the initial state
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAccessToken: (state, action) => {
            state.accessToken = action.payload.token;
            state.role = action.payload.role;
            localStorage.setItem('accessToken', action.payload.token);
            localStorage.setItem('role', action.payload.role); // Store role in localStorage
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
            dispatch(setAccessToken({ token: accessToken, role }));
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
            const role = response.data.role; // Assuming role is returned in response
            dispatch(setAccessToken({ token: accessToken, role })); // Dispatch token and role
        }
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error logging in user');
    }
};

// Selector to get accessToken from state
export const selectAccessToken = (state) => state.auth.accessToken;

// Selector to get role from state
export const selectRole = (state) => state.auth.role;

// Export the action created automatically by the slice
export const { setAccessToken } = authSlice.actions;

// Export the reducer to add it to the store
export default authSlice.reducer;
