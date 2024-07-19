/* eslint-disable max-classes-per-file */
import { Page, ElementHandle } from '@playwright/test';

/**
 * Helper object for custom event validation
 * @requires Page object from Playwright to create
 */
export class CustomEventTest {
  private isInitialized: boolean = false;

  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Initialize the window variable to be used.
   * @returns {CustomEventTest} returns CustomeEventTest
   */
  async initialize(): Promise<CustomEventTest> {
    await this.page.evaluate(() => {
      (window as any).eventsList = [];
    });
    this.isInitialized = true;
    return this;
  }

  /**
   * Set the page object where the events list is stored and validated.
   * @param {Page} page page object
   */
  async setPage(page: Page) {
    this.page = page;
    await this.initialize();
  }

  /**
   * Add an event to monitor trigger count under the given selector
   *
   * **Usage**
   *
   * ```ts
   * const theButton = page.locator('button.clickable');
   * await eventsTest.onEvent('button.clickable', 'click');
   * // if the element needs to be accessed via shadowRoot, pass the `ElementHandle` object
   * await eventsTest.onEvent('button.clickable', 'click', await theButton.elementHandle());
   * ```
   * @param {string} selectorString element selector string like `button.bold`, `#theId`
   * @param {string} eventName event name to listen like `click`, `selected`, `beforeclick`
   * @param {ElementHandle} elementHandle Playwright's element handle like `await button.elementHandle()`
   * @throws error when {@link initialize()} method is not called initially
   * @throws error when either the `selectorString` or `elementHandle` yielded null object
   */
  async onEvent(
    selectorString: string,
    eventName: string,
    elementHandle?: ElementHandle
  ): Promise<void> {
    if (!this.isInitialized) throw new Error('Initialize is not called');
    const result = await this.page.evaluate((details) => {
      const node = (details.elementHandle !== undefined)
        ? details.elementHandle : document.querySelector(details.selectorString);
      if (node === null) return false;
      node.addEventListener(details.eventName, () => {
        let isExisting = false;
        for (const event of (window as any).eventsList) {
          if (event.selector === details.selectorString && event.eventName === details.eventName) {
            event.triggeredCount++;
            isExisting = true;
            break;
          }
        }
        if (!isExisting) {
          (window as any).eventsList.push({
            selector: details.selectorString,
            ref: node,
            eventName: details.eventName,
            triggeredCount: 1
          });
        }
      });
      return true;
    }, { selectorString, eventName, elementHandle });
    if (!result) throw new Error('Unable to add an event listener to a null object. Check reference element.');
  }

  /**
   * Refresh the trigger count of an element's event
   * @param {string} selectorString element selector string like `button.bold`, `#theId`
   * @param {string} eventName event name to listen like `click`, `selected`, `beforeclick`
   */
  async refreshTriggerCount(selectorString: string, eventName: string): Promise<void> {
    if (!this.isInitialized) throw new Error('Initialize is not called');
    await this.page.evaluate((details) => {
      for (const event of (window as any).eventsList) {
        if (event.selector === details.selectorString && event.eventName === details.eventName) {
          event.triggeredCount = 0;
          break;
        }
      }
    }, { selectorString, eventName });
  }

  /**
   * Check if the element's event is triggered
   * @param {string} selectorString element selector string like `button.bold`, `#theId`
   * @param {string} eventName event name to listen like `click`, `selected`, `beforeclick`
   * @returns {Promise<boolean>} triggered state of the event
   */
  async isEventTriggered(selectorString: string, eventName: string): Promise<boolean> {
    if (!this.isInitialized) throw new Error('Initialize is not called');
    return (await this.getEventsCountByElement(selectorString, eventName) > 0);
  }

  /**
   * Get the triggered cound of the element's event
   * @param {string} selectorString element selector string like `button.bold`, `#theId`
   * @param {string} eventName event name to listen like `click`, `selected`, `beforeclick`
   * @returns {Promise<number>} triggered count of the element's event
   */
  async getEventsCountByElement(selectorString: string, eventName: string): Promise<number> {
    if (!this.isInitialized) throw new Error('Initialize is not called');
    const eventList = await this.getEventsByElement(selectorString);
    for (const event of eventList) {
      if (event.eventName === eventName) return event.triggeredCount;
    }
    return 0;
  }

  /**
   * Get events list of an element
   * @param {string} selectorString element selector string like `button.bold`, `#theId`
   * @returns {Promise<{ selector: string, eventName: string; triggeredCount: number; }[]>} Details of element's events
   */
  async getEventsByElement(selectorString: string):
  Promise<{
    selector: string,
    eventName: string;
    triggeredCount: number; }[]> {
    if (!this.isInitialized) throw new Error('Initialize is not called');
    const eventList = await this.getAllEvents();
    return eventList ? eventList.filter((item) => item.selector === selectorString) : [];
  }

  /**
   * Get the list of events triggered per element
   * @returns {Promise<{ selector: string, eventName: string; triggeredCount: number; }[]>} Details of all events
   */
  async getAllEvents(): Promise<{ selector: string, eventName: string; triggeredCount: number; }[]> {
    if (!this.isInitialized) throw new Error('Initialize is not called');
    const result = await this.page.evaluate(() => (window as any).eventsList);
    return result;
  }
}

export class PageErrorsTest {
  private page: Page;

  private errors: any[];

  constructor(page: Page) {
    this.page = page;
    this.errors = [];
    this.#initialize();
  }

  /**
   * Set the page object.
   * @param {Page} page page object
   */
  setPage(page: Page) {
    this.page = page;
    this.errors = [];
    this.#initialize();
  }

  #initialize() {
    this.page.on('pageerror', (err) => this.errors.push(err.message));
    this.page.on('console', (msg) => { if (msg.type() === 'error') this.errors.push(msg.text); });
  }

  /**
   * Check if any error is logged
   * @returns {boolean} `true` if there is atleast 1 error
   */
  hasErrors(): boolean {
    return (this.errors.length > 0);
  }

  /**
   * Clear the error list
   */
  clearErrors() {
    this.errors = [];
  }
}

export class PageDate {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }
  /**
   * Creates a new date in context of the browser/page in test.
   * @returns {Date}
   */
  async newDate(): Promise<Date>;
  /**
   * Creates a new date in context of the browser/page in test.
   * @param {number} value An integer value representing the timestamp
   * (the number of milliseconds since midnight at the beginning of January 1, 1970, UTC — a.k.a. the epoch).
   * @returns {Date}
   */
  async newDate(value: number): Promise<Date>;
  /**
   * Creates a new date in context of the browser/page in test.
   * @param {string} dateString A string value representing a date, parsed and interpreted
   * using the same algorithm implemented by Date.parse().
   * @returns {Date}
   */
  async newDate(dateString: string): Promise<Date>;
  /**
   * Creates a new date in context of the browser/page in test.
   * @param {number} year Integer value representing the year.
   * Values from 0 to 99 map to the years 1900 to 1999. All other values are the actual year.
   * @param {number} monthIndex Integer value representing the month, beginning with 0 for January to 11 for December.
   * @param {number} day Integer value representing the day of the month. Defaults to 1.
   * @param {number} hours Integer value between 0 and 23 representing the hour of the day. Defaults to 0.
   * @param {number} minutes Integer value representing the minute segment of a time. Defaults to 0.
   * @param {number} seconds Integer value representing the second segment of a time. Defaults to 0.
   * @param {number} milliseconds Integer value representing the millisecond segment of a time. Defaults to 0.
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
}
