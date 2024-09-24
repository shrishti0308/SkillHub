import { combineReducers } from 'redux';
import authReducer from './authReducer';
import sidebarReducer from './dashboard/sidebarSlice';
import profileReducer from './ProfileSlice';

const rootReducer = combineReducers({
    auth: authReducer,
    sidebar: sidebarReducer,
    profile: profileReducer,
});

export default rootReducer;
