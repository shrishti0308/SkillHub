import { combineReducers } from 'redux';
import authReducer from './user/authSlice';
import sidebarReducer from './dashboard/sidebarSlice';
import profileReducer from './user/ProfileSlice';

const rootReducer = combineReducers({
    auth: authReducer,
    sidebar: sidebarReducer,
    profile: profileReducer,
});

export default rootReducer;
