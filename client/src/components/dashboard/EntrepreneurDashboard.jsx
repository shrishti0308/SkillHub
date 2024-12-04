import React from "react";
import Sidebar from "../dashboard/dashboardcomponents/Sidebar";
import { selectIsSidebarMinimized } from "../../redux/reducers/dashboard/sidebarSlice";
import ProjectsSummary from "./dashboardcomponents/projectsSummary";
import { useSelector } from "react-redux";
import { selectUsername } from "../../redux/Features/user/authSlice";
import EarningsSummary from "./dashboardcomponents/earningsSummary";


const EntrepreneurDashboard = () => {
  const isSidebarMinimized = useSelector(selectIsSidebarMinimized);
  const userName = useSelector(selectUsername);
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />
      <div
        className={`flex flex-col flex-grow p-5 absolute ${isSidebarMinimized ? "left-16" : "left-56"} transition-all duration-300 mt-[70px]`}
      >
        <div className="flex justify-between items-center bg-dark p-4 mb-2">
          <span className="text-xl font-semibold">Welcome {userName}!</span>
        </div>

        <div className="flex flex-col space-y-4">
          <ProjectsSummary />
          <EarningsSummary />
          <div className="mt-4">fooooooter</div>
        </div>
      </div>
    </div>
  );
};

export default EntrepreneurDashboard;
