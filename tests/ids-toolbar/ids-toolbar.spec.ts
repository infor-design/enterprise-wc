import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { Locator, expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsToolbar from '../../src/components/ids-toolbar/ids-toolbar';

test.describe('IdsToolbar tests', () => {
  const url = '/ids-toolbar/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Toolbar Component');
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
        .disableRules(['nested-interactive'])
        .analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('snapshot tests', () => {
    test('should match innerHTML snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-toolbar');
      const html = await handle?.evaluate((el: IdsToolbar) => el?.outerHTML);
      await expect(html).toMatchSnapshot('toolbar-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-toolbar');
      const html = await handle?.evaluate((el: IdsToolbar) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('toolbar-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-toolbar-light');
    });
  });

  test.describe('functionality test', () => {
    let idsToolbar: Locator;

    test.beforeEach(async ({ page }) => {
      idsToolbar = await page.locator('#my-toolbar');
    });

    test('can append early to DOM', async ({ page }) => {
      const errors: any[] = [];
      page.on('pageerror', (err) => errors.push(err.message));
      page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text); });
      await page.evaluate(() => {
        const elem = document.querySelector('ids-toolbar')! as IdsToolbar;
        document.querySelector('ids-container')!.appendChild(elem);
        elem.setAttribute('id', 'toolbar-test');
        elem.tabbable = true;
      });
      await expect(page.locator('#toolbar-test')).toBeAttached();
      expect(errors).toEqual([]);
    });

    test('can append late to DOM', async ({ page }) => {
      const errors: any[] = [];
      page.on('pageerror', (err) => errors.push(err.message));
      page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text); });
      await page.evaluate(() => {
        const elem = document.querySelector('ids-toolbar')! as IdsToolbar;
        elem.setAttribute('id', 'toolbar-test');
        elem.tabbable = true;
        document.querySelector('ids-container')!.appendChild(elem);
      });
      await expect(page.locator('#toolbar-test')).toBeAttached();
      expect(errors).toEqual([]);
    });

    test('can trigger selected event', async ({ eventsTest }) => {
      const button = await idsToolbar.locator('#button-1');
      await eventsTest.onEvent('#button-1', 'selected');
      await button.dispatchEvent('click');
      expect(await eventsTest.isEventTriggered('#button-1', 'selected')).toBeTruthy();
    });

    test('can get list of sections', async () => {
      const availableSections = ['ids-toolbar-section', 'ids-toolbar-more-actions'];
      const sections = await idsToolbar.evaluate((element: IdsToolbar) => {
        const sect = element.sections;
        return { sections: sect, nodeNames: sect.map((item) => item!.nodeName.toLowerCase()) };
      });
      expect(sections.sections).toBeTruthy();
      sections.nodeNames.forEach((name) => expect(availableSections.includes(name)).toBeTruthy());
    });

    test('can get list of items', async () => {
      const items = await idsToolbar.evaluate((element: IdsToolbar) => {
        const it = element.items;
        return { items: it, nodeNames: it.map((item) => item!.nodeName.toLowerCase()) };
      });
      expect(items.items).toBeTruthy();
      items.nodeNames.forEach((name) => expect(name).toContain('ids'));
    });
  });
});
