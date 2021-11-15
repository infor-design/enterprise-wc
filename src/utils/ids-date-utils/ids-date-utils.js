/**
 * Determine whether or not a date is todays date.
 * @param {Date} date The date to check.
 * @returns {boolean} Returns true or false if the compared date is today.
 */
export function isToday(date) {
  const today = new Date();
  return (
    date.getDate() === today.getDate()
    && date.getMonth() === today.getMonth()
    && date.getFullYear() === today.getFullYear()
  );
}

/**
 * Gets the first day of the week.
 * @param {Date} date The date to check.
 * @param {number} startsOn Day of the week to start on. Sunday is 0, Monday is 1, and so on.
 * @param {boolean} showRange If calendar is showing range view, day of the week should not be counted backwards
 * @returns {boolean} Returns true or false if the compared date is today.
 */
export function firstDayOfWeek(date, startsOn = 0, showRange = false) {
  const dayOfWeek = date.getDay();
  const firstDay = new Date(date);
  const diff = dayOfWeek >= startsOn || showRange ? dayOfWeek - startsOn : 6 - dayOfWeek;

  firstDay.setDate(date.getDate() - diff);
  firstDay.setHours(0, 0, 0, 0);

  return firstDay;
}

/**
 * Gets the last day of the week.
 * @param {Date} date The date to check.
 * @param {number} startsOn Day of the week to start on. Sunday is 0, Monday is 1, and so on.
 * @returns {boolean} Returns true or false if the compared date is today.
 */
export function lastDayOfWeek(date, startsOn = 0) {
  const lastDay = this.firstDayOfWeek(date, startsOn);
  lastDay.setDate(lastDay.getDate() + 6);
  lastDay.setHours(23, 59, 59, 999);
  return lastDay;
}

/**
 * Get the difference between two dates.
 * @param {Date} first The first date.
 * @param {Date} second The second date.
 * @param {boolean} useHours The different in hours if true, otherways days.
 * @returns {number} The difference between the two dates.
 */
export function dateDiff(first, second, useHours) {
  // Take the difference between the dates and divide by milliseconds per day.
  // Round to nearest whole number to deal with DST.
  const dtoday = new Date();
  return Math.round(
    (second - first) / (1000 * 60 * 60 * (useHours ? 1 : Math.abs(dtoday.getTimezoneOffset())))
  );
}

/**
 * Get the month difference between two dates.
 * @param {Date} first The first date.
 * @param {Date} second The second date.
 * @returns {number} The difference between the two dates.
 */
export function monthDiff(first, second) {
  let months;

  months = (second.getFullYear() - first.getFullYear()) * 12;
  months -= first.getMonth();
  months += second.getMonth();

  return months <= 0 ? 0 : months;
}

/**
 * Get the difference in days between two dates.
 * @param {Date} startDate the beginning of the interval
 * @param {Date} endDate the end of the interval
 * @returns {number} number of days
 */
export function daysDiff(startDate, endDate) {
  return Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
}

/**
 * Add a number of units to original date
 * @param {Date} date original date.
 * @param {number} number of unit to add to the date.
 * @param {string} unit days
 * @returns {Date} new date after addition.
 */
export function add(date, number, unit) {
  let newDate = null;
  const originalDate = date instanceof Date ? new Date(date.toISOString()) : new Date(date);
  switch (unit) {
  case 'days':
    newDate = new Date(originalDate.setDate(originalDate.getDate() + number));
    break;
  default:
    break;
  }
  return newDate;
}

/**
 * Subtract a number of units to original date
 * @param {Date} date original date.
 * @param {number} number of unit to subtract from the given date.
 * @param {string} unit days
 * @returns {Date} new date after subtraction.
 */
export function subtract(date, number, unit) {
  let newDate = null;
  const originalDate = date instanceof Date ? new Date(date.toISOString()) : new Date(date);
  switch (unit) {
  case 'days':
    newDate = new Date(originalDate.setDate(originalDate.getDate() - number));
    break;
  default:
    break;
  }
  return newDate;
}

/**
 * Check if a date is using daylight saving time
 * @param {Date} date original date.
 * @returns {boolean} true if given date is using daylight saving time, false otherwise.
 */
export function isDaylightSavingTime(date) {
  const jan = new Date(date.getFullYear(), 0, 1).getTimezoneOffset();
  const jul = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
  return Math.max(jan, jul) !== date.getTimezoneOffset();
}

/**
 * Check if a date is valid
 * @param {Date} date date to check.
 * @returns {boolean} true if valid, false otherwise.
 */
export function isValidDate(date) {
  return date instanceof Date && !Number.isNaN(date);
}

/**
 * Ids Date Utilities
 */
export const IdsDateUtils = {
  isToday,
  firstDayOfWeek,
  lastDayOfWeek,
  dateDiff,
  monthDiff,
  add,
  subtract,
  isDaylightSavingTime,
  isValidDate,
  daysDiff,
};

export default IdsDateUtils;
export { IdsDateUtils as dateUtils };
