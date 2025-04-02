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
        
        // Get upcoming dates
        const dates = await timeBudgetService.getUpcomingDates();
        setUpcomingDates(dates);
        
        // Get archived dates
        const archived = await timeBudgetService.getArchivedDates();
        setArchivedDates(archived);
        
        // Set the selected date to today
        const today = formatDateToString(getCurrentDate(time));
        setSelectedDate(today);
        
        // Get categories for today
        const dayCategories = await timeBudgetService.getCategoriesForDate(today);
        setCategories(dayCategories);
        
        setLoading(false);
      } catch (err) {
        console.error('Error initializing time budget data:', err);
        setError('Failed to load time budget data');
        setLoading(false);
      }
    };
    
    initializeData();
  }, []);
  
  // Load categories when selected date changes
  useEffect(() => {
    const loadCategories = async () => {
      if (!selectedDate) return;
      
      try {
        setLoading(true);
        const dayCategories = await timeBudgetService.getCategoriesForDate(selectedDate);
        setCategories(dayCategories);
        setLoading(false);
      } catch (err) {
        console.error('Error loading categories for date:', err);
        setError('Failed to load categories');
        setLoading(false);
      }
    };
    
    loadCategories();
  }, [selectedDate]);
  
  // Add a new category
  const addCategory = useCallback(async (category) => {
    try {
      const newCategory = await timeBudgetService.addCategory(category);
      setCategories(prev => [...prev, newCategory]);
      return newCategory;
    } catch (err) {
      console.error('Error adding category:', err);
      setError('Failed to add category');
      throw err;
    }
  }, []);
  
  // Update a category
  const updateCategory = useCallback(async (categoryId, updates) => {
    try {
      await timeBudgetService.updateCategoryForDate(selectedDate, categoryId, updates);
      setCategories(prev => 
        prev.map(cat => 
          cat.id === categoryId ? { ...cat, ...updates } : cat
        )
      );
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
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    } catch (err) {
      console.error('Error deleting category:', err);
      setError('Failed to delete category');
      throw err;
    }
  }, []);
  
  // Copy budget from one date to another
  const copyBudget = useCallback(async (fromDate, toDate) => {
    try {
      await timeBudgetService.copyBudget(fromDate, toDate);
      
      // If the target date is the currently selected date, reload the categories
      if (toDate === selectedDate) {
        const dayCategories = await timeBudgetService.getCategoriesForDate(selectedDate);
        setCategories(dayCategories);
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
  const allocatedMinutes = categories.reduce((total, cat) => 
    total + (cat.hours * 60 + cat.minutes), 0);
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