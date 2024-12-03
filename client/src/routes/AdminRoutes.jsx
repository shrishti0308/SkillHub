import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AdminLayout from '../components/admin/AdminLayout';
import AdminLogin from '../components/admin/AdminLogin';
import AdminDashboard from '../components/admin/AdminDashboard';

// Protected Route component
const ProtectedRoute = ({ children }) => {
    const { token } = useSelector((state) => state.admin);
    
    if (!token) {
        return <Navigate to="/admin/login" replace />;
    }

    return children || <Outlet />;
};

// Admin routes configuration
export const adminRoutes = [
    {
        path: '/admin',
        element: <Navigate to="/admin/login" replace />
    },
    {
        path: '/admin/login',
        element: <AdminLogin />
    },
    {
        path: '/admin',
        element: (
            <ProtectedRoute>
                <AdminLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                path: 'dashboard',
                element: <AdminDashboard />
            },
            // Add more admin routes here as needed
            {
                path: '*',
                element: <Navigate to="/admin/dashboard" replace />
            }
        ]
    }
];
