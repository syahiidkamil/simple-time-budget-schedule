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
        <h1 className="text-xl font-bold text-blue-600">App Dashboard</h1>
      </div>
      
      <div className="space-y-1">
        <SidebarLink
          to="/"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          }
          text="Dashboard"
          active={isActive("/") || isActive("/dashboard")}
        />
        
        <SidebarLink
          to="/profile"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          }
          text="Profile"
          active={isActive("/profile")}
        />
      </div>
    </div>
  );
};

export default Sidebar;