import React from 'react';
import Sidebar from './dashboardcomponents/Sidebar';
import { useSelector } from 'react-redux'; 
import { selectIsSidebarMinimized } from '../../features/dashboard/sidebarSlice';

const Dashboard = () => {
import { selectIsSidebarMinimized } from '../../redux/reducers/dashboard/sidebarSlice';
import EarningsSummary from './dashboardcomponents/earningsSummary';
import BiddingSummary from './dashboardcomponents/bidingSummary';
import ProjectsSummary from './dashboardcomponents/projectsSummary';
import RecentJobsSummary from './dashboardcomponents/recentJobsSummary';

const Dashboard = () => {
  const isSidebarMinimized = useSelector(selectIsSidebarMinimized);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div 
        className={`flex flex-col flex-grow p-5 fixed top-16 ${isSidebarMinimized ? 'left-16' : 'left-56'} transition-all duration-300 overflow-auto h-screen`}
      >
        <div className="flex justify-between items-center bg-dark p-4 mb-4">
          <span className="text-xl font-semibold">Welcome</span>
        </div>

        
        
        
        <div className="flex flex-col space-y-4">
          <RecentJobsSummary />
          <BiddingSummary />
          <ProjectsSummary />
          <EarningsSummary />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
