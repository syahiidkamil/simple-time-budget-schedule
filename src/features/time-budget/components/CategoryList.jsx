import React, { useState } from 'react';
import { useTimeBudget } from '../hooks/useTimeBudget';
import CategoryItem from './CategoryItem';
import CategoryForm from './CategoryForm';

const CategoryList = () => {
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
        <h2 className="text-lg font-semibold text-gray-800">Categories</h2>
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center text-sm text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-2 rounded-md"
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
                d="M12 4v16m8-8H4" 
              />
            </svg>
            Add Category
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="mb-4">
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
            No categories yet. Add your first category to get started.
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryList;