import React from "react";
import { useAuth } from "../auth/hooks/useAuth";

const DashboardHomePage = () => {
  const { user } = useAuth();

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Welcome to the Dashboard</h2>
      <p className="mb-4">
        Hello, {user?.name || "User"}! This is your dashboard home page.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-blue-100 p-4 rounded-lg shadow">
          <h3 className="font-bold text-blue-800 mb-2">Quick Stats</h3>
          <p>Your basic statistics will appear here.</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg shadow">
          <h3 className="font-bold text-green-800 mb-2">Recent Activity</h3>
          <p>Your recent activity will appear here.</p>
        </div>
        <div className="bg-purple-100 p-4 rounded-lg shadow">
          <h3 className="font-bold text-purple-800 mb-2">Actions</h3>
          <p>Quick actions will appear here.</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardHomePage;