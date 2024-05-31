import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsProgressBar from '../../src/components/ids-progress-bar/ids-progress-bar';

test.describe('IdsProgressBar tests', () => {
  const url = '/ids-progress-bar/example.html';
  let progressBar: any;

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
    progressBar = await page.locator('ids-progress-bar').first();
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Progress Bar Component');
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
      const handle = await page.$('ids-progress-bar');
      const html = await handle?.evaluate((el: IdsProgressBar) => el?.outerHTML);
      await expect(html).toMatchSnapshot('progress-bar-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-progress-bar');
      const html = await handle?.evaluate((el: IdsProgressBar) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('progress-bar-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-progress-bar-light');
    });
  });

  test.describe('functionality tests', () => {
    test('can set value', async () => {
      let value = await progressBar.evaluate((progBar: IdsProgressBar) => progBar.value);
      await expect(value).toBe('10');
      await progressBar.evaluate((progBar: IdsProgressBar) => { progBar.value = '60'; });
      value = await progressBar.evaluate((progBar: IdsProgressBar) => progBar.value);
      await expect(value).toBe('60');
      await progressBar.evaluate((progBar: IdsProgressBar) => { progBar.shadowRoot?.querySelector('.progress-bar')?.remove(); });
      await progressBar.evaluate((progBar: IdsProgressBar) => { progBar.value = null as any; });
      value = await progressBar.evaluate((progBar: IdsProgressBar) => progBar.value);
      await expect(value).toBe('0');
    });

    test('can render as disabled', async () => {
      await expect(progressBar).not.toHaveAttribute('disabled');
      let rootEl = await progressBar.locator('.ids-progress-bar');
      await expect(rootEl).not.toHaveClass(/disabled/);
      await progressBar.evaluate((progBar: IdsProgressBar) => { progBar.disabled = true; });
      await expect(progressBar).toHaveAttribute('disabled');
      rootEl = await progressBar.locator('.ids-progress-bar');
      await expect(rootEl).toHaveClass(/disabled/);
      await progressBar.evaluate((progBar: IdsProgressBar) => { progBar.disabled = false; });
      await expect(progressBar).not.toHaveAttribute('disabled');
      rootEl = await progressBar.locator('.ids-progress-bar');
      await expect(rootEl).not.toHaveClass(/disabled/);
    });

    test('can set label text', async () => {
      let labelText = await progressBar.locator('.progress-label ids-text');
      await expect(await labelText.innerHTML()).toBe('Percent complete');
      await progressBar.evaluate((progBar: IdsProgressBar) => { progBar.label = 'test'; });
      labelText = await progressBar.locator('.progress-label ids-text');
      await expect(await labelText.innerHTML()).toBe('test');
      await progressBar.evaluate((progBar: IdsProgressBar) => { progBar.label = null as any; });
      labelText = await progressBar.locator('.progress-label ids-text');
      await expect(await labelText.innerHTML()).toBe('');
      await progressBar.evaluate((progBar: IdsProgressBar) => { progBar.shadowRoot?.querySelector('.progress-label ids-text')?.remove(); });
      await progressBar.evaluate((progBar: IdsProgressBar) => { progBar.label = 'test2'; });
      labelText = await progressBar.evaluate((progBar: IdsProgressBar) => progBar.shadowRoot?.querySelector('.progress-label ids-text'));
      await expect(labelText).toBeNull();
    });

    test('can set label text as audible', async () => {
      let labelText = await progressBar.locator('.progress-label ids-text');
      let rootEl = await progressBar.locator('.ids-progress-bar');
      await expect(progressBar).not.toHaveAttribute('label-audible');
      await expect(labelText).not.toHaveAttribute('audible');
      await expect(rootEl).not.toHaveClass('label-audible');
      await progressBar.evaluate((progBar: IdsProgressBar) => { progBar.labelAudible = true; });
      labelText = await progressBar.locator('.progress-label ids-text');
      rootEl = await progressBar.locator('.ids-progress-bar');
      await expect(progressBar).toHaveAttribute('label-audible', 'true');
      await expect(labelText).toHaveAttribute('audible', 'true');
      await expect(rootEl).toHaveClass(/label-audible/);
      await progressBar.evaluate((progBar: IdsProgressBar) => { progBar.labelAudible = false; });
      labelText = await progressBar.locator('.progress-label ids-text');
      rootEl = await progressBar.locator('.ids-progress-bar');
      await expect(progressBar).not.toHaveAttribute('label-audible');
      await expect(labelText).not.toHaveAttribute('audible');
      await expect(rootEl).not.toHaveClass('label-audible');
    });

    test('can set max value', async () => {
      await expect(progressBar).not.toHaveAttribute('max');
      let max = await progressBar.evaluate((progBar: IdsProgressBar) => progBar.max);
      await expect(max).toEqual('100');
      await progressBar.evaluate((progBar: IdsProgressBar) => { progBar.max = 60 as any; });
      await expect(progressBar).toHaveAttribute('max', '60');
      max = await progressBar.evaluate((progBar: IdsProgressBar) => progBar.max);
      await expect(max).toEqual('60');
      await progressBar.evaluate((progBar: IdsProgressBar) => { progBar.max = null as any; });
      await expect(progressBar).toHaveAttribute('max', '100');
      max = await progressBar.evaluate((progBar: IdsProgressBar) => progBar.max);
      await expect(max).toEqual('100');
    });

    test('can render template', async ({ page }) => {
      await page.evaluate(() => {
        document.body.innerHTML = '';
        const el = document.createElement('ids-progress-bar') as any;
        el.setAttribute('disabled', 'true');
        el.setAttribute('label-audible', 'true');
        el.setAttribute('label', 'test');
        el.setAttribute('max', '50');
        el.setAttribute('value', '10');
        el.template();
        document.body.appendChild(el);
      });
      progressBar = await page.locator('ids-progress-bar').first();

      const labelText = await progressBar.locator('.progress-label ids-text');
      const rootEl = await progressBar.locator('.ids-progress-bar');
      const isDisabled = await progressBar.evaluate((progBar: IdsProgressBar) => progBar.disabled);
      await expect(isDisabled).toEqual('true');
      await expect(rootEl).toHaveClass(/disabled/);
      await expect(progressBar).toHaveAttribute('label-audible', 'true');
      await expect(progressBar).toHaveAttribute('disabled', 'true');
      await expect(labelText).toHaveAttribute('audible', 'true');
      await expect(rootEl).toHaveClass(/label-audible/);
      const label = await progressBar.evaluate((progBar: IdsProgressBar) => progBar.label);
      await expect(label).toEqual('test');
      await expect(labelText).toContainText('test');
      const max = await progressBar.evaluate((progBar: IdsProgressBar) => progBar.max);
      const value = await progressBar.evaluate((progBar: IdsProgressBar) => progBar.value);
      await expect(max).toEqual('50');
      await expect(value).toEqual('10');
    });
  });
});
