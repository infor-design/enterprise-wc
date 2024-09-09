import { Page } from '@playwright/test';

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
    this.page.on('pageerror', (err) => this.errors.push({ source: 'pageerror', message: err.message }));
    this.page.on('console', (msg) => { if (msg.type() === 'error') this.errors.push({ source: 'console', message: msg.text }); });
  }

  /**
   * Check if any error is logged
   * @returns {boolean} `true` if there is atleast 1 error
   */
  hasErrors(): boolean {
    const hasErrors = this.errors.length > 0;
    return hasErrors;
  }

  /**
   * Clear the error list
   */
  clearErrors() {
    this.errors = [];
  }
}
