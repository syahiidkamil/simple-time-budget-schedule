import React, { useState } from 'react';
import { useTimeBudget } from '../hooks/useTimeBudget';
import CategoryForm from './CategoryForm';

const CategoryItem = ({ category }) => {
  const { updateCategory, deleteCategory } = useTimeBudget();
  const [isEditing, setIsEditing] = useState(false);
  const [hours, setHours] = useState(category.hours);
  const [minutes, setMinutes] = useState(category.minutes);

  const handleTimeChange = async (field, value) => {
    try {
      // Make sure value is a number and within valid range
      const numValue = parseInt(value, 10) || 0;
      
      if (field === 'hours') {
        // Limit hours to 0-24
        const newHours = Math.min(Math.max(numValue, 0), 24);
        setHours(newHours);
        await updateCategory(category.id, { hours: newHours });
      } else if (field === 'minutes') {
        // Limit minutes to 0-59
        const newMinutes = Math.min(Math.max(numValue, 0), 59);
        setMinutes(newMinutes);
        await updateCategory(category.id, { minutes: newMinutes });
      }
    } catch (err) {
      console.error('Error updating time:', err);
    }
  };

  const handleUpdate = async (updatedCategory) => {
    try {
      await updateCategory(category.id, updatedCategory);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating category:', err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(category.id);
      } catch (err) {
        console.error('Error deleting category:', err);
      }
    }
  };

  if (isEditing) {
    return (
      <CategoryForm 
        initialValues={category}
        onSubmit={handleUpdate}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-gray-300">
      <div 
        className="w-4 h-4 rounded-full mr-3" 
        style={{ backgroundColor: category.color }}
      ></div>
      <span className="font-medium text-gray-800">{category.name}</span>
      
      <div className="ml-auto flex items-center">
        <div className="flex items-center border border-gray-200 rounded-md mr-4">
          <div className="px-3 py-1">
            <input
              type="number"
              value={hours}
              onChange={(e) => handleTimeChange('hours', e.target.value)}
              className="w-12 text-center focus:outline-none"
              min="0"
              max="24"
            />
            <span className="text-gray-500">h</span>
          </div>
          <div className="px-3 py-1 border-l border-gray-200">
            <input
              type="number"
              value={minutes}
              onChange={(e) => handleTimeChange('minutes', e.target.value)}
              className="w-12 text-center focus:outline-none"
              min="0"
              max="59"
              step="5"
            />
            <span className="text-gray-500">m</span>
          </div>
        </div>
        
        <button 
          onClick={() => setIsEditing(true)}
          className="text-gray-400 hover:text-indigo-600 mr-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
        <button 
          onClick={handleDelete}
          className="text-gray-400 hover:text-red-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CategoryItem;