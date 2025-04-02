import dbData from '../../../data/db.json';
import { 
  formatDateToString, 
  getCurrentDate, 
  getNextDays 
} from '../utils/timeUtils';

// Helper function to initialize data from localStorage or default data
const getInitialData = () => {
  // Default structure in case entries don't exist
  const defaultStructure = {
    entries: [],
    resetTime: "22:00"
  };
  
  if (typeof window === 'undefined') {
    return dbData.timebudget || defaultStructure; // Return default data on server side
  }
  
  // Try to get data from localStorage
  const storedData = localStorage.getItem('timebudget');
  if (storedData) {
    try {
      const parsedData = JSON.parse(storedData);
      // Ensure entries array exists
      if (!parsedData.entries) {
        parsedData.entries = [];
      }
      return parsedData;
    } catch (error) {
      console.error('Error parsing stored timebudget data:', error);
    }
  }
  
  // If no stored data or parsing error, return default data
  const defaultData = dbData.timebudget || defaultStructure;
  // Ensure entries array exists
  if (!defaultData.entries) {
    defaultData.entries = [];
  }
  return defaultData;
};

// Helper function to save data to localStorage
const saveData = (data) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('timebudget', JSON.stringify(data));
  }
};

// Initialize data
let timebudgetData = getInitialData();

// Ensure we have entries for today and the next few days
const ensureUpcomingDates = (data, resetTime) => {
  if (!data.entries) {
    data.entries = [];
  }
  
  const nextThreeDays = getNextDays(resetTime, 3);
  
  nextThreeDays.forEach(date => {
    const dateString = formatDateToString(date);
    
    // Check if we already have an entry for this date
    const exists = data.entries.some(entry => entry.date === dateString);
    
    if (!exists) {
      // Create a new entry with default categories or copy from the most recent entry
      let categories = [];
      
      if (data.entries.length > 0) {
        // Sort entries by date in descending order
        const sortedEntries = [...data.entries].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        
        // Copy categories from the most recent entry
        categories = JSON.parse(JSON.stringify(sortedEntries[0].categories || []));
      } else {
        // Default categories if no existing entries
        categories = [
          { id: "1", name: "Work", color: "#4F46E5", hours: 8, minutes: 0 },
          { id: "2", name: "Sleep", color: "#8B5CF6", hours: 8, minutes: 0 },
          { id: "3", name: "Personal", color: "#EC4899", hours: 5, minutes: 30 },
          { id: "4", name: "Exercise", color: "#10B981", hours: 1, minutes: 0 }
        ];
      }
      
      // Add the new entry
      data.entries.push({
        date: dateString,
        categories
      });
    }
  });
  
  return data;
};

// Make sure we have entries for upcoming days
timebudgetData = ensureUpcomingDates(timebudgetData, timebudgetData.resetTime);
saveData(timebudgetData);

// Service methods for time budget operations
const timeBudgetService = {
  // Get all entries
  getAllEntries: () => {
    return Promise.resolve([...timebudgetData.entries]);
  },

  // Get categories for a specific date
  getCategoriesForDate: (dateString) => {
    const entry = timebudgetData.entries.find(e => e.date === dateString);
    
    if (!entry) {
      // Create a new entry if it doesn't exist
      timebudgetData = ensureUpcomingDates(timebudgetData, timebudgetData.resetTime);
      saveData(timebudgetData);
      
      // Try to find the entry again
      const newEntry = timebudgetData.entries.find(e => e.date === dateString);
      return Promise.resolve(newEntry ? [...newEntry.categories] : []);
    }
    
    return Promise.resolve([...(entry.categories || [])]);
  },

  // Add a new category to all dates
  addCategory: (category) => {
    const newCategory = {
      ...category,
      id: Math.random().toString(36).substr(2, 9) // Generate a random ID
    };
    
    // Add to all entries
    timebudgetData.entries.forEach(entry => {
      if (!entry.categories) {
        entry.categories = [];
      }
      entry.categories.push({...newCategory});
    });
    
    // Save changes to localStorage
    saveData(timebudgetData);
    
    return Promise.resolve(newCategory);
  },

  // Update a category across all dates
  updateCategory: (categoryId, updates) => {
    // Update the category in all entries
    timebudgetData.entries.forEach(entry => {
      if (!entry.categories) {
        entry.categories = [];
        return;
      }
      
      const index = entry.categories.findIndex(c => c.id === categoryId);
      if (index !== -1) {
        entry.categories[index] = {
          ...entry.categories[index],
          ...updates
        };
      }
    });
    
    // Save changes to localStorage
    saveData(timebudgetData);
    
    return Promise.resolve({
      id: categoryId,
      ...updates
    });
  },

  // Delete a category from all dates
  deleteCategory: (categoryId) => {
    // Remove from all entries
    timebudgetData.entries.forEach(entry => {
      if (entry.categories) {
        entry.categories = entry.categories.filter(c => c.id !== categoryId);
      }
    });
    
    // Save changes to localStorage
    saveData(timebudgetData);
    
    return Promise.resolve({ success: true });
  },

  // Update a category for a specific date
  updateCategoryForDate: (dateString, categoryId, updates) => {
    const entry = timebudgetData.entries.find(e => e.date === dateString);
    
    if (entry) {
      if (!entry.categories) {
        entry.categories = [];
      }
      
      const index = entry.categories.findIndex(c => c.id === categoryId);
      if (index !== -1) {
        entry.categories[index] = {
          ...entry.categories[index],
          ...updates
        };
        
        // Save changes to localStorage
        saveData(timebudgetData);
      }
    }
    
    return Promise.resolve({
      id: categoryId,
      ...updates
    });
  },

  // Copy budget from one date to another
  copyBudget: (fromDate, toDate) => {
    const sourceEntry = timebudgetData.entries.find(e => e.date === fromDate);
    
    if (sourceEntry) {
      // Find target entry or create it
      let targetEntry = timebudgetData.entries.find(e => e.date === toDate);
      
      if (!targetEntry) {
        targetEntry = { date: toDate, categories: [] };
        timebudgetData.entries.push(targetEntry);
      }
      
      // Deep copy categories
      targetEntry.categories = JSON.parse(JSON.stringify(sourceEntry.categories || []));
      
      // Save changes to localStorage
      saveData(timebudgetData);
    }
    
    return Promise.resolve({ success: true });
  },

  // Get reset time
  getResetTime: () => {
    return Promise.resolve(timebudgetData.resetTime);
  },

  // Update reset time
  updateResetTime: (newTime) => {
    timebudgetData.resetTime = newTime;
    
    // Save changes to localStorage
    saveData(timebudgetData);
    
    return Promise.resolve({ success: true, resetTime: newTime });
  },
  
  // Get upcoming dates based on reset time
  getUpcomingDates: () => {
    // Ensure we have entries for upcoming days
    timebudgetData = ensureUpcomingDates(timebudgetData, timebudgetData.resetTime);
    saveData(timebudgetData);
    
    // Get the next few days based on the reset time
    const nextDays = getNextDays(timebudgetData.resetTime, 3);
    const dateStrings = nextDays.map(date => formatDateToString(date));
    
    return Promise.resolve(dateStrings);
  },
  
  // Get archived dates (dates before today)
  getArchivedDates: () => {
    if (!timebudgetData.entries) {
      return Promise.resolve([]);
    }
    
    const today = formatDateToString(getCurrentDate(timebudgetData.resetTime));
    
    // Get all dates before today
    const archivedDates = timebudgetData.entries
      .filter(entry => entry.date < today)
      .map(entry => entry.date)
      .sort((a, b) => new Date(b) - new Date(a)); // Sort in descending order
    
    return Promise.resolve(archivedDates);
  }
};

export default timeBudgetService;