import React, { useState } from 'react';
import { useTimeBudget } from '../hooks/useTimeBudget';

const DaySelector = () => {
  const { selectedDay, setSelectedDay, daysWithDates, copyBudget } = useTimeBudget();
  const [showCopyDialog, setShowCopyDialog] = useState(false);
  const [copyTo, setCopyTo] = useState('');

  const handleCopyBudget = async () => {
    if (!copyTo) return;
    
    try {
      await copyBudget(selectedDay, copyTo);
      setShowCopyDialog(false);
      // If the user copied to the current day, they'll see the changes immediately
      // Otherwise, they'll see them when they navigate to that day
    } catch (err) {
      console.error('Error copying budget:', err);
    }
  };

  return (
    <div className="flex items-center mb-6 bg-white rounded-lg p-4 shadow-sm">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-gray-500 mr-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      
      <div className="flex space-x-2">
        {Object.keys(daysWithDates).map((day) => (
          <button
            key={day}
            className={`px-4 py-2 rounded-md ${
              selectedDay === day
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setSelectedDay(day)}
          >
            {daysWithDates[day]}
          </button>
        ))}
      </div>
      
      <button
        onClick={() => setShowCopyDialog(true)}
        className="ml-auto flex items-center text-gray-600 hover:text-indigo-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
        <span>Copy Budget</span>
      </button>
      
      {/* Copy Budget Dialog */}
      {showCopyDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Copy Budget</h3>
            <p className="mb-4">
              Copy budget from <strong>{selectedDay}</strong> to:
            </p>
            
            <div className="mb-4">
              <select
                value={copyTo}
                onChange={(e) => setCopyTo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select a day</option>
                {Object.keys(daysWithDates)
                  .filter((day) => day !== selectedDay)
                  .map((day) => (
                    <option key={day} value={day}>
                      {daysWithDates[day]}
                    </option>
                  ))}
              </select>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={() => setShowCopyDialog(false)}
                className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCopyBudget}
                disabled={!copyTo}
                className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                  copyTo
                    ? 'bg-indigo-600 hover:bg-indigo-700'
                    : 'bg-indigo-400 cursor-not-allowed'
                }`}
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DaySelector;