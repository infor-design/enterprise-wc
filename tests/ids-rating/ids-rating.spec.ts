import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsRating from '../../src/components/ids-rating/ids-rating';
import IdsIcon from '../../src/components/ids-icon/ids-icon';

test.describe('IdsRating tests', () => {
  const url = '/ids-rating/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Rating Component');
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

  test.describe('accessibility tests', () => {
    test('should pass an Axe scan', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const accessibilityScanResults = await new AxeBuilder({ page } as any)
        .exclude('[disabled]') // Disabled elements do not have to pass
        .analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('snapshot tests', () => {
    test('should match innerHTML snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-rating');
      const html = await handle?.evaluate((el: IdsRating) => el?.outerHTML);
      await expect(html).toMatchSnapshot('rating-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-rating');
      const html = await handle?.evaluate((el: IdsRating) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('rating-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-rating-light');
    });

    test('can set the value attribute', async ({ page }) => {
      const rating = await page.locator('ids-rating').first();
      await expect(page.locator('ids-rating')).toBeAttached;
      await expect(page.locator('ids-rating').first()).toHaveAttribute('value');
      await rating.evaluate((element: IdsRating) => { element.value = '3'; });
      await expect(rating).toHaveAttribute('value', '3');
    });

    test('has a readonly attribute', async ({ page }) => {
      const rating = await page.locator('ids-rating').nth(1);
      await rating.evaluate((element: IdsRating) => { element.readonly = 'true'; });
      await expect(rating).toHaveAttribute('readonly');
    });

    test('has a size attribute', async ({ page }) => {
      const rating = await page.locator('ids-rating').nth(1);
      await rating.evaluate((element: IdsRating) => { element.size = 'large'; });
      await expect(rating).toHaveAttribute('size', 'large');
    });

    test('has a stars attribute', async ({ page }) => {
      const rating = await page.locator('ids-rating').nth(1);
      await rating.evaluate((element: IdsRating) => { element.stars = '4'; });
      await expect(rating).toHaveAttribute('stars', '4');
    });

    test('supports half stars', async ({ page }) => {
      const rating = await page.locator('ids-rating').first();
      await rating.evaluate((element: IdsRating) => { element.value = '1.5'; });
      await expect(rating).toHaveAttribute('value', '1.5');
    });

    test('can click stars to select', async ({ page }) => {
      const rating = await page.locator('ids-rating').first();
      await rating.evaluate((element: IdsRating) => { element.value = '4'; });
      await expect(rating).toHaveAttribute('value', '4');
      await rating.locator('.star-2').click();
      await expect(rating).toHaveAttribute('value', '3');
    });

    test('can ignore invalid size', async ({ page }) => {
      const rating = await page.locator('ids-rating').first();
      await rating.evaluate((element: IdsRating) => { element.size = 'large'; });
      await rating.evaluate((element: IdsRating) => { element.size = null; });
      await expect(rating).toHaveAttribute('size', 'large');
    });

    test('should be able to toggle off 1 start', async ({ page }) => {
      const rating = await page.locator('ids-rating').first();
      await rating.evaluate((element: IdsRating) => { element.value = '1'; });
      await expect(rating).toHaveAttribute('value', '1');
      await rating.locator('.star-0').click();
      await expect(rating).toHaveAttribute('value', '0');
    });

    test('can hit enter on a star to select', async ({ page }) => {
      const rating = await page.locator('ids-rating').first();
      await rating.evaluate((element: IdsRating) => { element.value = '0'; });
      await expect(rating).toHaveAttribute('value', '0');
      await rating.locator('.star-2').click();
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
      await expect(rating).toHaveAttribute('value', '4');
    });

    test('should be able to set disabled', async ({ page }) => {
      const rating = await page.locator('ids-rating').first();
      await rating.evaluate((element: IdsRating) => { element.disabled = ''; });
      await expect(rating).toHaveAttribute('disabled', '');
      await rating.evaluate((element: IdsRating) => { element.disabled = 'true'; });
      await expect(rating).toHaveAttribute('disabled');
      await rating.evaluate((element: IdsRating) => { element.disabled = 'false'; });
      await expect(rating).not.toHaveAttribute('disabled');
    });
  });
});
