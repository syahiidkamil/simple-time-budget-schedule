import React, { useState } from 'react';
import { useTimeBudget } from '../hooks/useTimeBudget';
import CategoryForm from './CategoryForm';

const CategoryManagement = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useTimeBudget();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const handleAddCategory = async (categoryData) => {
    try {
      await addCategory(categoryData);
      setShowAddForm(false);
    } catch (err) {
      console.error('Error adding category:', err);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory({
      id: category.id,
      name: category.name,
      color: category.color,
      hours: category.defaultHours || 0,
      minutes: category.defaultMinutes || 0
    });
  };

  const handleUpdateCategory = async (updatedCategory) => {
    try {
      await updateCategory(updatedCategory.id, {
        name: updatedCategory.name,
        color: updatedCategory.color,
        defaultHours: updatedCategory.hours,
        defaultMinutes: updatedCategory.minutes
      });
      setEditingCategory(null);
    } catch (err) {
      console.error('Error updating category:', err);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category? This will remove it from all budgets.')) {
      try {
        await deleteCategory(categoryId);
      } catch (err) {
        console.error('Error deleting category:', err);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Category Management</h3>
        {!showAddForm && !editingCategory && (
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
            Add New Category
          </button>
        )}
      </div>
      
      <p className="text-gray-600">
        Categories represent types of activities you spend time on. Each category has a default time allocation
        that will be applied when creating new daily budgets.
      </p>
      
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex justify-between mb-4">
            <h3 className="font-semibold text-lg text-indigo-700">Add New Category</h3>
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
      
      {editingCategory && (
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex justify-between mb-4">
            <h3 className="font-semibold text-lg text-indigo-700">Edit Category</h3>
            <button 
              onClick={() => setEditingCategory(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <CategoryForm 
            initialValues={editingCategory}
            onSubmit={handleUpdateCategory} 
            onCancel={() => setEditingCategory(null)}
            isEditing={true}
          />
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Available Categories</h3>
        
        <div className="space-y-4">
          {categories && categories.length > 0 ? (
            categories.map(category => (
              <div key={category.id} className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-gray-300">
                <div 
                  className="w-4 h-4 rounded-full mr-3" 
                  style={{ backgroundColor: category.color }}
                ></div>
                <span className="font-medium text-gray-800">{category.name}</span>
                
                <div className="ml-auto flex items-center">
                  <span className="text-sm text-gray-500 mr-2">Default: </span>
                  <span className="text-sm font-medium text-gray-600 mr-4">
                    {`${category.defaultHours || 0}h ${category.defaultMinutes || 0}m`}
                  </span>
                  
                  <button 
                    onClick={() => handleEditCategory(category)}
                    className="text-gray-400 hover:text-indigo-600 mr-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleDeleteCategory(category.id)}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              No categories yet. Add your first category to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryManagement;