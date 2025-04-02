import { useContext } from 'react';
import { TimeBudgetContext } from '../contexts/TimeBudgetContext';

export const useTimeBudget = () => {
  const context = useContext(TimeBudgetContext);
  
  if (context === null) {
    throw new Error('useTimeBudget must be used within a TimeBudgetProvider');
  }
  
  return context;
};