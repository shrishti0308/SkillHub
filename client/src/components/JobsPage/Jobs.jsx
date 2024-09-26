import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import JobsList from './JobsComponents/JobsList';
import JobDetails from './JobsComponents/jobDetails';
import Sidebar from '../Dashboard/Dashboardcomponents/Sidebar';
import { selectIsSidebarMinimized } from '../../redux/reducers/dashboard/sidebarSlice';

const Jobs = () => {
    const isSidebarMinimized = useSelector(selectIsSidebarMinimized);
    return (
        <div className={`p-6 fixed top-16 ${isSidebarMinimized ? 'left-16' : 'left-56'}`}>
            <Sidebar />
            <Routes>
                <Route path="/" element={<JobsList />} />
                <Route path="/:jobId" element={<JobDetails />} />
            </Routes>
        </div>
    );
};

export default Jobs;
