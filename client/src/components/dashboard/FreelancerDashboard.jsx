import React from 'react';
import Sidebar from './dashboardcomponents/Sidebar';
import { useSelector } from 'react-redux'; 
import { selectIsSidebarMinimized } from '../../features/dashboard/sidebarSlice';

const Dashboard = ({ userName }) => {
  const isSidebarMinimized = useSelector(selectIsSidebarMinimized);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className={`flex-grow p-5 fixed top-16 ${isSidebarMinimized ? 'left-16' : 'left-56'} transition-all duration-300`}>
        <div className="flex justify-between items-center bg-dark p-4 shadow-md">
          <span className="text-xl font-semibold">Welcome, {userName}</span>
        </div>

        {/* Content */}
        <div className="mt-5">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-3">Manage your jobs, biddings, earnings, projects, and account.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
