import { combineReducers } from 'redux';
import sidebarReducer from '../features/dashboard/sidebarSlice'

const rootReducer = combineReducers({
    sidebar: sidebarReducer,
});

export default rootReducer;
