/**
 * @jest-environment jsdom
 */
import { IdsDateUtils as dateUtils } from '../../src/utils';

describe('IdsDateUtils Tests', () => {
  it('should determine whether or not a date is todays date', () => {
    const today = new Date();
    const notToday = new Date('01/01/2015');

    expect(dateUtils.isToday(today)).toBeTruthy();
    expect(dateUtils.isToday(notToday)).toBeFalsy();
  });

  it('should get the first day of the week', () => {
    // Friday
    const date = new Date('11/12/2021');

    // Sunday (startsOn attr is 0)
    expect(dateUtils.firstDayOfWeek(date, undefined, true).getDay()).toEqual(0);
    // Monday
    expect(dateUtils.firstDayOfWeek(date, 1, true).getDay()).toEqual(1);
    // Thursday
    expect(dateUtils.firstDayOfWeek(date, 6, false).getDay()).toEqual(4);
  });

  it('should get the last day of the week', () => {
    // Wednesday
    const date = new Date('11/10/2021');

    // Saturday (startsOn attr is 0)
    expect(dateUtils.lastDayOfWeek(date, undefined).getDay()).toEqual(6);
    // Sunday
    expect(dateUtils.lastDayOfWeek(date, 1).getDay()).toEqual(0);
    // Tuesday
    expect(dateUtils.lastDayOfWeek(date, 3).getDay()).toEqual(2);
  });

  it('should get the difference between two dates', () => {
    const first = new Date('11/10/2021');
    const second = new Date('11/14/2021');

    // Don't use hours
    expect(dateUtils.dateDiff(first, second, false)).toEqual(1);
    // Use hours (96 hours or 4 days)
    expect(dateUtils.dateDiff(first, second, true)).toEqual(96);
  });

  it('should get the month difference between two dates', () => {
    expect(dateUtils.monthDiff(new Date('11/10/2021'), new Date('12/14/2021'))).toEqual(1);
    expect(dateUtils.monthDiff(new Date('11/10/2021'), new Date('11/14/2021'))).toEqual(0);
    expect(dateUtils.monthDiff(new Date('01/01/2021'), new Date('01/01/2022'))).toEqual(12);
    expect(dateUtils.monthDiff(new Date('01/01/2022'), new Date('01/01/2021'))).toEqual(0);
  });

  it('should get the day difference between two dates', () => {
    expect(dateUtils.daysDiff(new Date('11/10/2021'), new Date('11/14/2021'))).toEqual(4);
    expect(dateUtils.daysDiff(new Date('11/10/2021'), new Date('11/10/2021'))).toEqual(0);
  });

  it('should add and subtract a number of units to original date', () => {
    let twoDaysAdd = dateUtils.add(new Date(), 2, 'days');
    let twoDaysSubtract = dateUtils.subtract(new Date(), 2, 'days');

    expect(dateUtils.daysDiff(new Date(), twoDaysAdd)).toEqual(2);
    expect(dateUtils.daysDiff(twoDaysSubtract, new Date())).toEqual(2);

    // Returns null without 3rd arg specified
    expect(dateUtils.subtract(new Date(), 2)).toBeNull();
    expect(dateUtils.add(new Date(), 2)).toBeNull();

    // Parse date
    twoDaysAdd = dateUtils.add('11/10/2021', 2, 'days');
    twoDaysSubtract = dateUtils.subtract('11/10/2021', 2, 'days');

    expect(dateUtils.daysDiff(new Date('11/10/2021'), twoDaysAdd)).toEqual(2);
    expect(dateUtils.daysDiff(twoDaysSubtract, new Date('11/10/2021'))).toEqual(2);
  });

  it('should check if a date is valid', () => {
    expect(dateUtils.isValidDate(new Date())).toBeTruthy();
    expect(dateUtils.isValidDate('string')).toBeFalsy();
  });

  it('should check if a date is using daylight saving time', () => {
    expect(dateUtils.isDaylightSavingTime(new Date('11/10/2021'))).toBeFalsy();
    expect(dateUtils.isDaylightSavingTime(new Date('06/10/2021'))).toBeTruthy();
  });
});
