import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';
import IdsAxisChart from '../../src/components/ids-axis-chart/ids-axis-chart';

test.describe('IdsAxisChart tests', () => {
  const url = '/ids-axis-chart/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Axis Chart Component');
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
      const handle = await page.$('ids-axis-chart');
      const html = await handle?.evaluate((el: IdsAxisChart) => el?.outerHTML);
      await expect(html).toMatchSnapshot('axis-chart-html');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-axis-chart-light');
    });

    test('should match the visual snapshot in percy for axis chart colors', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await page.goto('/ids-axis-chart/colors.html');
      await percySnapshot(page, 'ids-axis-chart-colors-light');
    });
  });

  test.describe('functionality tests', () => {
    test('should hide the legend if no name', async ({ page }) => {
      await page.goto('/ids-axis-chart/hide-legend.html');
      const locator = await page.locator('.chart-legend').first();
      expect(await locator.innerHTML()).toBe('');
    });

    test('supports setting title', async ({ page }) => {
      await page.evaluate(() => {
        const axisChart = document.querySelector<IdsAxisChart>('ids-axis-chart')!;
        axisChart.title = 'Test Title';
      });
      const locator = await page.locator('ids-axis-chart title');
      expect(await locator.textContent()).toEqual('Test Title');
    });
  });
});
