import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsHyperlink from '../../src/components/ids-hyperlink/ids-hyperlink';

test.describe('IdsHyperlink tests', () => {
  const url = '/ids-hyperlink/example.html';
  let idsHyperlink: any;
  test.beforeEach(async ({ page }) => {
    await page.goto(url);
    idsHyperlink = await page.locator('ids-hyperlink').first();
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

    test.describe('functionality tests', () => {
      test('can render href setting', async () => {
        await idsHyperlink.evaluate((hyperlink: IdsHyperlink) => { hyperlink.href = 'test'; });
        let href = await idsHyperlink.evaluate((hyperlink: IdsHyperlink) => hyperlink.href);
        await expect(href).toEqual('test');
        await idsHyperlink.evaluate((hyperlink: IdsHyperlink) => { hyperlink.href = null; });
        href = await idsHyperlink.evaluate((hyperlink: IdsHyperlink) => hyperlink.href);
        await expect(href).toEqual(null);
        await expect(idsHyperlink).not.toHaveAttribute('href');
      });

      test('can render target setting', async () => {
        await idsHyperlink.evaluate((hyperlink: IdsHyperlink) => { hyperlink.target = '_blank'; });
        const target = await idsHyperlink.evaluate((hyperlink: IdsHyperlink) => hyperlink.target);
        await expect(target).toEqual('_blank');
      });

      test('can render target setting then removes it', async () => {
        await idsHyperlink.evaluate((hyperlink: IdsHyperlink) => { hyperlink.target = '_blank'; });
        let target = await idsHyperlink.evaluate((hyperlink: IdsHyperlink) => hyperlink.target);
        await expect(target).toEqual('_blank');
        await idsHyperlink.evaluate((hyperlink: IdsHyperlink) => { hyperlink.target = null; });
        target = await idsHyperlink.evaluate((hyperlink: IdsHyperlink) => hyperlink.target);
        await expect(target).toEqual(null);
        await expect(idsHyperlink).not.toHaveAttribute('target');
      });

      test('can render text-decoration setting', async () => {
        await idsHyperlink.evaluate((hyperlink: IdsHyperlink) => { hyperlink.textDecoration = 'none'; });
        let classList = await idsHyperlink.evaluate((hyperlink: IdsHyperlink) => hyperlink.container?.classList);
        await expect(classList).toEqual(expect.objectContaining({ 1: 'ids-text-decoration-none' }));
        let textDecoration = await idsHyperlink.evaluate((hyperlink: IdsHyperlink) => hyperlink.textDecoration);
        await expect(textDecoration).toEqual('none');
        await expect(idsHyperlink).toHaveAttribute('text-decoration', 'none');
        await idsHyperlink.evaluate((hyperlink: IdsHyperlink) => { hyperlink.textDecoration = 'hover'; });
        textDecoration = await idsHyperlink.evaluate((hyperlink: IdsHyperlink) => hyperlink.textDecoration);
        classList = await idsHyperlink.evaluate((hyperlink: IdsHyperlink) => hyperlink.container?.classList);
        await expect(classList).toEqual(expect.objectContaining({ 1: 'ids-text-decoration-hover' }));
        await expect(textDecoration).toEqual('hover');
        await expect(idsHyperlink).toHaveAttribute('text-decoration', 'hover');
      });

      test('can render text-decoration setting then removes it', async () => {
        await idsHyperlink.evaluate((hyperlink: IdsHyperlink) => { hyperlink.textDecoration = 'none'; });
        let textDecoration = await idsHyperlink.evaluate((hyperlink: IdsHyperlink) => hyperlink.textDecoration);
        await expect(textDecoration).toEqual('none');
        await expect(idsHyperlink).toHaveAttribute('text-decoration', 'none');

        await idsHyperlink.evaluate((hyperlink: IdsHyperlink) => { hyperlink.textDecoration = null; });
        textDecoration = await idsHyperlink.evaluate((hyperlink: IdsHyperlink) => hyperlink.textDecoration);
        await expect(textDecoration).toEqual(null);
        await expect(idsHyperlink).not.toHaveAttribute('text-decoration');
      });

      test('can render disabled setting then removes it', async () => {
        const a = await idsHyperlink.locator('a');
        await idsHyperlink.evaluate((hyperlink: IdsHyperlink) => { hyperlink.disabled = true; });
        let disabled = await idsHyperlink.evaluate((hyperlink: IdsHyperlink) => hyperlink.disabled);
        await expect(disabled).toEqual(true);
        await expect(idsHyperlink).toHaveAttribute('disabled');
        await expect(a).toHaveAttribute('disabled', '');
        await expect(a).toHaveAttribute('tabindex', '-1');

        await idsHyperlink.evaluate((hyperlink: IdsHyperlink) => { hyperlink.disabled = false; });
        disabled = await idsHyperlink.evaluate((hyperlink: IdsHyperlink) => hyperlink.disabled);
        await expect(disabled).toEqual(false);
        await expect(idsHyperlink).not.toHaveAttribute('disabled');
        await expect(a).not.toHaveAttribute('disabled');
        await expect(a).not.toHaveAttribute('tabindex');
      });

      test('can unset the color', async () => {
        await idsHyperlink.evaluate((hyperlink: IdsHyperlink) => { hyperlink.color = 'unset'; });
        const color = await idsHyperlink.evaluate((hyperlink: IdsHyperlink) => hyperlink.color);
        await expect(idsHyperlink).toHaveAttribute('color', 'unset');
        await expect(color).toEqual('unset');
      });

      test('does not render a color for inputs other than unset', async () => {
        await idsHyperlink.evaluate((hyperlink: IdsHyperlink) => { hyperlink.color = 'blue'; });
        const color = await idsHyperlink.evaluate((hyperlink: IdsHyperlink) => hyperlink.color);
        await expect(idsHyperlink).not.toHaveAttribute('color');
        await expect(color).toEqual(null);
      });

      test('sets a given font size', async () => {
        await idsHyperlink.evaluate((hyperlink: IdsHyperlink) => { hyperlink.fontSize = '14'; });
        await expect(idsHyperlink).toHaveAttribute('font-size', '14');
      });

      test('sets font weight to bold or lighter', async () => {
        await idsHyperlink.evaluate((hyperlink: IdsHyperlink) => { hyperlink.fontWeight = 'bold'; });
        await expect(idsHyperlink).toHaveAttribute('font-weight', 'bold');
        await idsHyperlink.evaluate((hyperlink: IdsHyperlink) => { hyperlink.fontWeight = 'lighter'; });
        await expect(idsHyperlink).toHaveAttribute('font-weight', 'lighter');
      });

      test('removes font size if attribute is empty', async () => {
        await idsHyperlink.evaluate((hyperlink: IdsHyperlink) => { hyperlink.fontSize = ''; });
        await expect(idsHyperlink).not.toHaveAttribute('font-size');
        const fontSize = await idsHyperlink.evaluate((hyperlink: IdsHyperlink) => hyperlink.fontSize);
        await expect(fontSize).toEqual(null);
      });

      test('does not set font weight to anything other than bold or lighter', async () => {
        await idsHyperlink.evaluate((hyperlink: IdsHyperlink) => { hyperlink.fontWeight = 'extabold'; });
        await expect(idsHyperlink).not.toHaveAttribute('font-weight');
        const fontWeight = await idsHyperlink.evaluate((hyperlink: IdsHyperlink) => hyperlink.fontWeight);
        await expect(fontWeight).toEqual(null);
      });

      test('can handle allow-empty-href setting', async () => {
        let allowEmptyHref = await idsHyperlink.evaluate((hyperlink: IdsHyperlink) => hyperlink.allowEmptyHref);
        await expect(allowEmptyHref).toEqual(true);
        await idsHyperlink.evaluate((hyperlink: IdsHyperlink) => { hyperlink.allowEmptyHref = false; });
        allowEmptyHref = await idsHyperlink.evaluate((hyperlink: IdsHyperlink) => hyperlink.allowEmptyHref);
        await expect(allowEmptyHref).toEqual(false);
        await expect(idsHyperlink).toHaveAttribute('allow-empty-href', 'false');
      });
    });
  });
});
