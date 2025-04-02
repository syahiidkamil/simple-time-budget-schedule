import React, { useState, useRef } from 'react';
import { useTimeBudget } from '../hooks/useTimeBudget';
import { formatDateToString, parseDate } from '../utils/timeUtils';

const DaySelector = () => {
  const { 
    selectedDate, 
    setSelectedDate, 
    upcomingDates, 
    archivedDates,
    dateLabels, 
    getDateType,
    copyBudget,
    showArchive,
    setShowArchive
  } = useTimeBudget();
  
  const [showCopyDialog, setShowCopyDialog] = useState(false);
  const [copyTo, setCopyTo] = useState('');
  const [customDate, setCustomDate] = useState('');
  const [useCustomDate, setUseCustomDate] = useState(false);
  const tabsRef = useRef(null);

  // Create a new budget with custom date
  const [showNewBudgetDialog, setShowNewBudgetDialog] = useState(false);
  const [newBudgetDate, setNewBudgetDate] = useState('');

  const createNewBudget = () => {
    // Set the date to tomorrow by default
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setNewBudgetDate(formatDateToString(tomorrow));
    setShowNewBudgetDialog(true);
  };

  const handleCreateBudget = async () => {
    if (!newBudgetDate) return;
    
    try {
      // Create an empty budget for the selected date
      await copyBudget(selectedDate, newBudgetDate); 
      setShowNewBudgetDialog(false);
      
      // Select the new date
      setSelectedDate(newBudgetDate);
    } catch (err) {
      console.error('Error creating new budget:', err);
    }
  };

  const handleCopyBudget = async () => {
    const targetDate = useCustomDate ? customDate : copyTo;
    if (!targetDate) return;
    
    try {
      await copyBudget(selectedDate, targetDate);
      setShowCopyDialog(false);
      setUseCustomDate(false);
      setCustomDate('');
      setCopyTo('');
      
      // If copying to a date not in the current view, add it and switch to it
      if (!upcomingDates.includes(targetDate) && !archivedDates.includes(targetDate)) {
        setSelectedDate(targetDate);
      }
    } catch (err) {
      console.error('Error copying budget:', err);
    }
  };
  
  // Handle horizontal scrolling for date tabs
  const handleScrollRight = () => {
    if (tabsRef.current) {
      tabsRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };
  
  const handleScrollLeft = () => {
    if (tabsRef.current) {
      tabsRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };
  
  // Get dates to display based on current view (upcoming or archive)
  const datesToDisplay = showArchive ? archivedDates : upcomingDates;

  // Handle custom date change
  const handleCustomDateChange = (e) => {
    const value = e.target.value;
    setCustomDate(value);
    setUseCustomDate(true);
  };

  // Reset dialog state when opened
  const openCopyDialog = () => {
    setUseCustomDate(false);
    setCustomDate('');
    setCopyTo('');
    setShowCopyDialog(true);
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
      <div className="flex items-center mb-4">
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
        <h3 className="text-lg font-medium text-gray-700">
          {showArchive ? 'Archive' : 'Budget Calendar'}
        </h3>
        
        <div className="ml-auto flex space-x-2">
          <button
            onClick={() => setShowArchive(!showArchive)}
            className="flex items-center text-sm px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-50"
          >
            {showArchive ? 'Show Upcoming' : 'Show Archive'}
          </button>
          
          <button
            onClick={openCopyDialog}
            className="flex items-center text-sm px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-50"
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
            Copy Budget
          </button>
          
          <button
            onClick={createNewBudget}
            className="flex items-center text-sm px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-50"
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
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add Budget
          </button>
        </div>
      </div>
      
      <div className="flex items-center">
        <button
          onClick={handleScrollLeft}
          className="flex-shrink-0 p-1 rounded-full hover:bg-gray-200 mr-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        
        <div 
          ref={tabsRef}
          className="flex space-x-2 overflow-x-auto hide-scrollbar flex-grow"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {datesToDisplay.map((date) => {
            const dateType = getDateType(date);
            const isSpecialDate = ['Today', 'Tomorrow', 'Day After'].includes(dateType);
            
            return (
              <button
                key={date}
                className={`px-4 py-2 rounded-md whitespace-nowrap ${
                  selectedDate === date
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setSelectedDate(date)}
              >
                {dateLabels[date]}
              </button>
            );
          })}
        </div>
        
        <button
          onClick={handleScrollRight}
          className="flex-shrink-0 p-1 rounded-full hover:bg-gray-200 ml-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {/* Copy Budget Dialog */}
      {showCopyDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Copy Budget</h3>
              <button
                onClick={() => setShowCopyDialog(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <p className="mb-4">
              Copy budget from <strong>{dateLabels[selectedDate]}</strong> to:
            </p>
            
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <input
                  type="radio"
                  id="selectExisting"
                  checked={!useCustomDate}
                  onChange={() => setUseCustomDate(false)}
                  className="mr-2"
                />
                <label htmlFor="selectExisting" className="text-sm font-medium text-gray-700">
                  Select existing date
                </label>
              </div>
              
              <select
                value={copyTo}
                onChange={(e) => {
                  setCopyTo(e.target.value);
                  setUseCustomDate(false);
                }}
                disabled={useCustomDate}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${useCustomDate ? 'bg-gray-100' : ''}`}
              >
                <option value="">Select a date</option>
                {upcomingDates
                  .filter((date) => date !== selectedDate)
                  .map((date) => (
                    <option key={date} value={date}>
                      {dateLabels[date]}
                    </option>
                  ))}
              </select>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <input
                  type="radio"
                  id="customDate"
                  checked={useCustomDate}
                  onChange={() => setUseCustomDate(true)}
                  className="mr-2"
                />
                <label htmlFor="customDate" className="text-sm font-medium text-gray-700">
                  Select custom date
                </label>
              </div>
              
              <input
                type="date"
                value={customDate}
                onChange={handleCustomDateChange}
                disabled={!useCustomDate}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${!useCustomDate ? 'bg-gray-100' : ''}`}
              />
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
                disabled={useCustomDate ? !customDate : !copyTo}
                className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                  (useCustomDate && customDate) || (!useCustomDate && copyTo)
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
      
      {/* Add Budget Dialog */}
      {showNewBudgetDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add New Budget</h3>
              <button
                onClick={() => setShowNewBudgetDialog(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <p className="mb-4">
              Select date for the new budget:
            </p>
            
            <div className="mb-6">
              <input
                type="date"
                value={newBudgetDate}
                onChange={(e) => setNewBudgetDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={() => setShowNewBudgetDialog(false)}
                className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateBudget}
                disabled={!newBudgetDate}
                className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                  newBudgetDate
                    ? 'bg-indigo-600 hover:bg-indigo-700'
                    : 'bg-indigo-400 cursor-not-allowed'
                }`}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DaySelector;