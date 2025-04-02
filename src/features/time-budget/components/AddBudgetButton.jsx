import React, { useState } from 'react';
import { useTimeBudget } from '../hooks/useTimeBudget';
import CategoryForm from './CategoryForm';

const AddBudgetButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { addCategory } = useTimeBudget();

  const handleAddCategory = async (categoryData) => {
    try {
      await addCategory(categoryData);
      setIsOpen(false);
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  if (isOpen) {
    return (
      <div className="mb-6 bg-white p-4 border border-indigo-200 rounded-lg shadow-sm">
        <div className="flex justify-between mb-4">
          <h3 className="font-semibold text-lg text-indigo-700">Add New Time Budget</h3>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <CategoryForm 
          onSubmit={handleAddCategory}
          onCancel={() => setIsOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg shadow transition-colors"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path 
            fillRule="evenodd" 
            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" 
            clipRule="evenodd" 
          />
        </svg>
        <span className="font-medium">Add New Time Budget</span>
      </button>
    </div>
  );
};

export default AddBudgetButton;