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
   */
  async initialize() {
    await this.page.evaluate(() => {
      (window as any).eventsList = [];
    });
    this.isInitialized = true;
  }

  /**
   * Add an event to monitor trigger count under the given selector
   * @param {string} selectorString element selector string example `button.bold`
   * @param {string} eventName event name to listen `ex. click`
   * @throws error when {@link initialize()} method is not called initially
   */
  async addEvent(selectorString: string, eventName: string): Promise<void> {
    if (!this.isInitialized) throw new Error('Initialize is not called');
    await this.page.evaluate((details) => {
      const node = document.querySelector(details.selectorString)!;
      node.addEventListener(details.eventName, () => {
        let isExisting = false;
        for (const event of (window as any).eventsList) {
          if (event.selector === details.selectorString && event.eventName === details.eventName) {
            event.triggeredCount += 1;
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
   * @param {string} selectorString element selector string
   * @param {string} eventName event name to listen
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
   * @param {string} selectorString element selector string
   * @param {string} eventName event name to listen
   * @returns {Promise<boolean>} triggered state of the event
   */
  async isEventTriggered(selectorString: string, eventName: string): Promise<boolean> {
    if (!this.isInitialized) throw new Error('Initialize is not called');
    const eventList = await this.getEvents();
    for (const event of eventList) {
      if (event.selector === selectorString && event.eventName === eventName && event.triggeredCount > 0) return true;
    }
    return false;
  }

  /**
   * Get the triggered cound of the element's event
   * @param {string} selectorString element selector string
   * @param {string} eventName event name to listen
   * @returns {Promise<number>} triggered count of the element's event
   */
  async getEventCount(selectorString: string, eventName: string): Promise<number> {
    if (!this.isInitialized) throw new Error('Initialize is not called');
    const eventList = await this.getEvents();
    for (const event of eventList) {
      if (event.selector === selectorString && event.eventName === eventName) return event.triggeredCount;
    }
    return 0;
  }

  /**
   * Get the list of events triggered per element
   * @returns {Promise<[{ selector: string, eventName: string; triggeredCount: number; }]>} Array of element's events
   */
  async getEvents(): Promise<[{ selector: string, eventName: string; triggeredCount: number; }]> {
    if (!this.isInitialized) throw new Error('Initialize is not called');
    const result = await this.page.evaluate(() => (window as any).eventsList);
    return result;
  }
}
