import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // Check for admin routes
        if (config.url?.startsWith('/admin')) {
            const adminToken = localStorage.getItem('adminToken');
            if (adminToken) {
                config.headers['Authorization'] = `Bearer ${adminToken}`;
            }
        } else {
            // For regular user routes
            const userToken = localStorage.getItem('accessToken');
            if (userToken) {
                config.headers['Authorization'] = `Bearer ${userToken}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access
            if (error.config.url?.startsWith('/admin')) {
                // Redirect to admin login
                window.location.href = '/admin/login';
            } else {
                // Clear user tokens and redirect to login
                localStorage.removeItem('accessToken');
                localStorage.removeItem('role');
                localStorage.removeItem('username');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
