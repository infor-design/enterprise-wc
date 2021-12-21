/**
 * @jest-environment jsdom
 */
import {
  isTodaysDate,
  firstDayOfWeek,
  lastDayOfWeek,
  dateDiff,
  addDate,
  daysDiff,
  monthDiff,
  subtractDate,
  isValidDate,
  isDaylightSavingTime
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
    expect(firstDayOfWeek(date, undefined, true).getDay()).toEqual(0);
    // Monday
    expect(firstDayOfWeek(date, 1, true).getDay()).toEqual(1);
    // Thursday
    expect(firstDayOfWeek(date, 6, false).getDay()).toEqual(4);
  });

  it('should get the last day of the week', () => {
    // Wednesday
    const date = new Date('11/10/2021');

    // Saturday (startsOn attr is 0)
    expect(lastDayOfWeek(date, undefined).getDay()).toEqual(6);
    // Sunday
    expect(lastDayOfWeek(date, 1).getDay()).toEqual(0);
    // Tuesday
    expect(lastDayOfWeek(date, 3).getDay()).toEqual(2);
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
});
