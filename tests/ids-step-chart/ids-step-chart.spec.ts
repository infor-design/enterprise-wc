import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsStepChart from '../../src/components/ids-step-chart/ids-step-chart';

test.describe('IdsStepChart tests', () => {
  const url = '/ids-step-chart/example.html';
  let stepChart: any;

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
    stepChart = await page.locator('ids-step-chart').first();
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Step Chart Component');
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
      const handle = await page.$('ids-step-chart');
      const html = await handle?.evaluate((el: IdsStepChart) => el?.outerHTML);
      await expect(html).toMatchSnapshot('step-chart-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-step-chart');
      const html = await handle?.evaluate((el: IdsStepChart) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('step-chart-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-step-chart-light');
    });
  });

  test.describe('functionality tests', () => {
    test('generates the correct number of steps', async () => {
      const rootEl = stepChart.locator('.step').all();
      expect(await rootEl).toHaveLength(7);
    });

    test('generates the correct number of completed steps', async () => {
      let complete = stepChart.locator('.complete').all();
      expect(await complete).toHaveLength(7);
      await stepChart.evaluate((el: IdsStepChart) => { el.value = '5'; });
      await expect(stepChart).toHaveAttribute('value', '5');
      complete = stepChart.locator('.complete').all();
      expect(await complete).toHaveLength(5);
    });

    test('correctly marks steps as in progress', async ({ page }) => {
      await page.evaluate(() => {
        const innerHTML = `<ids-step-chart label="2 of 7 steps completed" color="blue08" step-number="7" value="3" completed-label="5 days overdue" progress-color="red03"></ids-step-chart>`;
        let elem: any;
        document.body.innerHTML = '';
        elem?.remove?.();
        const template = document.createElement('template');
        template.innerHTML = innerHTML;
        elem = template.content.childNodes[0];
        document.body.appendChild(elem);
        elem.stepsInProgress = ['3'];
        return elem;
      });
      const inProgress = stepChart.locator('.in-progress').all();
      expect(await inProgress).toHaveLength(1);
      expect(await page.locator('step.in-progress:nth-child(3)')).toBeTruthy();
    });

    test('color is set correctly', async ({ page }) => {
      stepChart = await page.locator('ids-step-chart');
      let inProgress = await stepChart.locator('.in-progress');
      await expect(inProgress).toHaveAttribute('color', 'red-20');
      stepChart = await page.locator('ids-step-chart').nth(3);
      await stepChart.evaluate((el: IdsStepChart) => { el.progressColor = 'teal-60'; });
      inProgress = await stepChart.locator('.in-progress');
      await expect(inProgress).toHaveAttribute('color', 'teal-60');
      let complete = await stepChart.locator('.complete').first();
      await expect(complete).toHaveAttribute('color', 'blue-60');
      await stepChart.evaluate((el: IdsStepChart) => { el.color = 'purple-50'; });
      complete = await stepChart.locator('.complete').first();
      await expect(complete).toHaveAttribute('color', 'purple-50');
    });

    test('can steps in progress be updated', async ({ page }) => {
      stepChart = await page.locator('ids-step-chart').nth(3);
      await stepChart.evaluate((el: IdsStepChart) => { el.stepsInProgress = ['3', '5', '7']; });
      const inProgress = stepChart.locator('.in-progress').all();
      expect(await inProgress).toHaveLength(3);
      const stepsInProgress = await stepChart.evaluate((el: IdsStepChart) => el.stepsInProgress);
      expect(await stepsInProgress).toEqual([3, 5, 7]);
    });

    test('completed label can be updated', async ({ page }) => {
      stepChart = await page.locator('ids-step-chart').nth(3);
      let completedLabel = stepChart.locator('.completed-label').innerHTML();
      expect(await completedLabel).toBe('5 days overdue');
      await stepChart.evaluate((el: IdsStepChart) => { el.completedLabel = 'Test change'; });
      completedLabel = stepChart.locator('.completed-label').innerHTML();
      expect(await completedLabel).toBe('Test change');
      await expect(stepChart).toHaveAttribute('completed-label', 'Test change');
    });

    test('label can be updated', async ({ page }) => {
      stepChart = await page.locator('ids-step-chart').nth(3);
      let label = stepChart.locator('.label').innerHTML();
      expect(await label).toBe('2 of 7 steps completed');
      await stepChart.evaluate((el: IdsStepChart) => { el.label = 'Test Label'; });
      label = stepChart.locator('.label').innerHTML();
      expect(await label).toBe('Test Label');
      await expect(stepChart).toHaveAttribute('label', 'Test Label');
    });

    test('can update the steps', async ({ page }) => {
      stepChart = await page.locator('ids-step-chart').nth(3);
      let step = stepChart.locator('.step').all();
      expect(await step).toHaveLength(7);
      await stepChart.evaluate((el: IdsStepChart) => { el.stepNumber = '10'; });
      await expect(stepChart).toHaveAttribute('step-number', '10');
      step = stepChart.locator('.step').all();
      expect(await step).toHaveLength(10);
    });

    test('can be able to set disabled', async () => {
      await expect(stepChart).not.toHaveAttribute('disabled');
      let isdisabled = await stepChart.evaluate((el: IdsStepChart) => el.disabled);
      await expect(isdisabled).toEqual(false);
      await stepChart.evaluate((el: IdsStepChart) => { el.disabled = true; });
      await expect(stepChart).toHaveAttribute('disabled', '');
      isdisabled = await stepChart.evaluate((el: IdsStepChart) => el.disabled);
      await expect(isdisabled).toEqual(true);
      await stepChart.evaluate((el: IdsStepChart) => { el.disabled = false; });
      await expect(stepChart).not.toHaveAttribute('disabled');
      isdisabled = await stepChart.evaluate((el: IdsStepChart) => el.disabled);
      await expect(isdisabled).toEqual(false);
    });
  });
});
