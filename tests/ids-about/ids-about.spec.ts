import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';
import IdsAbout from '../../src/components/ids-about/ids-about';

test.describe('IdsAbout tests', () => {
  const url = '/ids-about/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS About Component');
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

  test.describe('IdsAbout settings tests', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(url);
    });

    test('setting copyright year', async ({ page }) => {
      await page.locator('#about-example-trigger').click(); // open about modal
      const aboutHandle = await page.locator('ids-about').first();

      // set copyrightYear to 2015
      await aboutHandle.evaluate((about: IdsAbout) => { about.copyrightYear = 2015; });
      await expect(await page.locator('ids-text[slot="copyright"]')).toHaveText(/2015/);
      await expect(await aboutHandle.evaluate((about: IdsAbout) => about.copyrightYear)).toEqual('2015');
    });

    test('setting device specs', async ({ page }) => {
      await page.locator('#about-example-trigger').click(); // open about modal
      const aboutHandle = await page.locator('ids-about').first();

      // should have device specs by default
      await expect(await page.locator('ids-text[slot="device"]')).toHaveText(/Platform :/);

      // set deviceSpecs to false
      await aboutHandle.evaluate((about: IdsAbout) => { about.deviceSpecs = false; });
      await expect(await page.locator('ids-text[slot="device"]')).not.toBeVisible();
      expect(await aboutHandle.evaluate((about: IdsAbout) => about.deviceSpecs)).toEqual(false);
    });

    test('setting product name', async ({ page }) => {
      await page.locator('#about-example-trigger').click(); // open about modal
      const aboutHandle = await page.locator('ids-about').first();

      // should have product name by default
      await expect(await page.locator('ids-text[slot="product"]')).toHaveText(/Controls Example Application/);

      // set productName to ''
      await aboutHandle.evaluate((about: IdsAbout) => { about.productName = ''; });
      await expect(await page.locator('ids-text[slot="product"]')).not.toHaveText(/Controls Example Application/);
      expect(await aboutHandle.evaluate((about: IdsAbout) => about.productName)).toEqual('');
    });

    test('setting product version', async ({ page }) => {
      await page.locator('#about-example-trigger').click(); // open about modal
      const aboutHandle = await page.locator('ids-about').first();

      // set product version to 1.23
      await aboutHandle.evaluate((about: IdsAbout) => { about.productVersion = '1.23'; });
      await expect(await page.locator('ids-text[slot="product"]')).toHaveText(/1.23/);
      expect(await aboutHandle.evaluate((about: IdsAbout) => about.productVersion)).toEqual('1.23');
    });

    test('setting user default copyright', async ({ page }) => {
      await page.locator('#about-example-trigger').click(); // open about modal
      const aboutHandle = await page.locator('ids-about').first();

      // should useDefaultCopyright by default
      expect(await aboutHandle.evaluate((about: IdsAbout) => about.useDefaultCopyright)).toEqual(true);
      await expect(await page.locator('ids-text[slot="copyright"]')).toBeVisible();

      // set useDefaultCopyright to false
      await aboutHandle.evaluate((about: IdsAbout) => { about.useDefaultCopyright = false; });
      await expect(await page.locator('ids-text[slot="copyright"]')).not.toBeVisible();
    });
  });

  test.describe('IdsAbout localization tests', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(url);
    });

    test('setting rtl when switching to an rtl language', async ({ page }) => {
      // set locale to arabic
      await page.evaluate(async () => { await window.IdsGlobal.locale?.setLocale('ar-SA'); });
      expect(await page.locator('ids-about').getAttribute('dir')).toEqual('rtl');
    });

    test('content should be translated when switching languages', async ({ page }) => {
      // set language to spanish
      const platformInSpanish = await page.evaluate(async () => {
        await window.IdsGlobal.locale?.setLocale('es-ES');
        await window.IdsGlobal.locale?.setLanguage('es');
        return window.IdsGlobal.locale?.loadedLanguages.get('es').Platform.value;
      });

      // check that translation took place for the word 'Platform'
      expect(await page.locator('ids-text[slot="device"]').textContent()).toContain(platformInSpanish);
    });
  });
});
