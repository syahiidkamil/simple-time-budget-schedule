import dbData from '../../../data/db.json';

// Helper function to initialize data from localStorage or default data
const getInitialData = () => {
  if (typeof window === 'undefined') {
    return dbData.timebudget; // Return default data on server side
  }
  
  // Try to get data from localStorage
  const storedData = localStorage.getItem('timebudget');
  if (storedData) {
    try {
      return JSON.parse(storedData);
    } catch (error) {
      console.error('Error parsing stored timebudget data:', error);
    }
  }
  
  // If no stored data or parsing error, return default data
  return dbData.timebudget;
};

// Helper function to save data to localStorage
const saveData = (data) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('timebudget', JSON.stringify(data));
  }
};

// Initialize data
let timebudgetData = getInitialData();

// In a real implementation, these would be API calls to endpoints
const timeBudgetService = {
  // Get all categories
  getCategories: () => {
    return Promise.resolve([...timebudgetData.categories]);
  },

  // Get categories for a specific day
  getCategoriesForDay: (day) => {
    return Promise.resolve([...timebudgetData.days[day]]);
  },

  // Add a new category
  addCategory: (category) => {
    const newCategory = {
      ...category,
      id: Math.random().toString(36).substr(2, 9) // Generate a random ID
    };
    
    // Add to the main categories list
    timebudgetData.categories.push(newCategory);
    
    // Also add to all days
    Object.keys(timebudgetData.days).forEach(day => {
      timebudgetData.days[day].push({...newCategory});
    });
    
    // Save changes to localStorage
    saveData(timebudgetData);
    
    return Promise.resolve(newCategory);
  },

  // Update a category
  updateCategory: (categoryId, updates) => {
    // Find and update the category in the main categories list
    const categoryIndex = timebudgetData.categories.findIndex(c => c.id === categoryId);
    if (categoryIndex !== -1) {
      timebudgetData.categories[categoryIndex] = {
        ...timebudgetData.categories[categoryIndex],
        ...updates
      };
    }
    
    // Update the category in all days
    Object.keys(timebudgetData.days).forEach(day => {
      const dayIndex = timebudgetData.days[day].findIndex(c => c.id === categoryId);
      if (dayIndex !== -1) {
        timebudgetData.days[day][dayIndex] = {
          ...timebudgetData.days[day][dayIndex],
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

  // Delete a category
  deleteCategory: (categoryId) => {
    // Remove from the main categories list
    timebudgetData.categories = timebudgetData.categories.filter(c => c.id !== categoryId);
    
    // Remove from all days
    Object.keys(timebudgetData.days).forEach(day => {
      timebudgetData.days[day] = timebudgetData.days[day].filter(c => c.id !== categoryId);
    });
    
    // Save changes to localStorage
    saveData(timebudgetData);
    
    return Promise.resolve({ success: true });
  },

  // Update category for a specific day
  updateCategoryForDay: (day, categoryId, updates) => {
    const categories = timebudgetData.days[day];
    const index = categories.findIndex(c => c.id === categoryId);
    
    if (index !== -1) {
      categories[index] = {
        ...categories[index],
        ...updates
      };
      
      // Save changes to localStorage
      saveData(timebudgetData);
    }
    
    return Promise.resolve({
      id: categoryId,
      ...updates
    });
  },

  // Copy budget from one day to another
  copyBudget: (fromDay, toDay) => {
    // Create deep copy of categories from the source day
    timebudgetData.days[toDay] = JSON.parse(JSON.stringify(timebudgetData.days[fromDay]));
    
    // Save changes to localStorage
    saveData(timebudgetData);
    
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
  }
};

export default timeBudgetService;