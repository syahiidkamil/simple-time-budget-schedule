import React from "react";
import DaySelector from "./components/DaySelector";
import TimeStatus from "./components/TimeStatus";
import BudgetPieChart from "./components/BudgetPieChart";
import CategoryList from "./components/CategoryList";

const TimeBudgetPageContent = () => {
  return (
    <div className="space-y-6">
      <DaySelector />
      <TimeStatus />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <BudgetPieChart />
        </div>
        <div className="lg:col-span-2">
          <CategoryList />
        </div>
      </div>
    </div>
  );
};

const TimeBudgetPage = () => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Time Budget</h2>
      <p className="mb-6 text-gray-600">
        Manage your daily time allocations for different activities.
      </p>
      
      <TimeBudgetPageContent />
    </div>
  );
};

export default TimeBudgetPage;