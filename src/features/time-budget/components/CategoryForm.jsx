import React, { useState, useEffect } from 'react';
import { useTimeBudget } from '../hooks/useTimeBudget';

// Predefined colors for easy selection
const predefinedColors = [
  '#4F46E5', // Indigo
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#3B82F6', // Blue
  '#14B8A6', // Teal
  '#F97316', // Orange
  '#6366F1', // Violet
  '#8B5CF6', // Purple
  '#06B6D4'  // Cyan
];

const CategoryForm = ({ 
  initialValues = { name: '', color: '#4F46E5', hours: 0, minutes: 0 }, 
  onSubmit, 
  onCancel,
  isEditing = false,
  timeOnly = false 
}) => {
  const { categories } = useTimeBudget();
  const [formData, setFormData] = useState(initialValues);
  const [error, setError] = useState('');
  const [createNew, setCreateNew] = useState(isEditing ? false : true);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  // Initialize internal state when the component mounts
  useEffect(() => {
    // When in edit mode, always use the provided initialValues
    if (isEditing) {
      setFormData(initialValues);
      setCreateNew(false); // Ensure we're not in create mode
    } else {
      // For add mode, set default state based on createNew flag
      if (createNew) {
        setFormData({ name: '', color: '#4F46E5', hours: 0, minutes: 0 });
      }
      // selectedCategoryId is handled by the other useEffect
    }
  }, [isEditing, initialValues, createNew]);

  // Handle changes when selecting an existing category (add mode only)
  useEffect(() => {
    if (!isEditing && !createNew && selectedCategoryId) {
      const selectedCategory = categories.find(c => c.id === selectedCategoryId);
      if (selectedCategory) {
        setFormData({
          id: selectedCategory.id,
          name: selectedCategory.name,
          color: selectedCategory.color,
          hours: selectedCategory.defaultHours || 0,
          minutes: selectedCategory.defaultMinutes || 0
        });
      }
    }
  }, [createNew, selectedCategoryId, categories, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleCategorySelect = (e) => {
    const categoryId = e.target.value;
    setSelectedCategoryId(categoryId);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // For timeOnly editing, skip name validation
    if (isEditing && timeOnly) {
      // No validation needed for timeOnly editing
      // Just make sure time values are valid (handled by input constraints)
    } else if (isEditing) {
      // For full editing, just validate that the name isn't empty
      if (!formData.name.trim()) {
        setError('Category name is required');
        return;
      }
    } else if (createNew) {
      // Validate form data for new category
      if (!formData.name.trim()) {
        setError('Category name is required');
        return;
      }
    } else {
      // Validate selected category when using existing
      if (!selectedCategoryId) {
        setError('Please select a category');
        return;
      }
    }
    
    // Convert hours and minutes to numbers
    const category = {
      ...formData,
      hours: parseInt(formData.hours, 10) || 0,
      minutes: parseInt(formData.minutes, 10) || 0,
    };
    
    onSubmit(category);
  };

  return (
    <form onSubmit={handleSubmit} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      {/* Clear indication of what we're doing - editing vs adding */}
      {isEditing && (
        <div className="mb-4 text-indigo-700 font-medium">
          {timeOnly ? 'Edit time allocation for' : 'Editing'} "{initialValues.name}" {timeOnly ? '' : 'category'}
        </div>
      )}
      
      {/* Display category info when in timeOnly edit mode */}
      {isEditing && timeOnly && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <div className="flex items-center p-2 border border-gray-200 rounded-md bg-gray-50">
            <div 
              className="w-4 h-4 rounded-full mr-2"
              style={{ backgroundColor: formData.color }}
            />
            <span className="text-gray-800">{formData.name}</span>
          </div>
        </div>
      )}
      
      {error && (
        <div className="mb-4 text-red-500 text-sm">
          {error}
        </div>
      )}
      
      {/* Option to select existing category or create new - only shown in add mode (not edit mode) */}
      {!isEditing && (
        <div className="mb-4">
          <div className="flex space-x-4">
            <div className="flex items-center">
              <input
                type="radio"
                id="useExisting"
                checked={!createNew}
                onChange={() => setCreateNew(false)}
                className="mr-2"
              />
              <label htmlFor="useExisting" className="text-sm font-medium text-gray-700">
                Use existing category
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="createNew"
                checked={createNew}
                onChange={() => setCreateNew(true)}
                className="mr-2"
              />
              <label htmlFor="createNew" className="text-sm font-medium text-gray-700">
                Create new category
              </label>
            </div>
          </div>
        </div>
      )}
      
      {/* Existing category selector - only shown in add mode when selecting existing category */}
      {!isEditing && !createNew && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Category
          </label>
          <select
            value={selectedCategoryId}
            onChange={handleCategorySelect}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      )}
      
      {/* Category name field (for new categories or when editing, not for timeOnly mode) */}
      {(createNew || (isEditing && !timeOnly)) && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., Work, Sleep, Exercise"
          />
        </div>
      )}
      
      {/* Color picker (for new categories or when editing, not for timeOnly mode) */}
      {(createNew || (isEditing && !timeOnly)) && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Color
          </label>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center">
              <input
                type="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="h-8 w-8 mr-3 rounded border-0"
              />
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="w-28 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {predefinedColors.map((color, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-8 h-8 rounded-full border ${formData.color === color ? 'border-2 border-black' : 'border-gray-300'}`}
                  style={{ backgroundColor: color }}
                  title={`Select color ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Display selected category color for existing categories in add mode */}
      {!isEditing && !createNew && selectedCategoryId && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category Color
          </label>
          <div className="flex items-center">
            <div 
              className="w-8 h-8 rounded-full mr-2"
              style={{ backgroundColor: formData.color }}
            />
            <span className="text-gray-700">{formData.color}</span>
          </div>
        </div>
      )}
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Time Allocation
        </label>
        <div className="flex items-center">
          <div className="flex items-center border border-gray-300 rounded-md">
            <div className="px-3 py-2">
              <input
                type="number"
                name="hours"
                value={formData.hours}
                onChange={handleChange}
                className="w-16 text-center focus:outline-none"
                min="0"
                max="24"
              />
              <span className="text-gray-500 ml-1">hours</span>
            </div>
            <div className="px-3 py-2 border-l border-gray-300">
              <input
                type="number"
                name="minutes"
                value={formData.minutes}
                onChange={handleChange}
                className="w-16 text-center focus:outline-none"
                min="0"
                max="59"
                step="5"
              />
              <span className="text-gray-500 ml-1">minutes</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isEditing ? (timeOnly ? 'Update Time' : 'Update') : (createNew ? 'Create & Add' : 'Add Allocation')}
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;