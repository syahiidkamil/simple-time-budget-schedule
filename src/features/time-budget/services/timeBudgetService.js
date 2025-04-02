import dbData from '../../../data/db.json';
import { 
  formatDateToString, 
  getCurrentDate, 
  getNextDays 
} from '../utils/timeUtils';

// Helper function to initialize data from localStorage or default data
const getInitialData = () => {
  // Default structure
  const defaultStructure = {
    categories: [],
    budgets: [],
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
      // Ensure key arrays exist
      if (!parsedData.categories) parsedData.categories = [];
      if (!parsedData.budgets) parsedData.budgets = [];
      return parsedData;
    } catch (error) {
      console.error('Error parsing stored timebudget data:', error);
    }
  }
  
  // If no stored data or parsing error, return default data
  const defaultData = dbData.timebudget || defaultStructure;
  // Ensure key arrays exist
  if (!defaultData.categories) defaultData.categories = [];
  if (!defaultData.budgets) defaultData.budgets = [];
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

// Ensure we have budget entries for today and the next few days
const ensureUpcomingBudgets = (data, resetTime) => {
  if (!data.categories) data.categories = [];
  if (!data.budgets) data.budgets = [];
  
  // Get the next few days
  const nextThreeDays = getNextDays(resetTime, 3);
  
  nextThreeDays.forEach(date => {
    const dateString = formatDateToString(date);
    
    // Check if we already have a budget for this date
    const existingBudget = data.budgets.find(budget => budget.date === dateString);
    
    if (!existingBudget) {
      // Create allocations based on categories
      const allocations = data.categories.map(category => ({
        categoryId: category.id,
        hours: category.defaultHours || 0,
        minutes: category.defaultMinutes || 0
      }));
      
      // Create a new budget entry
      data.budgets.push({
        date: dateString,
        allocations: allocations
      });
    }
  });
  
  return data;
};

// Make sure we have budgets for upcoming days
timebudgetData = ensureUpcomingBudgets(timebudgetData, timebudgetData.resetTime);
saveData(timebudgetData);

