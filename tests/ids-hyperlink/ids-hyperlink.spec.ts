import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsHyperlink from '../../src/components/ids-hyperlink/ids-hyperlink';

test.describe('IdsHyperlink tests', () => {
  const url = '/ids-hyperlink/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Hyperlink Component');
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

    test('disable should not fire events', async ({ page }) => {
      const enabledClick = await page?.evaluate(() => {
        let enabledClickCount = 0;
        const hyperlink = document.querySelector('ids-hyperlink');
        hyperlink?.addEventListener('click', () => {
          enabledClickCount++;
        });

        hyperlink?.dispatchEvent(new MouseEvent('click'));

        return enabledClickCount;
      });

      expect(enabledClick).toBe(1);

      const disabledClick = await page?.evaluate(() => {
        let disabledClickCount = 0;
        const hyperlink = document.querySelector('ids-hyperlink[disabled]');
        hyperlink?.addEventListener('click', () => {
          disabledClickCount++;
        });

        hyperlink?.dispatchEvent(new MouseEvent('click'));

        return disabledClickCount;
      });

      expect(disabledClick).toBe(0);
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
      const handle = await page.$('ids-hyperlink');
      const html = await handle?.evaluate((el: IdsHyperlink) => el?.outerHTML);
      await expect(html).toMatchSnapshot('hyperlink-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-hyperlink');
      const html = await handle?.evaluate((el: IdsHyperlink) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('hyperlink-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-hyperlink-light');
    });
  });

  test.describe('functionality test', async () => {
    test('renders href setting then removes it', async ({ page }) => {
      const hyperlink = await page.locator('ids-hyperlink').first();
      expect(await hyperlink.evaluate((element: IdsHyperlink) => {
        element.href = 'href';
        return element.href;
      })).toEqual('href');
      await expect(hyperlink).toHaveAttribute('href');

      expect(await hyperlink.evaluate((element: IdsHyperlink) => {
        element.href = null;
        return element.href;
      })).toBeNull();
      await expect(hyperlink).not.toHaveAttribute('href');
    });

    test('renders target setting then removes it', async ({ page }) => {
      const hyperlink = await page.locator('ids-hyperlink').first();
      expect(await hyperlink.evaluate((element: IdsHyperlink) => {
        element.target = 'target';
        return element.target;
      })).toEqual('target');
      await expect(hyperlink).toHaveAttribute('target');

      expect(await hyperlink.evaluate((element: IdsHyperlink) => {
        element.target = null;
        return element.target;
      })).toBeNull();
      await expect(hyperlink).not.toHaveAttribute('target');
    });

    test('renders text-decoration setting then removes it', async ({ page }) => {
      const hyperlink = await page.locator('ids-hyperlink').first();
      expect(await hyperlink.evaluate((element: IdsHyperlink) => {
        element.textDecoration = 'none';
        return element.textDecoration;
      })).toEqual('none');
      await expect(hyperlink).toHaveAttribute('text-decoration', 'none');

      expect(await hyperlink.evaluate((element: IdsHyperlink) => {
        element.textDecoration = 'text-decoration';
        return element.textDecoration;
      })).toBeNull();
      await expect(hyperlink).not.toHaveAttribute('text-decoration');

      expect(await hyperlink.evaluate((element: IdsHyperlink) => {
        element.textDecoration = 'hover';
        return element.textDecoration;
      })).toEqual('hover');
      await expect(hyperlink).toHaveAttribute('text-decoration', 'hover');

      expect(await hyperlink.evaluate((element: IdsHyperlink) => {
        element.textDecoration = null;
        return element.textDecoration;
      })).toBeNull();
      await expect(hyperlink).not.toHaveAttribute('text-decoration');
    });

    test('renders disabled setting then removes it', async ({ page }) => {
      const hyperlink = await page.locator('ids-hyperlink').first();
      expect(await hyperlink.evaluate((element: IdsHyperlink) => {
        element.disabled = true;
        return element.disabled;
      })).toBeTruthy();
      await expect(hyperlink).toHaveAttribute('disabled');
      await expect(hyperlink.locator('a')).toHaveAttribute('tabindex', '-1');

      expect(await hyperlink.evaluate((element: IdsHyperlink) => {
        element.disabled = false;
        return element.disabled;
      })).toBeFalsy();
      await expect(hyperlink).not.toHaveAttribute('disabled');
      await expect(hyperlink.locator('a')).not.toHaveAttribute('tabindex');
    });

    test('can set/get the color', async ({ page }) => {
      const hyperlink = await page.locator('ids-hyperlink').first();
      expect(await hyperlink.evaluate((element: IdsHyperlink) => {
        element.color = 'unset';
        return element.color;
      })).toEqual('unset');
      await expect(hyperlink).toHaveAttribute('color', 'unset');

      expect(await hyperlink.evaluate((element: IdsHyperlink) => {
        element.color = null;
        return element.color;
      })).toBeNull();
      await expect(hyperlink).not.toHaveAttribute('color');

      expect(await hyperlink.evaluate((element: IdsHyperlink) => {
        element.color = 'blue';
        return element.color;
      })).toBeNull();
      await expect(hyperlink).not.toHaveAttribute('color');
    });

    test('can set/get the given font size', async ({ page }) => {
      const hyperlink = await page.locator('ids-hyperlink').first();
      expect(await hyperlink.evaluate((element: IdsHyperlink) => {
        element.fontSize = '14';
        return element.fontSize;
      })).toEqual('14');
      await expect(hyperlink).toHaveAttribute('font-size', '14');

      expect(await hyperlink.evaluate((element: IdsHyperlink) => {
        element.fontSize = 'xs';
        return element.fontSize;
      })).toEqual('xs');
      await expect(hyperlink).toHaveAttribute('font-size', 'xs');

      expect(await hyperlink.evaluate((element: IdsHyperlink) => {
        element.fontSize = null;
        return element.fontSize;
      })).toBeNull();
      await expect(hyperlink).not.toHaveAttribute('font-size');
    });

    test('can set/get the font weight to bold or lighter', async ({ page }) => {
      const hyperlink = await page.locator('ids-hyperlink').first();
      expect(await hyperlink.evaluate((element: IdsHyperlink) => {
        element.fontWeight = 'bold';
        return element.fontWeight;
      })).toEqual('bold');
      await expect(hyperlink).toHaveAttribute('font-weight', 'bold');

      expect(await hyperlink.evaluate((element: IdsHyperlink) => {
        element.fontWeight = 'lighter';
        return element.fontWeight;
      })).toEqual('lighter');
      await expect(hyperlink).toHaveAttribute('font-weight', 'lighter');

      expect(await hyperlink.evaluate((element: IdsHyperlink) => {
        element.fontWeight = null;
        return element.fontWeight;
      })).toBeNull();
      await expect(hyperlink).not.toHaveAttribute('font-weight');
    });

    test('should handle allow-empty-href setting', async ({ page }) => {
      const hyperlink = await page.locator('ids-hyperlink').first();
      expect(await hyperlink.evaluate((element: IdsHyperlink) => {
        element.allowEmptyHref = true;
        return element.allowEmptyHref;
      })).toBeTruthy();
      await expect(hyperlink).toHaveAttribute('allow-empty-href', 'true');

      expect(await hyperlink.evaluate((element: IdsHyperlink) => {
        element.allowEmptyHref = 'false';
        return element.allowEmptyHref;
      })).toBeFalsy();
      await expect(hyperlink).toHaveAttribute('allow-empty-href', 'false');

      expect(await hyperlink.evaluate((element: IdsHyperlink) => {
        element.allowEmptyHref = null;
        return element.allowEmptyHref;
      })).toBeFalsy();
      await expect(hyperlink).toHaveAttribute('allow-empty-href', 'false');
    });
  });
});
