import { combineReducers } from 'redux';
import authReducer from './user/authSlice';
import sidebarReducer from './dashboard/sidebarSlice';
import profileReducer from './user/ProfileSlice';
import bidingReducer from '../reducers/dashboard/bidingSlice';
import jobsReducer from './dashboard/jobsSlice';

const rootReducer = combineReducers({
    auth: authReducer,
    sidebar: sidebarReducer,
    profile: profileReducer,
    bids : bidingReducer,
    jobs: jobsReducer
});

export default rootReducer;
