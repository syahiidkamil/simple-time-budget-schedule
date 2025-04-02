import React from 'react';
import { useTimeBudget } from '../hooks/useTimeBudget';
import { formatTime, calculateTimeUntilReset } from '../utils/timeUtils';

const TimeStatus = () => {
  const { 
    selectedDate, 
    dateLabels, 
    allocatedMinutes, 
    remainingMinutes, 
    resetTime 
  } = useTimeBudget();
  
  // Calculate time until reset
  const minutesUntilReset = calculateTimeUntilReset(resetTime);
  const timeUntilReset = formatTime(minutesUntilReset);

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            {dateLabels[selectedDate]}
          </h2>
          <div className="flex items-center mt-1">
            <div className="text-sm text-gray-500">
              <span className="font-medium text-gray-700">{formatTime(allocatedMinutes)}</span> allocated, 
              <span className={`font-medium ${remainingMinutes >= 0 ? 'text-green-600' : 'text-red-600'}`}> {formatTime(Math.abs(remainingMinutes))}</span> 
              {remainingMinutes >= 0 ? ' remaining' : ' over budget'}
            </div>
          </div>
        </div>
        <div className="flex items-center text-gray-500">
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
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-sm">Reset at {resetTime} ({timeUntilReset} until reset)</span>
        </div>
      </div>
    </div>
  );
};

export default TimeStatus;