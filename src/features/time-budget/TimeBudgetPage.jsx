import React, { useState } from "react";
import DaySelector from "./components/DaySelector";
import TimeStatus from "./components/TimeStatus";
import BudgetPieChart from "./components/BudgetPieChart";
import CategoryList from "./components/CategoryList";
import CategoryManagement from "./components/CategoryManagement";
import { useTimeBudget } from "./hooks/useTimeBudget";

const TimeBudgetPage = () => {
  const { loading, error } = useTimeBudget();
  const [activeTab, setActiveTab] = useState("allocations"); // 'allocations' or 'categories'

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
    <div className="bg-white shadow rounded-lg p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Time Budget</h2>
      <p className="mb-6 text-gray-600">
        Manage your daily time allocations for different activities.
      </p>
      
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex -mb-px space-x-8">
          <button
            onClick={() => setActiveTab('allocations')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'allocations'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Daily Allocations
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'categories'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Category Management
          </button>
        </nav>
      </div>
      
      {activeTab === 'allocations' ? (
        // Daily Allocations Tab Content
        <div className="space-y-6">
          <DaySelector />
          <TimeStatus />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <BudgetPieChart />
            </div>
            <div className="lg:col-span-2">
              <CategoryList showAddButton={true} />
            </div>
          </div>
        </div>
      ) : (
        // Category Management Tab Content
        <CategoryManagement />
      )}
    </div>
  );
};

export default TimeBudgetPage;