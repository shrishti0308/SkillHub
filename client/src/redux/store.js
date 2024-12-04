import { configureStore } from '@reduxjs/toolkit';
import adminReducer from './slices/adminSlice';
import adminUsersReducer from './slices/adminUsersSlice';
import adminJobsReducer from './slices/adminJobsSlice';
import adminReportsReducer from './slices/adminReportsSlice';
import authReducer from './Features/user/authSlice';
import profileReducer from './Features/user/ProfileSlice';
import sidebarReducer from './reducers/dashboard/sidebarSlice';
import bidingReducer from './reducers/dashboard/bidingSlice';
import jobsReducer from './Features/dashboard/jobsSlice';
import earningReducer from './reducers/dashboard/earningsSlice';
import notificationReducer from './Features/notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    admin: adminReducer,
    adminUsers: adminUsersReducer,
    adminJobs: adminJobsReducer,
    adminReports: adminReportsReducer,
    sidebar: sidebarReducer,
    bids: bidingReducer,
    earnings: earningReducer,
    jobs: jobsReducer,
    notifications: notificationReducer
  },
});

export default store;
