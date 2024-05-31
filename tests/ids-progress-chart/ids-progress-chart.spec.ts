import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsProgressChart from '../../src/components/ids-progress-chart/ids-progress-chart';

test.describe('IdsProgressChart tests', () => {
  const url = '/ids-progress-chart/example.html';
  let progressChart: any;

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
    progressChart = await page.locator('ids-progress-chart').first();
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Progress Chart Component');
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
      const handle = await page.$('ids-progress-chart');
      const html = await handle?.evaluate((el: IdsProgressChart) => el?.outerHTML);
      await expect(html).toMatchSnapshot('progress-chart-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-progress-chart');
      const html = await handle?.evaluate((el: IdsProgressChart) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('progress-chart-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-progress-chart-light');
    });
  });

  test.describe('functionality tests', () => {
    test('sets icon correctly', async () => {
      const icon = await progressChart.locator('.icon');
      await expect(icon).not.toHaveAttribute('icon');
      await progressChart.evaluate((chart: IdsProgressChart) => { chart.icon = 'alert'; });
      await expect(icon).toHaveAttribute('icon', 'alert');
      await expect(icon).toHaveCSS('display', 'flex');

      await progressChart.evaluate((chart: IdsProgressChart) => { chart.size = 'small'; });
      await expect(icon).toHaveAttribute('size', 'small');
      await progressChart.evaluate((chart: IdsProgressChart) => { chart.icon = ''; });
      await expect(icon).not.toHaveAttribute('icon');
      await expect(icon).toHaveCSS('display', 'none');
    });

    test('sets color correctly', async () => {
      let color = await progressChart.evaluate((chart: IdsProgressChart) => chart.color);
      await expect(color).toBeNull();
      await progressChart.evaluate((chart: IdsProgressChart) => { chart.color = '#25af65'; });
      color = await progressChart.evaluate((chart: IdsProgressChart) => chart.color);
      await expect(color).toEqual('#25af65');
      await progressChart.evaluate((chart: IdsProgressChart) => { chart.color = 'error'; });
      color = await progressChart.evaluate((chart: IdsProgressChart) => chart.color);
      await expect(color).toEqual('error');
      await progressChart.evaluate((chart: IdsProgressChart) => { chart.color = 'success'; });
      color = await progressChart.evaluate((chart: IdsProgressChart) => chart.color);
      await expect(color).toEqual('success');
      await progressChart.evaluate((chart: IdsProgressChart) => { chart.color = 'warning'; });
      color = await progressChart.evaluate((chart: IdsProgressChart) => chart.color);
      await expect(color).toEqual('warning');
      await progressChart.evaluate((chart: IdsProgressChart) => { chart.color = '#606066'; });
      color = await progressChart.evaluate((chart: IdsProgressChart) => chart.color);
      await expect(color).toEqual('#606066');
      await progressChart.evaluate((chart: IdsProgressChart) => { chart.color = 'purple-50'; });
      color = await progressChart.evaluate((chart: IdsProgressChart) => chart.color);
      await expect(color).toEqual('purple-50');
    });

    test('sets labels correctly', async () => {
      let label = await progressChart.evaluate((chart: IdsProgressChart) => chart.label);
      const labelMain = await progressChart.locator('.label-main');
      await expect(label).toEqual('dark');
      await progressChart.evaluate((chart: IdsProgressChart) => { chart.label = 'test label'; });
      label = await progressChart.evaluate((chart: IdsProgressChart) => chart.label);
      await expect(label).toEqual('test label');
      await expect(await labelMain.innerHTML()).toEqual('test label');
      await progressChart.evaluate((chart: IdsProgressChart) => { chart.label = null; });
      label = await progressChart.evaluate((chart: IdsProgressChart) => chart.label);
      await expect(label).toEqual('');
    });

    test('sets progress correctly', async () => {
      let progress = await progressChart.evaluate((chart: IdsProgressChart) => chart.progress);
      await expect(progress).toEqual('90');
      await progressChart.evaluate((chart: IdsProgressChart) => { chart.progress = '50'; });
      progress = await progressChart.evaluate((chart: IdsProgressChart) => chart.progress);
      await expect(progress).toEqual('50');

      // invalid inputs set attribute to default (0)
      await progressChart.evaluate((chart: IdsProgressChart) => { chart.progress = ''; });
      progress = await progressChart.evaluate((chart: IdsProgressChart) => chart.progress);
      await expect(progress).toEqual('0');
      await progressChart.evaluate((chart: IdsProgressChart) => { chart.progress = '-1'; });
      progress = await progressChart.evaluate((chart: IdsProgressChart) => chart.progress);
      await expect(progress).toEqual('0');
    });

    test('sets total correctly', async () => {
      let total = await progressChart.evaluate((chart: IdsProgressChart) => chart.total);
      await expect(total).toBeNull();
      await progressChart.evaluate((chart: IdsProgressChart) => { chart.total = '70'; });
      total = await progressChart.evaluate((chart: IdsProgressChart) => chart.total);
      await expect(total).toEqual('70');

      // invalid inputs set attribute to default (0)
      await progressChart.evaluate((chart: IdsProgressChart) => { chart.total = ''; });
      total = await progressChart.evaluate((chart: IdsProgressChart) => chart.total);
      await expect(total).toEqual('100');
      await progressChart.evaluate((chart: IdsProgressChart) => { chart.total = null; });
      total = await progressChart.evaluate((chart: IdsProgressChart) => chart.total);
      await expect(total).toEqual('100');
    });

    test('calculates percentage correctly', async () => {
      const progress = await progressChart.evaluate((chart: IdsProgressChart) => chart.progress);
      await expect(progress).toBe('90');
      await progressChart.evaluate((chart: IdsProgressChart) => { chart.progress = '0.7'; chart.total = '1'; });
      let percentage = await progressChart.evaluate((chart: IdsProgressChart) => chart.percentage);
      await expect(percentage).toBe(70);

      await progressChart.evaluate((chart: IdsProgressChart) => { chart.progress = '5'; chart.total = '3'; });
      percentage = await progressChart.evaluate((chart: IdsProgressChart) => chart.percentage);
      await expect(percentage).toBe(100);
    });

    test('sets progress label correctly', async () => {
      const rootEL = await progressChart.locator('.label-progress');
      let progressLabel = await progressChart.evaluate((chart: IdsProgressChart) => chart.progressLabel);
      await expect(progressLabel).toBe('90%');
      expect(await rootEL.innerHTML()).toBe('90%');
      await progressChart.evaluate((chart: IdsProgressChart) => { chart.progressLabel = '50 meters'; });
      progressLabel = await progressChart.evaluate((chart: IdsProgressChart) => chart.progressLabel);
      await expect(progressLabel).toBe('50 meters');
      expect(await rootEL.innerHTML()).toBe('50 meters');
      await progressChart.evaluate((chart: IdsProgressChart) => { chart.progressLabel = '2 weeks'; });
      progressLabel = await progressChart.evaluate((chart: IdsProgressChart) => chart.progressLabel);
      await expect(progressLabel).toBe('2 weeks');
      expect(await rootEL.innerHTML()).toBe('2 weeks');
      await progressChart.evaluate((chart: IdsProgressChart) => { chart.progressLabel = ''; });
      progressLabel = await progressChart.evaluate((chart: IdsProgressChart) => chart.progressLabel);
      await expect(progressLabel).toBe('');
      expect(await rootEL.innerHTML()).toBe('');
    });

    test('sets total label correctly', async () => {
      const rootEL = await progressChart.locator('.label-total');
      let totalLabel = await progressChart.evaluate((chart: IdsProgressChart) => chart.totalLabel);
      await expect(totalLabel).toBeNull();
      expect(await rootEL.innerHTML()).toBe('');
      await progressChart.evaluate((chart: IdsProgressChart) => { chart.totalLabel = '100 meters'; });
      totalLabel = await progressChart.evaluate((chart: IdsProgressChart) => chart.totalLabel);
      await expect(totalLabel).toBe('100 meters');
      expect(await rootEL.innerHTML()).toBe('100 meters');
      await progressChart.evaluate((chart: IdsProgressChart) => { chart.totalLabel = '12 months'; });
      totalLabel = await progressChart.evaluate((chart: IdsProgressChart) => chart.totalLabel);
      await expect(totalLabel).toBe('12 months');
      expect(await rootEL.innerHTML()).toBe('12 months');
      await progressChart.evaluate((chart: IdsProgressChart) => { chart.totalLabel = ''; });
      totalLabel = await progressChart.evaluate((chart: IdsProgressChart) => chart.totalLabel);
      await expect(totalLabel).toBe('');
      expect(await rootEL.innerHTML()).toBe('');
    });

    test('sets size correctly', async () => {
      let size = await progressChart.evaluate((chart: IdsProgressChart) => chart.size);
      await expect(size).toBeNull();
      await progressChart.evaluate((chart: IdsProgressChart) => { chart.size = 'small'; });
      size = await progressChart.evaluate((chart: IdsProgressChart) => chart.size);
      await expect(size).toEqual('small');
      // invalid inputs set attribute to default (normal)
      await progressChart.evaluate((chart: IdsProgressChart) => { chart.size = ''; });
      size = await progressChart.evaluate((chart: IdsProgressChart) => chart.size);
      await expect(size).toEqual('normal');
      await progressChart.evaluate((chart: IdsProgressChart) => { chart.size = '25'; });
      size = await progressChart.evaluate((chart: IdsProgressChart) => chart.size);
      await expect(size).toEqual('normal');
    });
  });
});
