import React from "react";
import DaySelector from "./components/DaySelector";
import TimeStatus from "./components/TimeStatus";
import BudgetPieChart from "./components/BudgetPieChart";
import CategoryList from "./components/CategoryList";
import AddBudgetButton from "./components/AddBudgetButton";
import { useTimeBudget } from "./hooks/useTimeBudget";

const TimeBudgetPage = () => {
  const { loading, error } = useTimeBudget();

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Time Budget</h2>
      <p className="mb-6 text-gray-600">
        Manage your daily time allocations for different activities.
      </p>
      
      <div className="space-y-6">
        <DaySelector />
        <TimeStatus />
        <AddBudgetButton />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <BudgetPieChart />
          </div>
          <div className="lg:col-span-2">
            <CategoryList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeBudgetPage;