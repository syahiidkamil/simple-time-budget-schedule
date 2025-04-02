import React, { useState } from 'react';

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
  onCancel 
}) => {
  const [formData, setFormData] = useState(initialValues);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.name.trim()) {
      setError('Category name is required');
      return;
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
      {error && (
        <div className="mb-4 text-red-500 text-sm">
          {error}
        </div>
      )}
      
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
          {initialValues.id ? 'Update' : 'Add'}
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;