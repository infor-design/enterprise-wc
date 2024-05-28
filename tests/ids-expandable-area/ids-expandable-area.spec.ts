import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsExpandableArea from '../../src/components/ids-expandable-area/ids-expandable-area';

test.describe('IdsExpandableArea tests', () => {
  const url = '/ids-expandable-area/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Expandable Area Component');
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
        .disableRules('aria-allowed-attr')
        .analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('snapshot tests', () => {
    test('should match innerHTML snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-expandable-area');
      const html = await handle?.evaluate((el: IdsExpandableArea) => el?.outerHTML);
      await expect(html).toMatchSnapshot('expandable-area-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-expandable-area');
      const html = await handle?.evaluate((el: IdsExpandableArea) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('expandable-area-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-expandable-area-light');
    });
  });

  test.describe('expandable area functional tests', () => {
    test.beforeEach(async ({ page }) => {
      await page.evaluate(() => {
        document.querySelector('ids-expandable-area:first-child')!.setAttribute('id', 'ea-1');
        document.querySelector('ids-expandable-area:nth-child(2)')!.setAttribute('id', 'ea-2');
        document.querySelector('ids-expandable-area:nth-child(3)')!.setAttribute('id', 'ea-3');
        document.querySelector('ids-expandable-area:nth-child(4)')!.setAttribute('id', 'ea-4');
      });
    });
    test('can change its type property', async ({ page }) => {
      const ea = await page.locator('ids-expandable-area').first();
      expect(await ea.evaluate((element: IdsExpandableArea) => {
        element.type = '';
        return element.type;
      })).toEqual('');
      await expect(ea).toHaveAttribute('type', '');
      await ea.evaluate((element: IdsExpandableArea) => { element.type = 'partial'; });
      await expect(ea).toHaveAttribute('type', 'partial');
      await ea.evaluate((element: IdsExpandableArea) => { element.type = null; });
      await expect(ea).toHaveAttribute('type', '');
      await ea.evaluate((element: IdsExpandableArea) => { element.type = 'toggle-btn'; });
      await expect(ea).toHaveAttribute('type', 'toggle-btn');
      await ea.evaluate((element: IdsExpandableArea) => { element.type = 'bad-name'; });
      await expect(ea).toHaveAttribute('type', '');
    });

    test('can change its expanded property', async ({ page }) => {
      const ea = await page.locator('ids-expandable-area').first();
      expect(await ea.evaluate((element: IdsExpandableArea) => {
        element.expanded = true;
        return element.expanded;
      })).toEqual('true');
      await expect(ea).toHaveAttribute('expanded', 'true');
      await ea.evaluate((element: IdsExpandableArea) => { element.expanded = 'false'; });
      await expect(ea).toHaveAttribute('expanded', 'false');
    });

    test('renders with IdsToggleButton as expander', async ({ page }) => {
      await expect(page.locator('#ea-1 .ids-expandable-area-expander')).toBeAttached();
      await expect(page.locator('#ea-2 .ids-expandable-area-expander')).toBeAttached();
      await expect(page.locator('#ea-3 .ids-expandable-area-expander')).toBeAttached();
      await expect(page.locator('#ea-4 .ids-expandable-area-expander')).not.toBeAttached();
    });

    test('can be expanded/collapsed when clicked (mouse)', async ({ page }) => {
      const ea = await page.locator('ids-expandable-area').first();
      const expander = await ea.locator('ids-hyperlink[slot="expander-default"]');
      const expanded = await ea.locator('ids-hyperlink[slot="expander-expanded"]');
      await expander.click();
      await expect(ea).toHaveAttribute('expanded', 'true');
      await expanded.click();
      await expect(ea).toHaveAttribute('expanded', 'false');
    });

    test('can change the height of pane', async ({ page }) => {
      const el = await page.locator('ids-expandable-area').first();
      await el.evaluate((element: IdsExpandableArea) => {
        element.pane!.style.height = '100px';
      });
      await expect(el.locator('.ids-expandable-area-pane')).toHaveCSS('height', '100px');

      await el.evaluate((element: IdsExpandableArea) => {
        element.pane!.style.height = '0px';
      });
      await expect(el.locator('.ids-expandable-area-pane')).toHaveCSS('height', '0px');
    });

    test('can create component without error', async ({ page }) => {
      const errors: any[] = [];
      page.on('pageerror', (e) => {
        errors.push(e.message);
      });

      page.on('console', (e) => {
        if (e.type() === 'error') {
          errors.push(e.text);
        }
      });
      await page.evaluate(() => {
        const expandable = document.createElement('ids-expandable-area')! as IdsExpandableArea;
        document.querySelector('ids-container')!.appendChild(expandable);
        expandable.pane = null;
        expandable.expanded = true;
        expandable.expanded = false;
        expandable.expanded = true;
      });
      expect(errors).toEqual([]);
    });

    test('wont error caling api with no panel', async ({ page }) => {
      const ea = await page.locator('ids-expandable-area').first();
      expect(await ea.evaluate((element: IdsExpandableArea) => {
        element.pane = '' as any;
        return element.pane;
      })).toEqual('');
    });

    test('can veto before expand/collapse', async ({ page }) => {
      const ea = await page.locator('ids-expandable-area').first();
      expect(await ea.evaluate((element: IdsExpandableArea) => {
        element.addEventListener('beforeexpand', (evt: any) => evt.detail.response(false), { once: true });
        element.expander!.dispatchEvent(new MouseEvent('click'));
        return element.expanded;
      })).toEqual('false');
      await ea.locator('ids-hyperlink[slot="expander-default"]').click();
      expect(await ea.evaluate((element: IdsExpandableArea) => {
        element.addEventListener('beforecollapse', (evt: any) => evt.detail.response(false), { once: true });
        element.expander!.dispatchEvent(new MouseEvent('click'));
        return element.expanded;
      })).toEqual('true');
    });

    test('can triggers expand/collapse events', async ({ page, eventsTest }) => {
      const ea = await page.locator('#ea-1');
      const expander = await ea.locator('ids-hyperlink[slot="expander-default"]');
      const collapse = await ea.locator('ids-hyperlink[slot="expander-expanded"]');
      await eventsTest.onEvent('#ea-1', 'expand');
      await eventsTest.onEvent('#ea-1', 'collapse');
      await expander.dispatchEvent('click');
      expect(await eventsTest.isEventTriggered('#ea-1', 'expand')).toBeTruthy();
      expect(await eventsTest.isEventTriggered('#ea-1', 'collapse')).toBeFalsy();
      await collapse.dispatchEvent('click');
      expect(await eventsTest.isEventTriggered('#ea-1', 'expand')).toBeTruthy();
      expect(await eventsTest.isEventTriggered('#ea-1', 'collapse')).toBeTruthy();
    });

    test('can trigger afterexpand/aftercollapse events', async ({ page, eventsTest }) => {
      const ea = await page.locator('#ea-1');
      const expander = await ea.locator('ids-hyperlink[slot="expander-default"]');
      const collapse = await ea.locator('ids-hyperlink[slot="expander-expanded"]');
      const pane = await ea.locator('ids-text[slot="pane"]');

      await eventsTest.onEvent('#ea-1', 'afterexpand');
      await eventsTest.onEvent('#ea-1', 'aftercollapse');

      await expander.dispatchEvent('click');
      await pane.dispatchEvent('transitionend');

      expect(await eventsTest.isEventTriggered('#ea-1', 'afterexpand')).toBeTruthy();
      expect(await eventsTest.isEventTriggered('#ea-1', 'aftercollapse')).toBeFalsy();

      await collapse.dispatchEvent('click');
      await pane.dispatchEvent('transitionend');

      expect(await eventsTest.isEventTriggered('#ea-1', 'afterexpand')).toBeTruthy();
      expect(await eventsTest.isEventTriggered('#ea-1', 'aftercollapse')).toBeTruthy();
    });

    test.describe('mobile emulation tests', () => {
      test.use({
        hasTouch: true,
        isMobile: true,
        viewport: {
          width: 430,
          height: 932
        }
      });
      test('can expand/collapse via touchstart', async ({ page, eventsTest }) => {
        const idsExpandArea = await page.locator('ids-expandable-area').first();
        const expander = await idsExpandArea.locator('[data-expander]').first();
        const tapExpander = async () => {
          await expander.evaluate((node) => {
            const touch = new Touch({
              identifier: Date.now(),
              target: node
            });
            node.dispatchEvent(new TouchEvent('touchstart', {
              bubbles: true,
              touches: [touch],
              changedTouches: [touch]
            }));
          });
        };
        await eventsTest.onEvent('ids-expandable-area', 'expand');
        await eventsTest.onEvent('ids-expandable-area', 'collapse');
        await expander.waitFor();
        await expect(async () => {
          await tapExpander();
          await expect(idsExpandArea).toHaveAttribute('expanded', 'true');
        }).toPass();
        expect(await eventsTest.isEventTriggered('ids-expandable-area', 'expand')).toBeTruthy();
        expect(await eventsTest.isEventTriggered('ids-expandable-area', 'collapse')).toBeFalsy();

        await expander.waitFor();
        await expect(async () => {
          await tapExpander();
          await expect(idsExpandArea).toHaveAttribute('expanded', 'false');
        }).toPass();
        expect(await eventsTest.isEventTriggered('ids-expandable-area', 'expand')).toBeTruthy();
        expect(await eventsTest.isEventTriggered('ids-expandable-area', 'collapse')).toBeTruthy();
      });
    });
  });
});
