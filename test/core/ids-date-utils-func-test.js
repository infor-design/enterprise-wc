/**
 * @jest-environment jsdom
 */
import {
  isTodaysDate,
  firstDayOfWeekDate,
  lastDayOfWeekDate,
  dateDiff,
  addDate,
  daysDiff,
  monthDiff,
  subtractDate,
  isValidDate,
  isDaylightSavingTime,
  weeksInMonth,
  daysInMonth,
  umalquraToGregorian,
  gregorianToUmalqura,
  firstDayOfMonthDate,
  lastDayOfMonthDate,
  weeksInRange
} from '../../src/utils/ids-date-utils/ids-date-utils';

describe('IdsDateUtils Tests', () => {
  it('should determine whether or not a date is todays date', () => {
    const today = new Date();
    const notToday = new Date('01/01/2015');

    expect(isTodaysDate(today)).toBeTruthy();
    expect(isTodaysDate(notToday)).toBeFalsy();
  });

  it('should get the first day of the week', () => {
    // Friday
    const date = new Date('11/12/2021');

    // Sunday (startsOn attr is 0)
    expect(firstDayOfWeekDate(date, undefined, true).getDay()).toEqual(0);
    // Monday
    expect(firstDayOfWeekDate(date, 1, true).getDay()).toEqual(1);
    // Thursday
    expect(firstDayOfWeekDate(date, 6, false).getDay()).toEqual(4);
  });

  it('should get the last day of the week', () => {
    // Wednesday
    const date = new Date('11/10/2021');

    // Saturday (startsOn attr is 0)
    expect(lastDayOfWeekDate(date, undefined).getDay()).toEqual(6);
    // Sunday
    expect(lastDayOfWeekDate(date, 1).getDay()).toEqual(0);
    // Tuesday
    expect(lastDayOfWeekDate(date, 3).getDay()).toEqual(2);
  });

  it('should get the difference between two dates', () => {
    const first = new Date();
    const second = addDate(new Date(), 1, 'days');

    // Don't use hours
    expect(dateDiff(first, second, false)).toEqual(0);
    // Use hours (24 hours or 1 day)
    expect(dateDiff(first, second, true)).toEqual(24);
  });

  it('should get the month difference between two dates', () => {
    expect(monthDiff(new Date('11/10/2021'), new Date('12/14/2021'))).toEqual(1);
    expect(monthDiff(new Date('11/10/2021'), new Date('11/14/2021'))).toEqual(0);
    expect(monthDiff(new Date('01/01/2021'), new Date('01/01/2022'))).toEqual(12);
    expect(monthDiff(new Date('01/01/2022'), new Date('01/01/2021'))).toEqual(0);
  });

  it('should get the day difference between two dates', () => {
    expect(daysDiff(new Date('11/10/2021'), new Date('11/14/2021'))).toEqual(4);
    expect(daysDiff(new Date('11/10/2021'), new Date('11/10/2021'))).toEqual(0);
  });

  it('should add and subtract a number of units to original date', () => {
    let twoDaysAdd = addDate(new Date(), 2, 'days');
    let twoDaysSubtract = subtractDate(new Date(), 2, 'days');

    expect(daysDiff(new Date(), twoDaysAdd)).toEqual(2);
    expect(daysDiff(twoDaysSubtract, new Date())).toEqual(2);

    // Returns null without 3rd arg specified
    expect(subtractDate(new Date(), 2)).toBeNull();
    expect(addDate(new Date(), 2)).toBeNull();

    // Parse date
    twoDaysAdd = addDate('11/10/2021', 2, 'days');
    twoDaysSubtract = subtractDate('11/10/2021', 2, 'days');

    expect(daysDiff(new Date('11/10/2021'), twoDaysAdd)).toEqual(2);
    expect(daysDiff(twoDaysSubtract, new Date('11/10/2021'))).toEqual(2);
  });

  it('should check if a date is valid', () => {
    expect(isValidDate(new Date())).toBeTruthy();
    expect(isValidDate('string')).toBeFalsy();
  });

  it('should check if a date is using daylight saving time', () => {
    expect(isDaylightSavingTime(new Date('11/10/2021'))).toBeFalsy();
    expect(isDaylightSavingTime(new Date('06/10/2021'))).toBeTruthy();
  });

  it('should get correct number of days in a month', () => {
    expect(daysInMonth(2021, 11, 23, true)).toEqual(30);
    expect(daysInMonth(2021, 11)).toEqual(31);
    expect(daysInMonth(2022, 0, 23, true)).toEqual(29);
    expect(daysInMonth(2022, 0)).toEqual(31);
    expect(daysInMonth(2022, 1, 23, true)).toEqual(30);
    expect(daysInMonth(2022, 1)).toEqual(28);
    expect(daysInMonth(2022, 2, 23, true)).toEqual(29);
    expect(daysInMonth(2022, 2)).toEqual(31);
    expect(daysInMonth(2000, 1)).toEqual(29);
    expect(daysInMonth(2000, 1, 15, true)).toEqual(29);
  });

  it('should get correct number of weeks in a month', () => {
    expect(weeksInMonth(2021, 9)).toEqual(6);
    expect(weeksInMonth(2021, 10, 0, 5)).toEqual(5);
    expect(weeksInMonth(2022, 0, 0, 1)).toEqual(6);
    expect(weeksInMonth(2022, 0)).toEqual(6);
    expect(weeksInMonth(2022, 0, 24, 0, true)).toEqual(5);
    expect(weeksInMonth(2017, 9)).toEqual(5);
    expect(weeksInMonth(2017, 10, 0, 1)).toEqual(5);
    expect(weeksInMonth(2018, 0)).toEqual(5);
    expect(weeksInMonth(2000, 1)).toEqual(5);
  });

  it('should get correct number of weeks in range', () => {
    expect(weeksInRange(new Date(2021, 11, 1), new Date(2021, 11, 1))).toEqual(1);
    expect(weeksInRange(new Date(2021, 11, 1), new Date(2021, 11, 15))).toEqual(3);
  });

  it('should convert the Umm al-Qura to Gregorian calendar date', () => {
    expect(umalquraToGregorian(1420, 10, 8).getDate()).toEqual(14);
    expect(umalquraToGregorian(1420, 10, 8).getMonth()).toEqual(1);
    expect(umalquraToGregorian(1420, 10, 8).getFullYear()).toEqual(2000);
    expect(umalquraToGregorian(1443, 4, 18).getDate()).toEqual(22);
    expect(umalquraToGregorian(1443, 4, 18).getMonth()).toEqual(11);
    expect(umalquraToGregorian(1443, 4, 18).getFullYear()).toEqual(2021);
    expect(umalquraToGregorian(1371, 2, 23).getFullYear()).toEqual(1951);
    expect(umalquraToGregorian(1500, 0, 26).getFullYear()).toEqual(2076);
    expect(umalquraToGregorian(1357, 10, 1).getFullYear()).toEqual(1938);
  });

  it('should convert the Gregorian to Umm al-Qura calendar date', () => {
    expect(gregorianToUmalqura()).toHaveProperty('year');
    expect(gregorianToUmalqura()).toHaveProperty('month');
    expect(gregorianToUmalqura()).toHaveProperty('day');
    expect(gregorianToUmalqura(new Date(2000, 1, 14)).month).toEqual(10);
    expect(gregorianToUmalqura(new Date(2000, 1, 14)).day).toEqual(8);
    expect(gregorianToUmalqura(new Date(2000, 1, 14)).year).toEqual(1420);
    expect(gregorianToUmalqura(new Date(2021, 11, 22)).month).toEqual(4);
    expect(gregorianToUmalqura(new Date(2021, 11, 22)).day).toEqual(18);
    expect(gregorianToUmalqura(new Date(2021, 11, 22)).year).toEqual(1443);
  });

  it('should get correct first/last day of a month', () => {
    expect(firstDayOfMonthDate(2021, 10).getDate()).toEqual(1);
    expect(lastDayOfMonthDate(2021, 10).getDate()).toEqual(30);
    expect(firstDayOfMonthDate(2000, 1).getDate()).toEqual(1);
    expect(lastDayOfMonthDate(2000, 1).getDate()).toEqual(29);
  });
});
