import React, { useState } from 'react';
import { useTimeBudget } from '../hooks/useTimeBudget';
import CategoryItem from './CategoryItem';
import CategoryForm from './CategoryForm';

const CategoryList = ({ showAddButton = true }) => {
  const { allocations, addCategory } = useTimeBudget();
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddCategory = async (newCategory) => {
    try {
      await addCategory(newCategory);
      setShowAddForm(false);
    } catch (err) {
      console.error('Error adding category:', err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Daily Time Allocations</h2>
        {showAddButton && !showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center text-sm text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 4v16m8-8H4" 
              />
            </svg>
            Add Allocation
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="mb-4">
          <div className="flex justify-between mb-4">
            <h3 className="font-semibold text-lg text-indigo-700">Add Time Allocation</h3>
            <button 
              onClick={() => setShowAddForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <CategoryForm 
            onSubmit={handleAddCategory} 
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      <div className="space-y-4">
        {allocations && allocations.length > 0 ? (
          allocations.map(allocation => allocation && allocation.categoryId ? (
            <CategoryItem key={allocation.categoryId} allocation={allocation} />
          ) : null)
        ) : (
          <div className="p-4 text-center text-gray-500">
            No allocations yet. Add your first time allocation to get started.
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryList;