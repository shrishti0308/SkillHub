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
          <>
            <RecentJobsSummary />
            <BiddingSummary />
            <ProjectsSummary />
            <EarningsSummary />
          </>
        );
      case "enterprise":
        return (
          <>
            <ProjectsSummary />
            <BiddingSummary />
            <EarningsSummary />
          </>
        );
      case "hybrid":
        return (
          <>
            <RecentJobsSummary />
            <ProjectsSummary />
            <BiddingSummary />
            <EarningsSummary />
          </>
        );
      default:
        return (
          <div className="text-center text-gray-600">
            Loading dashboard components...
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />

      <div
        className={`flex flex-col flex-grow p-5 absolute ${
          isSidebarMinimized ? "left-16" : "left-56"
        } transition-all duration-300 mt-[70px]`}
      >
        <div className="flex justify-between items-center bg-dark p-4 mb-2">
          <span className="text-xl font-semibold">Welcome {userName}!</span>
          <span className="text-sm capitalize">{userRole} Dashboard</span>
        </div>

        <div className="flex flex-col space-y-4">
          {renderDashboardComponents()}
        </div>
      </div>
    </div>
  );
};

export default UnifiedDashboard;
