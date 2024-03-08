import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { Locator, expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsCard from '../../src/components/ids-card/ids-card';
import IdsCardAction from '../../src/components/ids-card/ids-card-action';

test.describe('IdsCard tests', () => {
  const url = '/ids-card/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Card Component');
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
      const handle = await page.$('ids-card');
      const html = await handle?.evaluate((el: IdsCard) => el?.outerHTML);
      await expect(html).toMatchSnapshot('card-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-card');
      const html = await handle?.evaluate((el: IdsCard) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('card-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-card-light');
    });
  });

  test.describe('cards tests', () => {
    test('can set auto-height', async ({ page }) => {
      const card = page.locator('ids-card').first();
      await expect(card).not.toHaveAttribute('auto-height');
      await card.evaluate((element: IdsCard) => element.setAttribute('auto-height', 'true'));
      await expect(card).toHaveAttribute('auto-height', 'true');
      await card.evaluate((element: IdsCard) => element.setAttribute('auto-height', 'false'));
      await expect(card).not.toHaveAttribute('auto-height');
      await card.evaluate((element: IdsCard) => { element.autoHeight = 'true'; });
      await expect(card).toHaveAttribute('auto-height', 'true');
      await card.evaluate((element: IdsCard) => { element.autoHeight = 'false'; });
      await expect(card).not.toHaveAttribute('auto-height');
    });
    test('renders auto-fit from an attribute', async ({ page }) => {
      const card = page.locator('ids-card').first();
      await expect(card).not.toHaveAttribute('auto-fit');
      await card.evaluate((element: IdsCard) => element.setAttribute('auto-fit', 'true'));
      await expect(card).toHaveAttribute('auto-fit', 'true');
      await card.evaluate((element: IdsCard) => element.setAttribute('auto-fit', 'false'));
      await expect(card).not.toHaveAttribute('auto-fit');
      await card.evaluate((element: IdsCard) => { element.autoFit = true; });
      await expect(card).toHaveAttribute('auto-fit', 'true');
      await card.evaluate((element: IdsCard) => { element.autoFit = false; });
      await expect(card).not.toHaveAttribute('auto-fit', 'true');
    });
    test('renders overflow setting from the api', async ({ page }) => {
      const card = page.locator('ids-card').first();
      const cardContent = card.locator('div[part="content"]');
      await card.evaluate((element: IdsCard) => { element.overflow = 'hidden'; });
      await expect(card).toHaveAttribute('overflow', 'hidden');
      await expect(cardContent).toHaveClass(/overflow-hidden/);
      await card.evaluate((element: IdsCard) => { element.overflow = 'auto'; });
      await expect(card).not.toHaveAttribute('overflow');
      await expect(cardContent).not.toHaveClass(/overflow-hidden/);
    });
    test('removes the clickable attribute when reset', async ({ page }) => {
      const card = page.locator('ids-card').first();
      await card.evaluate((element: IdsCard) => { element.autoHeight = 'true'; });
      await expect(card).toHaveAttribute('auto-height');
      await card.evaluate((element: IdsCard) => { element.autoHeight = 'false'; });
      await expect(card).not.toHaveAttribute('auto-height');
    });
    test.only('should set no header setting', async ({ page }) => {
      const card = page.locator('ids-card').first();
      await expect(card).not.toHaveAttribute('no-header');
      await card.evaluate((element: IdsCard) => { element.noHeader = 'false'; });
      await expect(card).not.toHaveAttribute('no-header', 'true');
    });
    test('support card selection single', async ({ page }) => {
      const card: Locator = page.locator('ids-card').first();
      await expect(card).not.toHaveAttribute('selected');
      await expect(card).not.toHaveAttribute('selection');
      await card.evaluate((element: IdsCard) => { element.selection = 'single'; });
      await expect(card).toHaveAttribute('selection', 'single');
      await card.click();
      await expect(card).toHaveAttribute('selected', 'true');
    });
    test('support card selection multiple', async ({ page }) => {
      const card: Locator = page.locator('ids-card').first();
      await expect(card).not.toHaveAttribute('selected');
      await expect(card).not.toHaveAttribute('selection');
      await card.evaluate((element: IdsCard) => {
        element.selection = 'multiple';
      });
      await card.click();
      await expect(card.locator('ids-checkbox')).toHaveAttribute('checked', 'true');
    });
  });
});
