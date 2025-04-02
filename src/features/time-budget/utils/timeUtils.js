// Convert time in "HH:MM" format to minutes
export const timeToMinutes = (timeString) => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
};

// Convert minutes to "HH:MM" format
export const minutesToTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

// Format time for display (e.g., "8h 30m")
export const formatTime = (totalMinutes) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
};

// Calculate time remaining until reset
export const calculateTimeUntilReset = (resetTime) => {
  const now = new Date();
  const [resetHours, resetMinutes] = resetTime.split(':').map(Number);
  
  const resetDate = new Date();
  resetDate.setHours(resetHours, resetMinutes, 0, 0);
  
  // If reset time has already passed for today, set it for tomorrow
  if (now > resetDate) {
    resetDate.setDate(resetDate.getDate() + 1);
  }
  
  const diffMs = resetDate - now;
  const diffMinutes = Math.floor(diffMs / 60000);
  
  return diffMinutes;
};

// Get current day label based on reset time
export const getCurrentDayLabel = (resetTime) => {
  const now = new Date();
  const [resetHours, resetMinutes] = resetTime.split(':').map(Number);
  
  const resetDateTime = new Date();
  resetDateTime.setHours(resetHours, resetMinutes, 0, 0);
  
  // If current time is past reset time, then "Today" is actually tomorrow
  if (now >= resetDateTime) {
    return "Tomorrow";
  }
  
  return "Today";
};

// Get dates for the days (Today, Tomorrow, Day After)
export const getDatesForDays = (resetTime) => {
  const now = new Date();
  const [resetHours, resetMinutes] = resetTime.split(':').map(Number);
  
  const resetDateTime = new Date();
  resetDateTime.setHours(resetHours, resetMinutes, 0, 0);
  
  let today = new Date();
  
  // If current time is past reset time, then "Today" is actually tomorrow
  if (now >= resetDateTime) {
    today.setDate(today.getDate() + 1);
  }
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const dayAfter = new Date(tomorrow);
  dayAfter.setDate(dayAfter.getDate() + 1);
  
  return {
    Today: today,
    Tomorrow: tomorrow,
    "Day After": dayAfter
  };
};

// Format date to display (e.g., "Apr 2")
export const formatDate = (date) => {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};