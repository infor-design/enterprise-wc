import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsThemeSwitcher from '../../src/components/ids-theme-switcher/ids-theme-switcher';

test.describe('IdsThemeSwitcher tests', () => {
  const url = '/ids-theme-switcher/example.html';
  let switcher: any;

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
    switcher = await page.locator('ids-theme-switcher').first();
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Theme Switcher Component');
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
      const handle = await page.$('ids-theme-switcher');
      const html = await handle?.evaluate((el: IdsThemeSwitcher) => el?.outerHTML);
      await expect(html).toMatchSnapshot('theme-switcher-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-theme-switcher');
      const html = await handle?.evaluate((el: IdsThemeSwitcher) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('theme-switcher-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-theme-switcher-light');
    });
  });

  test.describe('functionality tests', () => {
    test('handles selected from the ids-popup-menu', async () => {
      await switcher.evaluate((idsSwitcher: IdsThemeSwitcher) => {
        const event = new CustomEvent('selected', { detail: { elem: { value: 'classic' } } });
        idsSwitcher?.shadowRoot?.querySelector('ids-popup-menu')?.dispatchEvent(event);
        event.detail.elem.value = 'contrast';
        idsSwitcher?.shadowRoot?.querySelector('ids-popup-menu')?.dispatchEvent(event);
      });
      const mode = await switcher.evaluate((idsSwitcher: IdsThemeSwitcher) => idsSwitcher.mode);
      await expect(mode).toEqual('contrast');
    });

    test('can set mode and then clear it to default', async () => {
      await switcher.evaluate((idsSwitcher: IdsThemeSwitcher) => { idsSwitcher.mode = 'dark'; idsSwitcher.mode = ''; });
      const mode = await switcher.evaluate((idsSwitcher: IdsThemeSwitcher) => idsSwitcher.mode);
      await expect(mode).toEqual('light');
      await expect(switcher).not.toHaveAttribute('mode');
    });

    test('supports setting color variants', async () => {
      await switcher.evaluate((idsSwitcher: IdsThemeSwitcher) => { idsSwitcher.colorVariant = 'alternate'; });
      const colorVariant = await switcher.evaluate((idsSwitcher: IdsThemeSwitcher) => idsSwitcher!.colorVariant);
      await expect(colorVariant).toEqual('alternate');
    });

    test('sync color variant with the container', async () => {
      await switcher.evaluate((idsSwitcher: IdsThemeSwitcher) => { idsSwitcher.colorVariant = 'alternate'; idsSwitcher.onColorVariantRefresh(); });
      // eslint-disable-next-line max-len
      const colorVariant = await switcher.evaluate((idsSwitcher: IdsThemeSwitcher) => (idsSwitcher!.container as any).colorVariant);
      await expect(colorVariant).toEqual('alternate');
    });

    test('can change language', async ({ page }) => {
      await page.evaluate(async () => {
        await window?.IdsGlobal?.locale?.setLanguage('ar');
      });
      await expect(switcher).toHaveAttribute('dir', 'rtl');
    });
  });
});
