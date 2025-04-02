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
  if (totalMinutes === undefined || totalMinutes === null || isNaN(totalMinutes)) {
    return "0h 0m";
  }
  
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.floor(totalMinutes % 60);
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

// Format a date as YYYY-MM-DD
export const formatDateToString = (date) => {
  return date.toISOString().split('T')[0];
};

// Parse a YYYY-MM-DD string into a Date object
export const parseDate = (dateString) => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};

// Get current date adjusted by reset time
export const getCurrentDate = (resetTime) => {
  const now = new Date();
  const [resetHours, resetMinutes] = resetTime.split(':').map(Number);
  
  const resetDateTime = new Date();
  resetDateTime.setHours(resetHours, resetMinutes, 0, 0);
  
  // If current time is past reset time, "Today" is actually tomorrow
  if (now >= resetDateTime) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  }
  
  return now;
};

// Get dates for the next n days starting from the current date
export const getNextDays = (resetTime, numberOfDays = 3) => {
  const startDate = getCurrentDate(resetTime);
  const dates = [];
  
  for (let i = 0; i < numberOfDays; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    dates.push(date);
  }
  
  return dates;
};

// Generate a date for a specific number of days in the future
export const getDateInFuture = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

// Check if a date is one of the special dates (Today, Tomorrow, Day After)
export const getRelativeDateLabel = (dateString, resetTime) => {
  const date = parseDate(dateString);
  const today = getCurrentDate(resetTime);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date(today);
  dayAfter.setDate(dayAfter.getDate() + 2);
  
  // Compare dates without time
  const formatToCompare = (d) => formatDateToString(d);
  
  if (formatToCompare(date) === formatToCompare(today)) {
    return "Today";
  } else if (formatToCompare(date) === formatToCompare(tomorrow)) {
    return "Tomorrow";
  } else if (formatToCompare(date) === formatToCompare(dayAfter)) {
    return "Day After";
  }
  
  return null; // Not a special date
};

// Format date for display (e.g., "Apr 2")
export const formatDateForDisplay = (date) => {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Create formatted date label for UI
export const formatDateLabel = (dateString, resetTime) => {
  const date = parseDate(dateString);
  const relativeLabel = getRelativeDateLabel(dateString, resetTime);
  
  if (relativeLabel) {
    return `${relativeLabel} - ${formatDateForDisplay(date)}`;
  }
  
  return formatDateForDisplay(date);
};