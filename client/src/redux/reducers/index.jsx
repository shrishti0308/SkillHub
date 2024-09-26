import { combineReducers } from 'redux';
import authReducer from './authReducer';
import sidebarReducer from './dashboard/sidebarSlice';
import profileReducer from './ProfileSlice';
import jobReducer from './dashboard/jobsSlice';

const rootReducer = combineReducers({
    auth: authReducer,
    sidebar: sidebarReducer,
    profile: profileReducer,
    jobs: jobReducer,
});

export default rootReducer;
