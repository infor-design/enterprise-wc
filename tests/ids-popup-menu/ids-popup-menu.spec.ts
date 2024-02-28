import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsPopupMenu from '../../src/components/ids-popup-menu/ids-popup-menu';

test.describe('IdsPopupMenu tests', () => {
  const url = '/ids-popup-menu/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Popup Menu Component');
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
      const handle = await page.$('ids-popup-menu');
      const html = await handle?.evaluate((el: IdsPopupMenu) => el?.outerHTML);
      await expect(html).toMatchSnapshot('popup-menu-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-popup-menu');
      const html = await handle?.evaluate((el: IdsPopupMenu) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('popup-menu-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-popup-menu-light');
    });
  });

  test.describe('callback tests', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/ids-popup-menu/load-data.html');
    });

    test('supports async beforeShow', async ({ page }) => {
      await page.evaluate(() => {
        const elem = document.querySelector<IdsPopupMenu>('ids-popup-menu')!;
        elem.show();
      });
      await page.waitForFunction(() => document.querySelector<IdsPopupMenu>('ids-popup-menu')?.visible === true);
      const markup: string = await page.evaluate(() => {
        const elem = document.querySelector<IdsPopupMenu>('ids-popup-menu')!;
        return elem.innerHTML;
      });
      expect(markup).toContain('Sub Menu One');
    });
  });

  test.describe('data drive tests', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/ids-popup-menu/data-driven.html');
    });

    test('reverts to markup-driven when provided an empty dataset', async ({ page }) => {
      await page.evaluate(() => {
        const elem = document.querySelector<IdsPopupMenu>('ids-popup-menu')!;
        elem.show();
      });
      await page.waitForFunction(() => document.querySelector<IdsPopupMenu>('ids-popup-menu')?.visible === true);
      const markup: string = await page.evaluate(() => {
        const elem = document.querySelector<IdsPopupMenu>('ids-popup-menu')!;
        return elem.innerHTML;
      });
      expect(markup).toContain(' Sub Sub Menu 1');
    });
  });
});
