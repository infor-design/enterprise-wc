import { Page } from '@playwright/test';

export class PageDate {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }
  /**
   * Creates a new `Date` object in context of the browser/page in test.
   * @returns {Promise<Date>}
   */
  async newDate(): Promise<Date>;
  /**
   * Creates a new `Date` object in context of the browser/page in test.
   * @param {number} value An integer value representing the timestamp
   * (the number of milliseconds since midnight at the beginning of January 1, 1970, UTC — a.k.a. the epoch).
   * @returns {Promise<Date>}
   */
  async newDate(value: number): Promise<Date>;
  /**
   * Creates a new `Date` object in context of the browser/page in test.
   * @param {string} dateString A string value representing a date, parsed and interpreted
   * using the same algorithm implemented by Date.parse().
   * @returns {Promise<Date>}
   */
  async newDate(dateString: string): Promise<Date>;
  /**
   * Creates a new `Date` object in context of the browser/page in test.
   * @param {number} year Integer value representing the year.
   * Values from 0 to 99 map to the years 1900 to 1999. All other values are the actual year.
   * @param {number} monthIndex Integer value representing the month, beginning with 0 for January to 11 for December.
   * @param {number} day Integer value representing the day of the month. Defaults to 1.
   * @param {number} hours Integer value between 0 and 23 representing the hour of the day. Defaults to 0.
   * @param {number} minutes Integer value representing the minute segment of a time. Defaults to 0.
   * @param {number} seconds Integer value representing the second segment of a time. Defaults to 0.
   * @param {number} milliseconds Integer value representing the millisecond segment of a time. Defaults to 0.
   * @returns {Promise<Date>}
   */
  async newDate(
    year: number, monthIndex: number, day?: number, hours?: number, minutes?: number, seconds?: number, milliseconds?: number
  ): Promise<Date>;

  async newDate(
    firstArgs?: number | string,
    monthIndex?: number,
    day: number = 1,
    hours: number = 0,
    minutes: number = 0,
    seconds: number = 0,
    milliseconds: number = 0
  ): Promise<Date> {
    if (firstArgs === undefined) {
      const result = await this.page.evaluate(() => new Date());
      return result;
    }

    if (firstArgs && monthIndex === undefined) {
      const result = await this.page.evaluate((args) => new Date(args), firstArgs);
      return result;
    }

    if (firstArgs && monthIndex !== undefined) {
      const result = await this.page.evaluate((args) => {
        const date = new Date(
          args.year as number,
          args.monthIndex as number,
          args.day as number,
          args.hours as number,
          args.minutes as number,
          args.seconds as number,
          args.milliseconds as number
        );
        return date;
      }, {
        year: firstArgs, monthIndex, day, hours, minutes, seconds, milliseconds
      });
      return result;
    }
    return new Date('invalid');
  }

  /**
   * Formats given `Date` object using the `Intl.DateTimeFormat.format` function.
   * @param {Date | number} date `Date` or date number equivalet to be formatted
   * @param {string} locale A string with a BCP 47 language tag
   * @param {any} options Locale options. See [documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat).
   * @returns {Promise<string>} formatted date
   */
  async format(date: Date | number, locale?: string, options?: any): Promise<string> {
    const result = await this.page.evaluate((args) => {
      let ret;
      if (args.locale === undefined) {
        ret = new Intl.DateTimeFormat().format(args.date);
        return ret;
      }
      ret = new Intl.DateTimeFormat(args.locale, args.options).format(args.date);
      return ret;
    }, { date, locale, options });
    return result;
  }
}
