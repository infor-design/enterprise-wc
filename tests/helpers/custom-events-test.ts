import { Page, ElementHandle, Locator } from '@playwright/test';

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
   * // if the element needs to be accessed via shadowRoot, you can do the following:
   * // pass the `Locator` object
   * await eventsTest.onEvent('button.clickable', 'click', theButton);
   * // pass the `ElementHandle` object
   * await eventsTest.onEvent('button.clickable', 'click', await theButton.elementHandle());
   * ```
   *
   * **NOTE**
   * If a 3rd parameter is given, the 1st parameter act as an identifier instead as of a selector
   * @param {string} selectorString element selector string like `button.bold`, `#theId`
   * @param {string} eventName event name to listen like `click`, `selected`, `beforeclick`
   * @param {ElementHandle | Locator} element Playwright's locator object like `theButton` or
   * element handle like `await theButton.elementHandle()`
   * @throws error when {@link initialize()} method is not called initially
   * @throws error when either the `selectorString` or `elementHandle` yielded null object
   */
  async onEvent(
    selectorString: string,
    eventName: string,
    element?: ElementHandle | Locator
  ): Promise<void> {
    if (!this.isInitialized) throw new Error('Initialize is not called');
    const argElem: any = (element && element.constructor.name === 'Locator') ? (await (element as Locator).elementHandle()) : element;
    const result = await this.page.evaluate((details) => {
      const node = (details.argElem !== undefined)
        ? details.argElem : document.querySelector(details.selectorString);
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
    }, { selectorString, eventName, argElem });
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
