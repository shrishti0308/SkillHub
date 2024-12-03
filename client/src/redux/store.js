import { configureStore } from '@reduxjs/toolkit';
import adminReducer from './slices/adminSlice';
import adminUsersReducer from './slices/adminUsersSlice';
import adminJobsReducer from './slices/adminJobsSlice';
import adminReportsReducer from './slices/adminReportsSlice';
import authReducer from './Features/user/authSlice';
import profileReducer from './Features/user/ProfileSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    admin: adminReducer,
    adminUsers: adminUsersReducer,
    adminJobs: adminJobsReducer,
    adminReports: adminReportsReducer,
  },
});

export default store;
