import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';
import IdsTag from '../../src/components/ids-tag/ids-tag';

test.describe('IdsTag tests', () => {
  const url = '/ids-tag/tag-list.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Tag Component');
    });
  });

  test.describe('page append tests', () => {
    test('should be able to createElement', async ({ page }) => {
      await page.evaluate(() => {
        const elem = document.createElement('ids-tag-list');
        elem.id = 'test-tag-list';
        document.body.appendChild(elem);
      });
      await expect(await page.locator('#test-tag-list')).toHaveAttribute('id');
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
      const html = await page.evaluate(() => {
        const elem = document.querySelector('ids-tag-list')!;
        elem.shadowRoot?.querySelector('style')?.remove();
        return elem?.outerHTML;
      });
      await expect(html).toMatchSnapshot('tag-list-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const html = await page.evaluate(() => {
        const elem = document.querySelector('ids-tag-list')!;
        elem.shadowRoot?.querySelector('style')?.remove();
        return elem.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('tag-list-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-tag-list-light');
    });
  });

  test.describe('event tests', () => {
    test('should fire tagremove on dismiss', async ({ page }) => {
      const noOfCalls = await page.evaluate(() => {
        let calls = 0;
        const tag = document.querySelector<IdsTag>('ids-tag[dismissible]');
        tag?.addEventListener('tagremove', () => { calls++; });
        tag?.dismiss();
        return calls;
      });
      expect(await noOfCalls).toBe(1);
    });

    test('should fire aftertagremove on dismiss', async ({ page }) => {
      const noOfCalls = await page.evaluate(() => {
        let calls = 0;
        const tag = document.querySelector<IdsTag>('ids-tag[dismissible]');
        tag?.addEventListener('aftertagremove', () => { calls++; });
        tag?.dismiss();
        return calls;
      });
      expect(await noOfCalls).toBe(1);
    });
  });
});
