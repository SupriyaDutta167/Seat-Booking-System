// utils/dateUtils.js

// Validates if a date string is exactly YYYY-MM-DD format
function isValidDateFormat(dateString) {
  if (!dateString) return false;
  
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateString.match(regex)) return false;

  const d = new Date(dateString);
  const dNum = d.getTime();
  
  // Check if date is valid and doesn't roll over (e.g., 2026-02-30 -> 2026-03-02)
  if (!dNum && dNum !== 0) return false;
  return d.toISOString().slice(0, 10) === dateString;
}

module.exports = { isValidDateFormat };