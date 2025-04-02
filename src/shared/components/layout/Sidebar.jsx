import React from "react";
import { Link, useLocation } from "react-router";
import { useAuth } from "../../../features/auth/hooks/useAuth";

// Import SVG icons from public folder
const SidebarLink = ({ to, icon, text, active }) => {
  return (
    <Link
      to={to}
      className={`flex items-center mb-4 p-2 rounded-lg hover:bg-blue-50 ${
        active ? "bg-blue-100 text-blue-700" : "text-gray-600"
      }`}
    >
      <span className="mr-3 w-5 h-5">{icon}</span>
      <span>{text}</span>
    </Link>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  // Helper to check if the current path is active
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="bg-white w-64 shadow-md p-4 h-full">
      <div className="flex items-center justify-center mb-6 p-4">
        <h1 className="text-xl font-bold text-blue-600">Time Budget</h1>
      </div>
      
      <div className="space-y-1">
        <SidebarLink
          to="/dashboard"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          }
          text="Dashboard"
          active={isActive("/") || isActive("/dashboard")}
        />
        
        <SidebarLink
          to="/time-budget"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 2a6 6 0 110 12 6 6 0 010-12z" />
              <path d="M10 4a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 4z" />
              <path d="M10 12a1 1 0 100-2 1 1 0 000 2z" />
            </svg>
          }
          text="Time Budget"
          active={isActive("/time-budget")}
        />
        
        <SidebarLink
          to="/schedule"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
          }
          text="Schedule"
          active={isActive("/schedule")}
        />
      </div>
    </div>
  );
};

export default Sidebar;