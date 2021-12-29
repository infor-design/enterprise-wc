/** Determine whether or not a date is todays date. */
export function isTodaysDate(date: Date): boolean;

/** Gets the first day of the week. */
export function firstDayOfWeekDate(date: Date, startsOn: number, showRange: boolean): Date;

/** Gets the last day of the week. */
export function lastDayOfWeekDate(date: Date, startsOn: number): Date;

/** Get the difference between two dates. */
export function dateDiff(first: Date, second: Date, useHours: boolean): number;

/** Get the month difference between two dates. */
export function monthDiff(first: Date, second: Date): number;

/** Get the difference in days between two dates. */
export function daysDiff(startDate: Date, endDate: Date): number;

/** Add a number of units to original date */
export function addDate(date: Date, number: number, unit: string): Date;

/** Subtract a number of units to original date */
export function subtractDate(date: Date, number: number, unit: string): Date;

/** Check if a date is using daylight saving time */
export function isDaylightSavingTime(date: Date): boolean;

/** Check if a date is valid */
export function isValidDate(date: Date): boolean;

/** Convert umalqura to gregorian date */
export function umalquraToGregorian(
  year: number,
  month: number,
  day: number,
  hours: number,
  mins: number,
  secs: number,
  mills: number
): Date;

/** Convert Gregorian to Umm al-Qura calendar date */
export function gregorianToUmalqura(date: Date): object;

/** Gets first day of given month/year date */
export function firstDayOfMonthDate(year: number, month: number, day: number, isIslamic: boolean): Date;

/** Gets last day of given month/year date */
export function lastDayOfMonthDate(year: number, month: number, day: number, isIslamic: boolean): Date;

/** Gets the number of days in a given month */
export function daysInMonth(year: number, month: number, day: number, isIslamic: boolean): number;

/** Gets the number of weeks in a given month */
export function weeksInMonth(
  year: number,
  month: number,
  day: number,
  startsOn: number,
  isIslamic: boolean
): number;

/** Gets the number of weeks in a given range of dates */
export function weeksInRange(startDate: Date, endDate: Date, startsOn: number): number;
