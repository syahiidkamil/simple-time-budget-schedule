import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useTimeBudget } from '../hooks/useTimeBudget';

const BudgetPieChart = () => {
  const { categories, remainingMinutes } = useTimeBudget();
  
  // Prepare data for the pie chart
  const pieData = categories.map(cat => ({
    name: cat.name,
    value: cat.hours * 60 + cat.minutes,
    color: cat.color
  }));
  
  // Add remaining time if there is any
  if (remainingMinutes > 0) {
    pieData.push({
      name: 'Unallocated',
      value: remainingMinutes,
      color: '#D1D5DB' // Light gray for unallocated time
    });
  }
  
  // Custom tooltip for the pie chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const hours = Math.floor(data.value / 60);
      const minutes = data.value % 60;
      
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow-sm">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm">{`${hours}h ${minutes}m (${((data.value / (24 * 60)) * 100).toFixed(1)}%)`}</p>
        </div>
      );
    }
    
    return null;
  };
  
  // Format the legend value to show hours and minutes
  const formatLegendValue = (value) => {
    const hours = Math.floor(value / 60);
    const minutes = value % 60;
    return `${hours}h ${minutes}m`;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Time Distribution</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            formatter={formatLegendValue}
            layout="vertical"
            align="right"
            verticalAlign="middle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BudgetPieChart;