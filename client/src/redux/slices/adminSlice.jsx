import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3000/admin';

// Get stored admin data
const getStoredAdminData = () => {
    try {
        const token = localStorage.getItem('adminToken');
        const adminData = localStorage.getItem('adminData');
        return {
            token,
            currentAdmin: adminData ? JSON.parse(adminData) : null,
            admins: [],
            loading: false,
            error: null,
            success: null
        };
    } catch (error) {
        return {
            token: null,
            currentAdmin: null,
            admins: [],
            loading: false,
            error: null,
            success: null
        };
    }
};

const initialState = getStoredAdminData();

// Async thunks
export const loginAdmin = createAsyncThunk(
    'admin/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/login`, credentials);
            localStorage.setItem('adminToken', response.data.token);
            localStorage.setItem('adminData', JSON.stringify(response.data.admin));
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Login failed' });
        }
    }
);

export const fetchAllAdmins = createAsyncThunk(
    'admin/fetchAll',
    async (_, { rejectWithValue, getState }) => {
        try {
            const { token } = getState().admin;
            const response = await axios.get(`${API_URL}/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to fetch admins' });
        }
    }
);

export const createAdmin = createAsyncThunk(
    'admin/create',
    async (adminData, { rejectWithValue, getState }) => {
        try {
            const { token } = getState().admin;
            const response = await axios.post(`${API_URL}/create`, adminData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to create admin' });
        }
    }
);

export const updateAdmin = createAsyncThunk(
    'admin/update',
    async ({ id, data }, { rejectWithValue, getState }) => {
        try {
            const { token } = getState().admin;
            const response = await axios.patch(`${API_URL}/${id}`, data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to update admin' });
        }
    }
);

export const deleteAdmin = createAsyncThunk(
    'admin/delete',
    async (adminId, { rejectWithValue, getState }) => {
        try {
            const { token } = getState().admin;
            await axios.delete(`${API_URL}/${adminId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return adminId;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to delete admin' });
        }
    }
);

export const getCurrentAdmin = createAsyncThunk(
    'admin/getCurrent',
    async (_, { rejectWithValue, getState }) => {
        try {
            const { token } = getState().admin;
            if (!token) return null;
            
            const response = await axios.get(`${API_URL}/current`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            localStorage.setItem('adminData', JSON.stringify(response.data));
            return response.data;
        } catch (error) {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminData');
            return rejectWithValue(error.response?.data || { message: 'Failed to get current admin' });
        }
    }
);

export const updatePermissions = createAsyncThunk(
    'admin/updatePermissions',
    async ({ adminId, permissions }, { rejectWithValue, getState }) => {
        try {
            const { token } = getState().admin;
            const response = await axios.patch(
                `${API_URL}/${adminId}/permissions`,
                { permissions },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to update permissions' });
        }
    }
);

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        logout: (state) => {
            state.currentAdmin = null;
            state.token = null;
            state.admins = [];
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminData');
        },
        clearError: (state) => {
            state.error = null;
        },
        clearSuccess: (state) => {
            state.success = null;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.currentAdmin = action.payload.admin;
                state.token = action.payload.token;
                state.error = null;
            })
            .addCase(loginAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Login failed';
            })
            // Fetch All
            .addCase(fetchAllAdmins.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllAdmins.fulfilled, (state, action) => {
                state.loading = false;
                state.admins = action.payload;
            })
            .addCase(fetchAllAdmins.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch admins';
            })
            // Create Admin
            .addCase(createAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.admins.push(action.payload);
                state.success = true;
            })
            .addCase(createAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to create admin';
            })
            // Update Admin
            .addCase(updateAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.admins = state.admins.map(admin => 
                    admin._id === action.payload._id ? action.payload : admin
                );
                state.success = 'Admin updated successfully';
            })
            .addCase(updateAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to update admin';
            })
            // Delete Admin
            .addCase(deleteAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.admins = state.admins.filter(admin => admin._id !== action.payload);
                state.success = 'Admin deleted successfully';
            })
            .addCase(deleteAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to delete admin';
            })
            // Get Current Admin
            .addCase(getCurrentAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCurrentAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.currentAdmin = action.payload;
            })
            .addCase(getCurrentAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to get current admin';
            })
            // Update Permissions
            .addCase(updatePermissions.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(updatePermissions.fulfilled, (state, action) => {
                state.loading = false;
                state.success = 'Permissions updated successfully';
                state.admins = state.admins.map(admin =>
                    admin._id === action.payload.admin._id ? action.payload.admin : admin
                );
            })
            .addCase(updatePermissions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to update permissions';
            });
    }
});

export const { logout, clearError, clearSuccess, setError } = adminSlice.actions;
export default adminSlice.reducer;
