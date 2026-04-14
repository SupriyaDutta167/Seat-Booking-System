// utils/scheduleUtils.js

function isWeekend(dateString) {
  const day = new Date(dateString).getUTCDay();
  return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
}

// ISO week number calculation (Native JS)
function getWeekNumber(dateString) {
  const d = new Date(dateString);
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}

function getCycleWeek(dateString) {
  const week = getWeekNumber(dateString);
  return week % 2 === 0 ? 2 : 1;
}

function isValidDay(batch, dateString) {
  const d = new Date(dateString);
  const day = d.getUTCDay(); // 1 = Mon, ... 5 = Fri
  const cycleWeek = getCycleWeek(dateString);

  if (batch === "A") {
    // Week 1: Mon-Wed (1-3) | Week 2: Thu-Fri (4-5)
    return cycleWeek === 1 ? day >= 1 && day <= 3 : day >= 4 && day <= 5;
  } else {
    // Week 1: Thu-Fri (4-5) | Week 2: Mon-Wed (1-3)
    return cycleWeek === 1 ? day >= 4 && day <= 5 : day >= 1 && day <= 3;
  }
}

module.exports = { isWeekend, isValidDay };