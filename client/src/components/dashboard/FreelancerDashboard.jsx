import React, { useState } from 'react';

const Dashboard = ({ userName }) => {
  const [isSidebarMinimized, setSidebarMinimized] = useState(false);

  const toggleSidebar = () => {
    setSidebarMinimized(!isSidebarMinimized);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className={`bg-dark text-light flex flex-col items-center ${isSidebarMinimized ? 'w-16' : 'w-64'} transition-width duration-300`}>
        <div className="flex items-center my-5">
          <h2 className={`text-2xl font-bold ${isSidebarMinimized ? 'hidden' : 'block'}`}>
            Freelancer Website
          </h2>
          <h2 className={`text-2xl font-bold ${isSidebarMinimized ? 'block' : 'hidden'}`}>
            F
          </h2>
          {/* Toggle button beside the logo */}
          <button className="ml-4 text-light bg-grey px-2 py-1 rounded" onClick={toggleSidebar}>
            {isSidebarMinimized ? '>' : '<'}
          </button>
        </div>
        {!isSidebarMinimized && (
          <nav>
            <ul className="space-y-5">
              <li><a href="#jobs" className="text-cyan-blue">Jobs</a></li>
              <li><a href="#biddings" className="text-cyan-blue">Biddings</a></li>
              <li><a href="#earnings" className="text-cyan-blue">Earnings</a></li>
              <li><a href="#projects" className="text-cyan-blue">Projects</a></li>
              <li><a href="#account" className="text-cyan-blue">Account</a></li>
            </ul>
          </nav>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-grow p-5">
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
