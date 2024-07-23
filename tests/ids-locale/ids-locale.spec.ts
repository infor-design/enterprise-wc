import percySnapshot from '@percy/playwright';
import { Page, expect } from '@playwright/test';
import { test } from '../base-fixture';

test.describe('IdsLocale tests', () => {
  const url = '/ids-demo-app/utils.html';

  // eslint-disable-next-line jsdoc/require-jsdoc
  async function runLocaleFunction(page: Page, functionName: string, value: any, value2?: any, value3?: any) {
    if (functionName === 'twoDigitYearCutoff') {
      await page.evaluate((obj: any) => {
        ((window as any).utils as any).locale.twoDigitYearCutoff = obj.value;
      }, { value });
      return;
    }

    if (value3) {
      // eslint-disable-next-line max-len
      const returnValue = await page.evaluate((obj) => ((window as any).utils as any).locale[obj.utilName](obj.value, obj.value2, obj.value3), {
        utilName: functionName, value, value2, value3
      });
      return returnValue;
    }

    if (value2) {
      // eslint-disable-next-line max-len
      const returnValue = await page.evaluate((obj) => ((window as any).utils as any).locale[obj.utilName](obj.value, obj.value2), { utilName: functionName, value, value2 });
      return returnValue;
    }

    // eslint-disable-next-line max-len
    const returnValue = await page.evaluate((obj) => ((window as any).utils as any).locale[obj.utilName](obj.value), { utilName: functionName, value });
    return returnValue;
  }

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('two digit year checks', () => {
    test('should match the visual snapshot in percy', async ({ page }) => {
      await page.goto('/ids-locale/two-digit-year.html');
      await percySnapshot(page, 'ids-locale-two-digit-year-light');
    });

    test('should correct two digit year', async ({ page }) => {
      await runLocaleFunction(page, 'setLocale', 'en-US');
      expect(await runLocaleFunction(page, 'twoToFourDigitYear', '40')).toEqual(1940);
      expect(await runLocaleFunction(page, 'twoToFourDigitYear', '20')).toEqual(2020);
    });

    test('should correct three digit year', async ({ page }) => {
      expect(await runLocaleFunction(page, 'twoToFourDigitYear', '940')).toEqual(1940);
      expect(await runLocaleFunction(page, 'twoToFourDigitYear', '020')).toEqual(2020);
    });

    test('should be able to change two digit year cut off', async ({ page }) => {
      await runLocaleFunction(page, 'twoDigitYearCutoff', '75');

      expect(await runLocaleFunction(page, 'twoToFourDigitYear', '74')).toEqual(2074);
      expect(await runLocaleFunction(page, 'twoToFourDigitYear', '77')).toEqual(1977);
    });
  });
});
