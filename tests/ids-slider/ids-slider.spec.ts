import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';
import IdsSlider from '../../src/components/ids-slider/ids-slider';

test.describe('IdsSlider tests', () => {
  const url = '/ids-slider/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Slider Component');
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
    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-slider-light');
    });
  });

  test.describe('functionality tests', () => {
    test('should be able to render steps', async ({ page }) => {
      const slider = await page.locator('ids-slider').first();
      expect(await slider.getAttribute('step-number')).toBeNull();
      expect(await slider.evaluate((elem: IdsSlider) => elem.stepNumber)).toBe(2);
      expect(await slider.evaluate((elem: IdsSlider) => elem.container?.querySelectorAll('.tick').length)).toBe(2);

      await slider.evaluate((elem: IdsSlider) => {
        elem.type = 'step';
        elem.stepNumber = 1;
      });

      expect(await slider.getAttribute('step-number')).toBe('1');
      expect(await slider.evaluate((elem: IdsSlider) => elem.stepNumber)).toBe(3);
      expect(await slider.evaluate((elem: IdsSlider) => elem.container?.querySelectorAll('.tick').length)).toBe(3);

      await slider.evaluate((elem: IdsSlider) => {
        elem.stepNumber = 2;
      });

      expect(await slider.getAttribute('step-number')).toBe('2');
      expect(await slider.evaluate((elem: IdsSlider) => elem.stepNumber)).toBe(4);
      expect(await slider.evaluate((elem: IdsSlider) => elem.container?.querySelectorAll('.tick').length)).toBe(4);
    });
  });
});
