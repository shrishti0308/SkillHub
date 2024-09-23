import axios from 'axios';
import store from '../redux/store';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000', // Replace with your API base URL
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const state = store.getState();
        const token = state.auth.accessToken;

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
