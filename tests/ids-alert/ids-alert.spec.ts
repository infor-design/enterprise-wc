import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsAlert from '../../src/components/ids-alert/ids-alert';

test.describe('IdsAlert tests', () => {
  const url = '/ids-alert/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Alert Component');
    });

    test('should not have errors', async ({ page, browserName }) => {
      if (browserName === 'firefox') return;
      let exceptions = null;
      page.on('pageerror', (error) => {
        exceptions = error;
      });

      await page.goto(url);
      await page.waitForLoadState();
      await expect(exceptions).toBeNull();
    });
  });

  test.describe('accessibility tests', () => {
    test('should pass an Axe scan', async ({ page }) => {
      const accessibilityScanResults = await new AxeBuilder({ page } as any)
        .analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('snapshot tests', () => {
    test('should match innerHTML snapshot', async ({ page }) => {
      const handle = await page.$('ids-alert');
      const html = await handle?.evaluate((el: IdsAlert) => el?.outerHTML);
      await expect(html).toMatchSnapshot('alert-html');
    });

    test('should match shadowRoot snapshot', async ({ page }) => {
      const handle = await page.$('ids-alert');
      const html = await handle?.evaluate((el: IdsAlert) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('alert-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-alert-light');
    });
  });

  test.describe('setting/attribute tests', () => {
    test('should be able to set size', async ({ page }) => {
      const locator = await page.locator('ids-alert').first();
      const handle = await page.$('ids-alert');
      await handle?.evaluate((el: IdsAlert) => {
        el.size = 'large';
      });
      expect(await locator.getAttribute('size')).toEqual('large');
      await handle?.evaluate((el: IdsAlert) => {
        el.size = '';
      });
      expect(await locator.getAttribute('size')).toEqual(null);
    });

    test('should be able to set icon', async ({ page }) => {
      const locator = await page.locator('ids-alert').first();
      const handle = await page.$('ids-alert');
      expect(await locator.getAttribute('icon')).toEqual('warning');
      expect(await handle?.evaluate((el: IdsAlert) => el.icon)).toEqual('warning');
      await handle?.evaluate((el: IdsAlert) => {
        el.icon = 'info';
      });
      expect(await locator.getAttribute('icon')).toEqual('info');
      expect(await handle?.evaluate((el: IdsAlert) => el.icon)).toEqual('info');
    });

    test('can render an icon success then remove it', async ({ page }) => {
      await page.evaluate(() => {
        const elem: any = document.createElement('ids-alert');
        elem.icon = 'success';
        elem.id = 'test';
        document.body.appendChild(elem);
      });
      expect(await page.locator('#test').getAttribute('icon')).toEqual('success');
      expect(await page.locator('#test ids-icon').getAttribute('icon')).toEqual('success');

      await page.evaluate(() => {
        const elem: any = document.querySelector('#test');
        elem.icon = null;
      });
      expect(await page.locator('#test').getAttribute('icon')).toEqual(null);
      await page.evaluate(() => {
        const elem: any = document.querySelector('#test');
        elem.remove();
      });
    });

    test('can render a new icon type and then remove it', async ({ page }) => {
      await page.evaluate(() => {
        const elem: any = document.createElement('ids-alert');
        elem.icon = 'add';
        elem.id = 'test';
        document.body.appendChild(elem);
      });
      expect(await page.locator('#test').getAttribute('icon')).toEqual('add');
      expect(await page.locator('#test ids-icon').getAttribute('icon')).toEqual('add');

      await page.evaluate(() => {
        const elem: any = document.querySelector('#test');
        elem.icon = null;
      });
      expect(await page.locator('#test').getAttribute('icon')).toEqual(null);
      await page.evaluate(() => {
        const elem: any = document.querySelector('#test');
        elem.remove();
      });
    });

    test('should support disable and enable', async ({ page }) => {
      const alertLocator = page.locator('ids-alert').first();
      const iconLocator = page.locator('ids-alert ids-icon').first();
      await expect(iconLocator).not.toHaveClass(/disabled/);
      await expect(alertLocator).not.toHaveAttribute('disabled');
      await page.evaluate(() => {
        const elem: any = document.querySelector('ids-alert');
        elem.disabled = true;
      });
      await expect(iconLocator).toHaveClass(/disabled/);
      await expect(alertLocator).toHaveAttribute('disabled');
      await page.evaluate(() => {
        const elem: any = document.querySelector('ids-alert');
        elem.disabled = false;
      });
      await expect(iconLocator).not.toHaveClass(/disabled/);
      await expect(alertLocator).not.toHaveAttribute('disabled');
    });

    test('can render an info alert and then remove it', async ({ page }) => {
      await page.evaluate(() => {
        const elem: any = document.createElement('ids-alert');
        elem.icon = 'info';
        elem.id = 'test';
        document.body.appendChild(elem);
      });
      expect(await page.locator('#test').getAttribute('icon')).toEqual('info');
      expect(await page.locator('#test ids-icon').getAttribute('icon')).toEqual('info');

      await page.evaluate(() => {
        const elem: any = document.querySelector('#test');
        elem.icon = null;
      });
      expect(await page.locator('#test').getAttribute('icon')).toEqual(null);
      await page.evaluate(() => {
        const elem: any = document.querySelector('#test');
        elem.remove();
      });
    });

    test('should be able to set disabled', async ({ page }) => {
      const handle = await page.$('ids-alert');
      let result = await handle?.evaluate((el: IdsAlert) => {
        el.setAttribute('disabled', 'true');
        return el.disabled;
      });
      await expect(result).toEqual(true);
      result = await handle?.evaluate((el: IdsAlert) => {
        el.setAttribute('disabled', 'false');
        return el.disabled;
      });
      await expect(await handle?.getAttribute('disabled')).toEqual(null);
    });

    test('should be able to set color', async ({ page }) => {
      const locator = page.locator('ids-alert').first();
      expect(await locator.getAttribute('color')).toEqual(null);
      await page.evaluate(() => {
        const elem: any = document.querySelector('ids-alert');
        elem.color = 'error';
      });
      expect(await locator.getAttribute('color')).toEqual('error');
      await page.evaluate(() => {
        const elem: any = document.querySelector('ids-alert');
        elem.color = '';
      });
      expect(await locator.getAttribute('size')).toEqual(null);
    });

    test('should be able to set attributes before append', async ({ page }) => {
      let exceptions = null;
      page.on('pageerror', (error) => {
        exceptions = error;
      });

      await page.evaluate(() => {
        const elem: any = document.createElement('ids-alert');
        elem.icon = 'test';
        document.body.appendChild(elem);
      });
      await expect(exceptions).toBeNull();
    });

    test('should be able to set attributes after append', async ({ page }) => {
      let exceptions = null;
      page.on('pageerror', (error) => {
        exceptions = error;
      });

      await page.evaluate(() => {
        const elem:any = document.createElement('ids-alert');
        document.body.appendChild(elem);
        elem.icon = 'alert';
      });

      await expect(exceptions).toBeNull();
    });

    test('should be able to set attributes after insertAdjacentHTML', async ({ page }) => {
      let exceptions = null;
      page.on('pageerror', (error) => {
        exceptions = error;
      });

      await page.evaluate(() => {
        document.body.insertAdjacentHTML('beforeend', '<ids-alert id="test" icon="warning"></ids-alert>');
        const elem:any = document.querySelector('#test');
        elem.icon = 'success';
      });

      const value = await page.evaluate('document.querySelector("#test").shadowRoot.querySelector("ids-icon").getAttribute("icon")');
      await expect(value).toEqual('success');
      await expect(exceptions).toBeNull();
    });
  });
});
