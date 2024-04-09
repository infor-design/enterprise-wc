/* eslint-disable no-underscore-dangle */
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { Page, test as baseTest, expect as baseExpect } from '@playwright/test';

const istanbulCLIOutput = path.join(process.cwd(), '.nyc_output');

/**
 * Generate a Unique ID
 * @returns {string} the unique ID
 */
export function generateUUID(): string {
  return crypto.randomBytes(16).toString('hex');
}

/**
 * Extends the test command in playwright
 */
export const test = baseTest.extend({
  context: async ({ context }, use) => {
    await context.addInitScript(() => window.addEventListener('beforeunload', () => (window as any).collectIstanbulCoverage(JSON.stringify((window as any).__coverage__))),);
    await fs.promises.mkdir(istanbulCLIOutput, { recursive: true });
    await context.exposeFunction('collectIstanbulCoverage', (coverageJSON: string) => {
      if (coverageJSON) { fs.writeFileSync(path.join(istanbulCLIOutput, `playwright_coverage_${generateUUID()}.json`), coverageJSON); }
    });
    await use(context);
    for (const page of context.pages()) {
      await page.evaluate(() => (window as any).collectIstanbulCoverage(JSON.stringify((window as any).__coverage__)));
    }
  }
});

/**
 * Adds a command to mount a blank page
 * @param {any} page the page element
 * @param {string} html the html element
 * @returns {unknown} the element that was inserted
 */
export async function mount<T>(page: Page, html: string): Promise<T> {
  await page.goto('/ids-demo-app/blank.html');
  await page.evaluate((pageHtml: string) => {
    const body = document.querySelector('body');
    if (body) {
      body.innerHTML = pageHtml;
    }
  }, html);

  const tagHandle = await page.locator('body:first-child') as any;
  return tagHandle as T;
}

/**
 * Runs a util that is added to the page in ids-demo-app/utils.ts
 * @param {any} page the page element
 * @param {string} utilName the util name
 * @param {any} value the first param
 * @param {any} value2 the second param
 * @param {any} value3 the third param
 * @returns {unknown} the element that was inserted
 */
export async function runFunction<T>(page: Page, utilName: string, value: any, value2?: any, value3?: any): Promise<T> {
  if (value3) {
    // eslint-disable-next-line max-len
    const returnValue = await page.evaluate((obj) => ((window as any).utils as any)[obj.utilName](obj.value, obj.value2, obj.value3), {
      utilName, value, value2, value3
    });
    return returnValue;
  }

  if (value2) {
    // eslint-disable-next-line max-len
    const returnValue = await page.evaluate((obj) => ((window as any).utils as any)[obj.utilName](obj.value, obj.value2), { utilName, value, value2 });
    return returnValue;
  }

  // eslint-disable-next-line max-len
  const returnValue = await page.evaluate((obj) => ((window as any).utils as any)[obj.utilName](obj.value), { utilName, value });
  return returnValue;
}

export const expect = baseExpect.extend({
  /**
   * **CUSTOM ASSERTION - NOT PLAYWRIGHT NATIVE**
   *
   * Calculates the `lowerBound` and `upperBound` from the `actual` and checks if the `expected` is within bounds
   *
   * `lowerBound` is the difference of `actual` and `margin`
   *
   * `upperBound` is the sum of the `actual` and `margin`
   *
   * **USAGE**
   *
   * ```js
   * await expect(30).toBeInAllowedBounds(29, 1); // passed
   * // lowerBound is 29, upperbound is 31
   * // 28 is not within the lowerBound and upperBound
   * await expect(30).toBeInAllowedBounds(28, 1); // failed
   * ```
   * @param {number} actual parameter of expect - ex. `expect(#actual).toBeInAllowedBounds(#expected, #margin)`
   * @param {number} expected the expected value
   * @param {number} margin the value in which the actual will be added or subtracted
   * @returns {void}
   */
  toBeInAllowedBounds(actual: number, expected: number, margin: number):
  { message: () => string; pass: true; } | { message: () => string; pass: false; } {
    const lowerBound = actual - Math.abs(margin);
    const upperBound = actual + Math.abs(margin);
    if (expected <= upperBound && expected >= lowerBound) {
      return {
        message: () => 'passed',
        pass: true
      };
    }
    return {
      message: () => `\nMargin      : +-${margin}`
      + `\nUpper bound : ${upperBound}`
      + `\nLower bound : ${lowerBound}`
      + `\nExpected    : ${expected}`
      + `\nActual      : ${actual}`,
      pass: false
    };
  }
});
