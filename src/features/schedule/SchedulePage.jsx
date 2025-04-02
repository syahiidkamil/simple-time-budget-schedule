import React from "react";

const SchedulePage = () => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Schedule</h2>
      <p className="mb-6 text-gray-600">
        This is where you can plan your daily schedule with time blocks.
      </p>
      
      <div className="p-4 bg-green-50 border border-green-200 rounded-md">
        <p className="text-green-800">
          Coming soon: Time block scheduling system with morning, afternoon, and evening columns.
        </p>
      </div>
    </div>
  );
};

export default SchedulePage;