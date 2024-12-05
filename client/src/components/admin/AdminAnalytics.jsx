import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Grid,
    Paper,
    Typography,
    Container,
} from '@mui/material';
import {
    LineChart,
    Line,
    PieChart,
    Pie,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell
} from 'recharts';
import { fetchUsers } from '../../redux/slices/adminUsersSlice';
import { fetchJobs } from '../../redux/slices/adminJobsSlice';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF4242'];

const AdminAnalytics = () => {
    const dispatch = useDispatch();
    const { users } = useSelector((state) => state.adminUsers);
    const { jobs } = useSelector((state) => state.adminJobs);
    const [userStats, setUserStats] = useState({
        roleDistribution: [],
        monthlyGrowth: [],
        activeUsers: 0,
        totalUsers: 0
    });
    const [jobStats, setJobStats] = useState({
        totalJobs: 0,
        activeJobs: 0,
        completedJobs: 0,
        monthlyJobGrowth: [],
        jobStatusDistribution: []
    });

    useEffect(() => {
        dispatch(fetchUsers());
        dispatch(fetchJobs());
    }, [dispatch]);

    useEffect(() => {
        if (users && users.length > 0) {
            // Calculate role distribution
            const roleStats = users.reduce((acc, user) => {
                acc[user.role] = (acc[user.role] || 0) + 1;
                return acc;
            }, {});

            // Calculate monthly growth
            const monthlyData = Array.from({ length: 6 }, (_, i) => {
                const date = new Date();
                date.setMonth(date.getMonth() - i);
                return {
                    name: date.toLocaleString('default', { month: 'short' }),
                    users: users.filter(user => {
                        const userDate = new Date(user.createdAt);
                        return userDate.getMonth() === date.getMonth() &&
                               userDate.getFullYear() === date.getFullYear();
                    }).length
                };
            }).reverse();

            setUserStats({
                roleDistribution: Object.entries(roleStats).map(([name, value]) => ({
                    name: name.charAt(0).toUpperCase() + name.slice(1),
                    value
                })),
                monthlyGrowth: monthlyData,
                activeUsers: users.filter(user => user.status === 'active').length,
                totalUsers: users.length
            });
        }
    }, [users]);

    useEffect(() => {
        if (jobs && jobs.length > 0) {
            // Calculate job status distribution
            const statusStats = jobs.reduce((acc, job) => {
                const status = job.status.charAt(0).toUpperCase() + job.status.slice(1);
                acc[status] = (acc[status] || 0) + 1;
                return acc;
            }, {});

            // Calculate monthly job growth
            const monthlyJobData = Array.from({ length: 6 }, (_, i) => {
                const date = new Date();
                date.setMonth(date.getMonth() - i);
                return {
                    name: date.toLocaleString('default', { month: 'short' }),
                    jobs: jobs.filter(job => {
                        const jobDate = new Date(job.createdAt);
                        return jobDate.getMonth() === date.getMonth() &&
                               jobDate.getFullYear() === date.getFullYear();
                    }).length
                };
            }).reverse();

            setJobStats({
                totalJobs: jobs.length,
                activeJobs: jobs.filter(job => job.status === 'active').length,
                completedJobs: jobs.filter(job => job.status === 'completed').length,
                monthlyJobGrowth: monthlyJobData,
                jobStatusDistribution: Object.entries(statusStats).map(([name, value]) => ({
                    name,
                    value
                }))
            });
        }
    }, [jobs]);

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* Summary Cards */}
            <Grid container spacing={3} mb={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, backgroundColor: '#1a237e', color: 'white' }}>
                        <Typography variant="h6">Total Users</Typography>
                        <Typography variant="h4">{userStats.totalUsers}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, backgroundColor: '#1a237e', color: 'white' }}>
                        <Typography variant="h6">Active Users</Typography>
                        <Typography variant="h4">{userStats.activeUsers}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, backgroundColor: '#1a237e', color: 'white' }}>
                        <Typography variant="h6">Total Jobs</Typography>
                        <Typography variant="h4">{jobStats.totalJobs}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, backgroundColor: '#1a237e', color: 'white' }}>
                        <Typography variant="h6">Active Jobs</Typography>
                        <Typography variant="h4">{jobStats.activeJobs}</Typography>
                    </Paper>
                </Grid>
            </Grid>

            <Grid container spacing={3} mb={3}>
                {/* User Growth Chart */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, backgroundColor: '#1a237e' }}>
                        <Typography variant="h6" gutterBottom color="white">
                            Monthly User Growth
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={userStats.monthlyGrowth}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" stroke="white" />
                                <YAxis stroke="white" />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="users" stroke="#82ca9d" name="New Users" />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Job Growth Chart */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, backgroundColor: '#1a237e' }}>
                        <Typography variant="h6" gutterBottom color="white">
                            Monthly Job Growth
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={jobStats.monthlyJobGrowth}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" stroke="white" />
                                <YAxis stroke="white" />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="jobs" stroke="#FF8042" name="New Jobs" />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                {/* User Role Distribution */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, backgroundColor: '#1a237e' }}>
                        <Typography variant="h6" gutterBottom color="white">
                            User Role Distribution
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={userStats.roleDistribution}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label
                                >
                                    {userStats.roleDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Job Status Distribution */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, backgroundColor: '#1a237e' }}>
                        <Typography variant="h6" gutterBottom color="white">
                            Job Status Distribution
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={jobStats.jobStatusDistribution}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label
                                >
                                    {jobStats.jobStatusDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default AdminAnalytics;
