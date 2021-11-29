/** Determine whether or not a date is todays date. */
export function isToday(date: Date): boolean;

/** Gets the first day of the week. */
export function firstDayOfWeek(date: Date, startsOn: number): boolean;

/** Gets the last day of the week. */
export function lastDayOfWeek(date: Date, startsOn: number): boolean;

/** Get the difference between two dates. */
export function dateDiff(first: Date, second: Date, useHours: boolean): number;

/** Get the month difference between two dates. */
export function monthDiff(first: Date, second: Date): number;

/** Add a number of units to original date */
export function add(date: Date, number: number, unit: string): Date;

/** Subtract a number of units to original date */
export function subtract(date: Date, number: number, unit: string): Date;

/** Check if a date is using daylight saving time */
export function isDaylightSavingTime(date: Date): boolean;

/** Check if a date is valid */
export function isValidDate(date: Date): boolean;

/** Get difference in days between dates */
export function daysDiff(startDate: Date, endDate: Date): number;
