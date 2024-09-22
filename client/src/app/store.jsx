import { configureStore } from '@reduxjs/toolkit';
import sidebarReducer from '../features/dashboard/sidebarSlice';

export const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
  },
});
