import React from "react";
import { useSelector } from "react-redux";
import Sidebar from "./dashboardcomponents/Sidebar";
import EarningsSummary from "./dashboardcomponents/earningsSummary";
import BiddingSummary from "./dashboardcomponents/bidingSummary";
import ProjectsSummary from "./dashboardcomponents/projectsSummary";
import RecentJobsSummary from "./dashboardcomponents/recentJobsSummary";
import { selectIsSidebarMinimized } from "../../redux/reducers/dashboard/sidebarSlice";
import { selectUsername, selectRole } from "../../redux/Features/user/authSlice";

const UnifiedDashboard = () => {
  const isSidebarMinimized = useSelector(selectIsSidebarMinimized);
  const userName = useSelector(selectUsername);
  const userRole = useSelector(selectRole);

  const renderDashboardComponents = () => {
    switch (userRole) {
      case "freelancer":
        return (
          <div className="space-y-6">
            <BiddingSummary />
            <RecentJobsSummary />
            <ProjectsSummary />
            <EarningsSummary />
          </div>
        );
      case "enterprise":
        return (
          <div className="space-y-6">
            <BiddingSummary />
            <ProjectsSummary />
            <EarningsSummary />
          </div>
        );
      case "hybrid":
        return (
          <div className="space-y-6">
            <BiddingSummary />
            <RecentJobsSummary />
            <ProjectsSummary />
            <EarningsSummary />
          </div>
        );
      default:
        return (
          <div className="text-center text-gray-400">
            Loading dashboard components...
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar />
      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarMinimized ? "ml-16" : ""
        }`}
      >
        <div className="flex flex-col p-6 min-h-screen">
          <div className="flex justify-between items-center bg-gray-800 p-6 mb-6 rounded-xl shadow-lg border border-gray-700">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white mb-1">Welcome back, {userName}!</span>
              <span className="text-sm text-gray-400 capitalize">{userRole} Dashboard</span>
            </div>
            <div className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>

          <div className="flex-1">
            {renderDashboardComponents()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedDashboard;
