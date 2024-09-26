import { createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../../api/axiosInstance';

// Initialize state with token, role, and username from localStorage
const initialState = {
    accessToken: localStorage.getItem('accessToken') || null,
    role: localStorage.getItem('role') || null,
    username: localStorage.getItem('username') || null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAccessToken: (state, action) => {
            state.accessToken = action.payload;
            localStorage.setItem('accessToken', action.payload);
        },
        setRole: (state, action) => {
            state.role = action.payload;
            localStorage.setItem('role', action.payload);
        },
        setUsername: (state, action) => {
            state.username = action.payload;
            localStorage.setItem('username', action.payload);
        },
        logout: (state) => {
            state.accessToken = null;
            state.role = null;
            state.username = null;
            localStorage.removeItem('accessToken');
            localStorage.removeItem('role');
            localStorage.removeItem('username');
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
            const username = response.data.username; // Assuming username is returned in response
            dispatch(setAccessToken(accessToken)); // Dispatch access token
            dispatch(setRole(role)); // Dispatch role
            dispatch(setUsername(username)); // Dispatch username
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
            const username = response.data.username; // Assuming username is returned in response
            dispatch(setAccessToken(accessToken)); // Dispatch access token
            dispatch(setRole(role)); // Dispatch role
            dispatch(setUsername(username)); // Dispatch username
        }
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error logging in user');
    }
};

// Selector to get accessToken from state
export const selectAccessToken = (state) => state.auth.accessToken;

// Selector to get role from state
export const selectRole = (state) => state.auth.role;

// Selector to get username from state
export const selectUsername = (state) => state.auth.username;

// Export the actions created automatically by the slice
export const { setAccessToken, setRole, setUsername, logout } = authSlice.actions; // Export logout action

// Export the reducer to add it to the store
export default authSlice.reducer;
