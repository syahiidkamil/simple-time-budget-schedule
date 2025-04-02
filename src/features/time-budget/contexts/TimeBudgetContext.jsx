import React, { createContext, useState, useEffect, useCallback } from 'react';
import timeBudgetService from '../services/timeBudgetService';
import { 
  formatDateLabel, 
  getCurrentDate, 
  formatDateToString,
  getRelativeDateLabel
} from '../utils/timeUtils';

export const TimeBudgetContext = createContext(null);

export const TimeBudgetProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [upcomingDates, setUpcomingDates] = useState([]);
  const [archivedDates, setArchivedDates] = useState([]);
  const [resetTime, setResetTime] = useState('22:00');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showArchive, setShowArchive] = useState(false);
  
  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        
        // Get reset time
        const time = await timeBudgetService.getResetTime();
        setResetTime(time);
        
        // Get categories
        const allCategories = await timeBudgetService.getAllCategories();
        setCategories(allCategories);
        
        // Get upcoming dates
        const dates = await timeBudgetService.getUpcomingDates();
        setUpcomingDates(dates);
        
        // Get archived dates
        const archived = await timeBudgetService.getArchivedDates();
        setArchivedDates(archived);
        
        // Set the selected date to today
        const today = formatDateToString(getCurrentDate(time));
        setSelectedDate(today);
        
        // Get budget for today
        const budgetData = await timeBudgetService.getBudgetForDate(today);
        setAllocations(budgetData);
        
        setLoading(false);
      } catch (err) {
        console.error('Error initializing time budget data:', err);
        setError('Failed to load time budget data');
        setLoading(false);
      }
    };
    
    initializeData();
  }, []);
  
  // Load allocations when selected date changes
  useEffect(() => {
    const loadAllocations = async () => {
      if (!selectedDate) return;
      
      try {
        setLoading(true);
        const budgetData = await timeBudgetService.getBudgetForDate(selectedDate);
        setAllocations(budgetData);
        setLoading(false);
      } catch (err) {
        console.error('Error loading budget for date:', err);
        setError('Failed to load budget data');
        setLoading(false);
      }
    };
    
    loadAllocations();
  }, [selectedDate]);
  
  // Add a new category
  const addCategory = useCallback(async (categoryData) => {
    try {
      const newCategory = await timeBudgetService.addCategory(categoryData);
      setCategories(prev => [...prev, newCategory]);
      
      // Refresh allocations for the current date
      const budgetData = await timeBudgetService.getBudgetForDate(selectedDate);
      setAllocations(budgetData);
      
      return newCategory;
    } catch (err) {
      console.error('Error adding category:', err);
      setError('Failed to add category');
      throw err;
    }
  }, [selectedDate]);
  
  // Update a category
  const updateCategory = useCallback(async (categoryId, updates) => {
    try {
      await timeBudgetService.updateCategory(categoryId, updates);
      
      // Update local categories state
      setCategories(prev => 
        prev.map(cat => 
          cat.id === categoryId ? { ...cat, ...updates } : cat
        )
      );
      
      // Refresh allocations to reflect the category update
      const budgetData = await timeBudgetService.getBudgetForDate(selectedDate);
      setAllocations(budgetData);
    } catch (err) {
      console.error('Error updating category:', err);
      setError('Failed to update category');
      throw err;
    }
  }, [selectedDate]);
  
  // Delete a category
  const deleteCategory = useCallback(async (categoryId) => {
    try {
      await timeBudgetService.deleteCategory(categoryId);
      
      // Update local categories state
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
      
      // Refresh allocations to reflect the deleted category
      const budgetData = await timeBudgetService.getBudgetForDate(selectedDate);
      setAllocations(budgetData);
    } catch (err) {
      console.error('Error deleting category:', err);
      setError('Failed to delete category');
      throw err;
    }
  }, [selectedDate]);
  
  // Update allocation (time for a category on a specific date)
  const updateAllocation = useCallback(async (categoryId, updates) => {
    try {
      await timeBudgetService.updateAllocation(selectedDate, categoryId, updates);
      
      // Update local allocations state
      setAllocations(prev => 
        prev.map(alloc => 
          alloc.categoryId === categoryId ? { ...alloc, ...updates } : alloc
        )
      );
    } catch (err) {
      console.error('Error updating allocation:', err);
      setError('Failed to update time allocation');
      throw err;
    }
  }, [selectedDate]);
  
  // Copy budget from one date to another
  const copyBudget = useCallback(async (fromDate, toDate) => {
    try {
      await timeBudgetService.copyBudget(fromDate, toDate);
      
      // If the target date is the currently selected date, reload the allocations
      if (toDate === selectedDate) {
        const budgetData = await timeBudgetService.getBudgetForDate(selectedDate);
        setAllocations(budgetData);
      }
      
      return { success: true };
    } catch (err) {
      console.error('Error copying budget:', err);
      setError('Failed to copy budget');
      throw err;
    }
  }, [selectedDate]);
  
  // Calculate total allocated minutes
  const totalMinutes = 24 * 60;
  const allocatedMinutes = allocations.reduce((total, alloc) => 
    total + (alloc.hours * 60 + alloc.minutes), 0);
  const remainingMinutes = totalMinutes - allocatedMinutes;
  
  // Create date labels for UI
  const dateLabels = {};
  [...upcomingDates, ...archivedDates].forEach(date => {
    dateLabels[date] = formatDateLabel(date, resetTime);
  });
  
  // Helper to get date label type (Today, Tomorrow, Day After, or Normal)
  const getDateType = (date) => {
    return getRelativeDateLabel(date, resetTime) || 'Normal';
  };
  
  const value = {
    categories,
    allocations,
    selectedDate,
    setSelectedDate,
    upcomingDates,
    archivedDates,
    resetTime,
    loading,
    error,
    totalMinutes,
    allocatedMinutes,
    remainingMinutes,
    dateLabels,
    getDateType,
    addCategory,
    updateCategory,
    deleteCategory,
    updateAllocation,
    copyBudget,
    showArchive,
    setShowArchive
  };
  
  return (
    <TimeBudgetContext.Provider value={value}>
      {children}
    </TimeBudgetContext.Provider>
  );
};