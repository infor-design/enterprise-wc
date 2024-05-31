/* eslint-disable max-classes-per-file */
import { Page } from '@playwright/test';

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
   * @param {string} selectorString element selector string like `button.bold`, `#theId`
   * @param {string} eventName event name to listen like `click`, `selected`, `beforeclick`
   * @throws error when {@link initialize()} method is not called initially
   */
  async onEvent(selectorString: string, eventName: string): Promise<void> {
    if (!this.isInitialized) throw new Error('Initialize is not called');
    await this.page.evaluate((details) => {
      const node = document.querySelector(details.selectorString)!;
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
            eventName: details.eventName,
            triggeredCount: 1
          });
        }
      });
    }, { selectorString, eventName });
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
