import React, { createContext, useState, useEffect, useCallback } from 'react';
import timeBudgetService from '../services/timeBudgetService';
import { getCurrentDayLabel, getDatesForDays, formatDate } from '../utils/timeUtils';

export const TimeBudgetContext = createContext(null);

export const TimeBudgetProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [selectedDay, setSelectedDay] = useState('Today');
  const [resetTime, setResetTime] = useState('22:00');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get dates for days based on reset time
  const dates = getDatesForDays(resetTime);
  
  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        
        // Get reset time
        const time = await timeBudgetService.getResetTime();
        setResetTime(time);
        
        // Set the selected day based on current time and reset time
        setSelectedDay(getCurrentDayLabel(time));
        
        // Get categories for the selected day
        const dayCategories = await timeBudgetService.getCategoriesForDay(selectedDay);
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
  
  // Load categories when selected day changes
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const dayCategories = await timeBudgetService.getCategoriesForDay(selectedDay);
        setCategories(dayCategories);
        setLoading(false);
      } catch (err) {
        console.error('Error loading categories for day:', err);
        setError('Failed to load categories');
        setLoading(false);
      }
    };
    
    if (selectedDay) {
      loadCategories();
    }
  }, [selectedDay]);
  
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
      await timeBudgetService.updateCategoryForDay(selectedDay, categoryId, updates);
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
  }, [selectedDay]);
  
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
  
  // Copy budget from one day to another
  const copyBudget = useCallback(async (fromDay, toDay) => {
    try {
      await timeBudgetService.copyBudget(fromDay, toDay);
      
      // If the target day is the currently selected day, reload the categories
      if (toDay === selectedDay) {
        const dayCategories = await timeBudgetService.getCategoriesForDay(selectedDay);
        setCategories(dayCategories);
      }
      
      return { success: true };
    } catch (err) {
      console.error('Error copying budget:', err);
      setError('Failed to copy budget');
      throw err;
    }
  }, [selectedDay]);
  
  // Calculate total allocated minutes
  const totalMinutes = 24 * 60;
  const allocatedMinutes = categories.reduce((total, cat) => 
    total + (cat.hours * 60 + cat.minutes), 0);
  const remainingMinutes = totalMinutes - allocatedMinutes;
  
  // Format days with dates
  const daysWithDates = {
    Today: `Today - ${formatDate(dates.Today)}`,
    Tomorrow: `Tomorrow - ${formatDate(dates.Tomorrow)}`,
    "Day After": `Day After - ${formatDate(dates["Day After"])}`
  };
  
  const value = {
    categories,
    selectedDay,
    setSelectedDay,
    resetTime,
    daysWithDates,
    loading,
    error,
    totalMinutes,
    allocatedMinutes,
    remainingMinutes,
    addCategory,
    updateCategory,
    deleteCategory,
    copyBudget
  };
  
  return (
    <TimeBudgetContext.Provider value={value}>
      {children}
    </TimeBudgetContext.Provider>
  );
};