// Service methods for time budget operations
const timeBudgetService = {
  // Create a completely empty budget for a date
  createEmptyBudget: (dateString) => {
    // Check if budget already exists
    const existingBudgetIndex = timebudgetData.budgets.findIndex(b => b.date === dateString);
    
    if (existingBudgetIndex !== -1) {
      // Replace existing budget with empty one
      timebudgetData.budgets[existingBudgetIndex].allocations = [];
    } else {
      // Create a new empty budget
      timebudgetData.budgets.push({
        date: dateString,
        allocations: []
      });
      
      // Sort budgets by date
      timebudgetData.budgets.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    
    // Save changes
    saveData(timebudgetData);
    
    return Promise.resolve({ success: true, date: dateString });
  },
  
  // Clear all allocations from a budget
  clearBudget: (dateString) => {
    const budgetIndex = timebudgetData.budgets.findIndex(b => b.date === dateString);
    
    if (budgetIndex !== -1) {
      // Clear all allocations
      timebudgetData.budgets[budgetIndex].allocations = [];
      
      // Save changes
      saveData(timebudgetData);
    }
    
    return Promise.resolve({ success: true, date: dateString });
  },
  
  // Get all categories
  getAllCategories: () => {
    return Promise.resolve([...timebudgetData.categories]);
  },
  
  // Get all budget entries
  getAllBudgets: () => {
    return Promise.resolve([...timebudgetData.budgets]);
  },
  
  // Get budget data for a specific date (with category details)
  getBudgetForDate: (dateString) => {
    // Find or create the budget for this date
    let budget = timebudgetData.budgets.find(b => b.date === dateString);
    
    if (!budget) {
      // Ensure budgets exist for upcoming days and try again
      timebudgetData = ensureUpcomingBudgets(timebudgetData, timebudgetData.resetTime);
      saveData(timebudgetData);
      
      budget = timebudgetData.budgets.find(b => b.date === dateString);
      
      // If still no budget, create an empty one
      if (!budget) {
        const newBudget = {
          date: dateString,
          allocations: []
        };
        
        timebudgetData.budgets.push(newBudget);
        saveData(timebudgetData);
        budget = newBudget;
      }
    }
    
    // Join allocations with category details
    const budgetWithCategories = budget.allocations.map(allocation => {
      const category = timebudgetData.categories.find(c => c.id === allocation.categoryId);
      return {
        ...allocation,
        name: category ? category.name : 'Unknown',
        color: category ? category.color : '#CCCCCC'
      };
    });
    
    return Promise.resolve(budgetWithCategories);
  },
  
  // Add a new category
  addCategory: (categoryData) => {
    const newCategory = {
      id: Math.random().toString(36).substr(2, 9), // Generate a random ID
      name: categoryData.name,
      color: categoryData.color,
      defaultHours: categoryData.hours || 0,
      defaultMinutes: categoryData.minutes || 0
    };
    
    // Add to categories array
    timebudgetData.categories.push(newCategory);
    
    // Add allocation for this category to all existing budgets
    timebudgetData.budgets.forEach(budget => {
      budget.allocations.push({
        categoryId: newCategory.id,
        hours: categoryData.hours || 0,
        minutes: categoryData.minutes || 0
      });
    });
    
    // Save changes to localStorage
    saveData(timebudgetData);
    
    return Promise.resolve(newCategory);
  },
  
  // Update a category
  updateCategory: (categoryId, updates) => {
    // Find and update the category
    const categoryIndex = timebudgetData.categories.findIndex(c => c.id === categoryId);
    
    if (categoryIndex !== -1) {
      const oldCategory = timebudgetData.categories[categoryIndex];
      
      // Update category properties
      timebudgetData.categories[categoryIndex] = {
        ...oldCategory,
        name: updates.name !== undefined ? updates.name : oldCategory.name,
        color: updates.color !== undefined ? updates.color : oldCategory.color,
        defaultHours: updates.defaultHours !== undefined ? updates.defaultHours : oldCategory.defaultHours,
        defaultMinutes: updates.defaultMinutes !== undefined ? updates.defaultMinutes : oldCategory.defaultMinutes
      };
      
      // If updating default hours/minutes, update all future budgets
      if (updates.defaultHours !== undefined || updates.defaultMinutes !== undefined) {
        const today = formatDateToString(getCurrentDate(timebudgetData.resetTime));
        
        // Only update allocations for future dates
        timebudgetData.budgets.forEach(budget => {
          if (budget.date >= today) {
            const allocationIndex = budget.allocations.findIndex(a => a.categoryId === categoryId);
            if (allocationIndex !== -1) {
              // Update the allocation with new default values if provided
              if (updates.defaultHours !== undefined) {
                budget.allocations[allocationIndex].hours = updates.defaultHours;
              }
              if (updates.defaultMinutes !== undefined) {
                budget.allocations[allocationIndex].minutes = updates.defaultMinutes;
              }
            }
          }
        });
      }
      
      // Save changes to localStorage
      saveData(timebudgetData);
    }
    
    return Promise.resolve({
      id: categoryId,
      ...updates
    });
  },
  
  // Delete a category
  deleteCategory: (categoryId) => {
    // Remove from categories array
    timebudgetData.categories = timebudgetData.categories.filter(c => c.id !== categoryId);
    
    // Remove allocations for this category from all budgets
    timebudgetData.budgets.forEach(budget => {
      budget.allocations = budget.allocations.filter(a => a.categoryId !== categoryId);
    });
    
    // Save changes to localStorage
    saveData(timebudgetData);
    
    return Promise.resolve({ success: true });
  },
  
  // Update allocation for a specific date
  updateAllocation: (dateString, categoryId, updates) => {
    // Find the budget for this date
    const budget = timebudgetData.budgets.find(b => b.date === dateString);
    
    if (budget) {
      // Find the allocation for this category
      const allocationIndex = budget.allocations.findIndex(a => a.categoryId === categoryId);
      
      if (allocationIndex !== -1) {
        // Update the allocation
        budget.allocations[allocationIndex] = {
          ...budget.allocations[allocationIndex],
          hours: updates.hours !== undefined ? updates.hours : budget.allocations[allocationIndex].hours,
          minutes: updates.minutes !== undefined ? updates.minutes : budget.allocations[allocationIndex].minutes
        };
        
        // Save changes to localStorage
        saveData(timebudgetData);
      }
    }
    
    return Promise.resolve({
      categoryId,
      ...updates
    });
  },
  
  // Copy budget from one date to another
  copyBudget: (fromDate, toDate) => {
    const sourceBudget = timebudgetData.budgets.find(b => b.date === fromDate);
    
    if (sourceBudget) {
      // Find or create the target budget
      let targetBudgetIndex = timebudgetData.budgets.findIndex(b => b.date === toDate);
      
      if (targetBudgetIndex !== -1) {
        // Deep copy allocations from source to target
        timebudgetData.budgets[targetBudgetIndex].allocations = 
          JSON.parse(JSON.stringify(sourceBudget.allocations));
      } else {
        // Create a new budget entry with allocations from source
        timebudgetData.budgets.push({
          date: toDate,
          allocations: JSON.parse(JSON.stringify(sourceBudget.allocations))
        });
        
        // Sort budgets by date for better organization
        timebudgetData.budgets.sort((a, b) => new Date(a.date) - new Date(b.date));
      }
      
      // Save changes to localStorage
      saveData(timebudgetData);
    }
    
    return Promise.resolve({ success: true, date: toDate });
  },
  
  // Delete a budget for a specific date
  deleteBudget: (dateString) => {
    console.log('TimeBudgetService: Deleting budget for date', dateString);
    
    // Find the budget for this date
    const budgetIndex = timebudgetData.budgets.findIndex(b => b.date === dateString);
    console.log('TimeBudgetService: Found budget at index', budgetIndex);
    
    if (budgetIndex !== -1) {
      // Remove the budget entry completely
      timebudgetData.budgets.splice(budgetIndex, 1);
      console.log('TimeBudgetService: Budget removed, saving changes');
      
      // Save changes to localStorage
      saveData(timebudgetData);
      console.log('TimeBudgetService: Changes saved');
    } else {
      console.log('TimeBudgetService: No budget found to delete');
    }
    
    return Promise.resolve({ success: true, date: dateString });
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
  getUpcomingDates: (numberOfDays = 3) => {
    // Ensure we have budgets for upcoming days
    timebudgetData = ensureUpcomingBudgets(timebudgetData, timebudgetData.resetTime);
    saveData(timebudgetData);
    
    // Get the next few days based on the reset time
    const nextDays = getNextDays(timebudgetData.resetTime, numberOfDays);
    const dateStrings = nextDays.map(date => formatDateToString(date));
    
    // Also include any custom dates that are in the future but not in the default range
    const today = formatDateToString(getCurrentDate(timebudgetData.resetTime));
    const customFutureDates = timebudgetData.budgets
      .filter(budget => {
        // Only include dates that are in the future but not already in dateStrings
        return budget.date >= today && !dateStrings.includes(budget.date);
      })
      .map(budget => budget.date);
    
    // Combine and sort all dates
    const allDates = [...dateStrings, ...customFutureDates].sort();
    
    return Promise.resolve(allDates);
  },
  
  // Get archived dates (dates before today)
  getArchivedDates: () => {
    if (!timebudgetData.budgets) {
      return Promise.resolve([]);
    }
    
    const today = formatDateToString(getCurrentDate(timebudgetData.resetTime));
    
    // Get all dates before today
    const archivedDates = timebudgetData.budgets
      .filter(budget => budget.date < today)
      .map(budget => budget.date)
      .sort((a, b) => new Date(b) - new Date(a)); // Sort in descending order
    
    return Promise.resolve(archivedDates);
  }
};

export default timeBudgetService;