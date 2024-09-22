import React from 'react';
import Sidebar from './dashboardcomponents/Sidebar';
import { useSelector } from 'react-redux'; 
import { selectIsSidebarMinimized } from '../../features/dashboard/sidebarSlice';

const Dashboard = () => {
  const isSidebarMinimized = useSelector(selectIsSidebarMinimized);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className={`flex-grow p-5 fixed top-16 ${isSidebarMinimized ? 'left-16' : 'left-56'} transition-all duration-300`}>
        <div className="flex justify-between items-center bg-dark p-4">
          <span className="text-xl font-semibold">Welcome</span>
        </div>

        
        
      </div>
    </div>
  );
};

export default Dashboard;
