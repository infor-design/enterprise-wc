import { expect } from '@playwright/test';
import { test } from '../base-fixture';
import type IdsIcon from '../../src/components/ids-icon/ids-icon';

test.describe('IdsIcon tests', () => {
  const url = '/ids-icon/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Icon Component');
    });

    test('should not have errors', async ({ page, browserName }) => {
      if (browserName === 'firefox') return;
      let exceptions = null;
      await page.on('pageerror', (error) => {
        exceptions = error;
      });

      await page.goto(url);
      await page.waitForLoadState();
      await expect(exceptions).toBeNull();
    });
  });

  test.describe('setting/attribute tests', () => {
    test('should be able to set size setting', async ({ page }) => {
      const size = await page.evaluate(() => {
        const elem = document.querySelector<IdsIcon>('ids-icon')!;
        elem.size = 'small';
        return elem.size;
      });
      expect(await size).toBe('small');
      expect(await page.locator('ids-icon').first().getAttribute('size')).toEqual('small');
    });
  });
});
