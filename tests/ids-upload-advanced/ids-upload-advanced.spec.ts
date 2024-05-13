import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsUploadAdvanced from '../../src/components/ids-upload-advanced/ids-upload-advanced';

test.describe('IdsUploadAdvanced tests', () => {
  const url = '/ids-upload-advanced/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Upload Advanced Component');
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
        .disableRules(['color-contrast'])
        .analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('snapshot tests', () => {
    test('should match innerHTML snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-upload-advanced');
      const html = await handle?.evaluate((el: IdsUploadAdvanced) => el?.outerHTML);
      await expect(html).toMatchSnapshot('upload-advanced-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-upload-advanced');
      const html = await handle?.evaluate((el: IdsUploadAdvanced) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('upload-advanced-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-upload-advanced-light');
    });
  });

  test.describe('reattachment tests', () => {
    test('should not have errors after reattaching', async ({ page }) => {
      const elemId = '#elem-upload-advanced-basic';
      page.on('pageerror', (err) => {
        expect(err).toBeNull();
      });

      await page.evaluate((arg) => {
        const elem = document.querySelector(arg)!;
        const parentNode = elem.parentNode!;

        parentNode.removeChild(elem);
        parentNode.appendChild(elem);
      }, elemId);
    });

    test('should not duplicate upload status banners after reattaching', async ({ page }) => {
      const elemId = '#elem-upload-advanced-basic';
      const filePath = 'src/assets/images/10.jpg';
      const uploadAdvanced = await page.locator(elemId);
      await page.locator('#elem-upload-advanced-basic .file-input').setInputFiles(filePath);
      expect(await uploadAdvanced.evaluate((elem: IdsUploadAdvanced) => elem.files.length)).toEqual(1);
      expect(await uploadAdvanced.evaluate((elem: IdsUploadAdvanced) => elem.container?.querySelectorAll('ids-upload-advanced-file').length)).toEqual(1);

      await page.evaluate((arg) => {
        const elem = document.querySelector(arg)!;
        const parentNode = elem.parentNode!;

        parentNode.removeChild(elem);
        parentNode.appendChild(elem);
      }, elemId);

      await page.locator('#elem-upload-advanced-basic .file-input').setInputFiles(filePath);
      expect(await uploadAdvanced.evaluate((elem: IdsUploadAdvanced) => elem.files.length)).toEqual(1);
      expect(await uploadAdvanced.evaluate((elem: IdsUploadAdvanced) => elem.container?.querySelectorAll('ids-upload-advanced-file').length)).toEqual(1);
    });
  });
});
