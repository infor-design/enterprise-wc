import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsMasthead from '../../src/components/ids-masthead/ids-masthead';
import type IdsButton from '../../src/components/ids-button/ids-button';
import type IdsMenuButton from '../../src/components/ids-menu-button/ids-menu-button';

test.describe('IdsMasthead tests', () => {
  const url = '/ids-masthead/example.html';
  let masthead: any;

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
    masthead = await page.locator('ids-masthead').first();
  });

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Masthead Component');
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
        .disableRules('color-contrast')
        .analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('snapshot tests', () => {
    test('should match innerHTML snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-masthead');
      const html = await handle?.evaluate((el: IdsMasthead) => el?.outerHTML);
      await expect(html).toMatchSnapshot('masthead-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-masthead');
      const html = await handle?.evaluate((el: IdsMasthead) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('masthead-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-masthead-light');
    });
  });

  test.describe('functionality tests', () => {
    test('can render any icon', async () => {
      await masthead.evaluate((mastheadEl: IdsMasthead) => mastheadEl.setAttribute('icon', ''));
      let icon = await masthead.evaluate((mastheadEl: IdsMasthead) => mastheadEl.icon);
      await expect(icon).toBe('');

      await masthead.evaluate((mastheadEl: IdsMasthead) => { mastheadEl.icon = 'info'; });
      icon = await masthead.evaluate((mastheadEl: IdsMasthead) => mastheadEl.icon);
      await expect(icon).toBe('info');
      await expect(masthead).toHaveAttribute('icon', 'info');
      let template = await masthead.evaluate((mastheadEl: IdsMasthead) => mastheadEl.template());
      expect(template).toMatchSnapshot();

      await masthead.evaluate((mastheadEl: IdsMasthead) => { mastheadEl.icon = 'user'; });
      icon = await masthead.evaluate((mastheadEl: IdsMasthead) => mastheadEl.icon);
      await expect(icon).toBe('user');
      await expect(masthead).toHaveAttribute('icon', 'user');
      template = await masthead.evaluate((mastheadEl: IdsMasthead) => mastheadEl.template());
      expect(template).toMatchSnapshot();
    });

    test('can render and updates logo', async ({ page }) => {
      const ICON1 = 'logo';
      const ICON2 = 'star-outlined';
      const logo = await page.locator('#logo');
      await masthead.evaluate((mastheadEl: IdsMasthead) => mastheadEl.setAttribute('icon', ''));
      let icon = await masthead.evaluate((mastheadEl: IdsMasthead) => mastheadEl.icon);
      await expect(icon).toBe('');

      await masthead.evaluate((mastheadEl: IdsMasthead, icon1: string) => { mastheadEl.icon = icon1; }, ICON1);
      icon = await masthead.evaluate((mastheadEl: IdsMasthead) => mastheadEl.icon);
      await expect(icon).toBe(ICON1);
      await expect(masthead).toHaveAttribute('icon', ICON1);

      await expect(logo).toHaveAttribute('id', 'logo');
      await expect(logo).toHaveClass(`icon-${ICON1}`);
      let template = await masthead.evaluate((mastheadEl: IdsMasthead) => mastheadEl.template());
      expect(template).toMatchSnapshot();

      await masthead.evaluate((mastheadEl: IdsMasthead, icon2: string) => { mastheadEl.icon = icon2; }, ICON2);
      icon = await masthead.evaluate((mastheadEl: IdsMasthead) => mastheadEl.icon);
      await expect(icon).toBe(ICON2);
      await expect(masthead).toHaveAttribute('icon', ICON2);
      await expect(logo).toHaveAttribute('id', 'logo');
      await expect(logo).toHaveClass(`icon-${ICON2}`);
      template = await masthead.evaluate((mastheadEl: IdsMasthead) => mastheadEl.template());
      expect(template).toMatchSnapshot();
    });

    test('can render and updates title', async () => {
      await masthead.evaluate((mastheadEl: IdsMasthead) => mastheadEl.setAttribute('title', ''));
      let title = await masthead.evaluate((mastheadEl: IdsMasthead) => mastheadEl.title);
      await expect(title).toBe('');

      await masthead.evaluate((mastheadEl: IdsMasthead) => { mastheadEl.title = 'Infor Application'; });
      title = await masthead.evaluate((mastheadEl: IdsMasthead) => mastheadEl.title);
      await expect(title).toBe('Infor Application');
      await expect(masthead).toHaveAttribute('title', 'Infor Application');
      const html = await masthead.evaluate((mastheadEl: IdsMasthead) => mastheadEl.shadowRoot?.innerHTML);
      await expect(html).toContain('Infor Application');
      const template = await masthead.evaluate((mastheadEl: IdsMasthead) => mastheadEl.template());
      expect(template).toMatchSnapshot();
    });

    test('can restyles buttons to be square and transparent', async ({ page }) => {
      await masthead.evaluate((mastheadEl: IdsMasthead) => { mastheadEl.title = 'Infor Application'; });
      const button = await page.locator('ids-button').first();
      const menubutton = await page.locator('ids-menu-button').first();
      await expect(await button.evaluate((btn: IdsButton) => btn.colorVariant)).toBe('alternate');
      await expect(await menubutton.evaluate((menu: IdsMenuButton) => menu.appearance)).toBe('default');
    });

    test('can have breakpoints', async () => {
      await expect(await masthead.evaluate((mastheadEl: IdsMasthead) => mastheadEl.breakpoints.mobile)).toBeDefined();
      await expect(await masthead.evaluate((mastheadEl: IdsMasthead) => mastheadEl.breakpoints.tablet)).toBeDefined();
      await expect(await masthead.evaluate((mastheadEl: IdsMasthead) => mastheadEl.breakpoints.desktop)).toBeDefined();
    });

    test('can render breakpoint: desktop', async () => {
      await expect(await masthead.evaluate((mastheadEl: IdsMasthead) => mastheadEl.isDesktop)).toBe(true);
      await expect(await masthead.evaluate((mastheadEl: IdsMasthead) => mastheadEl.isTablet)).toBe(false);
      await expect(await masthead.evaluate((mastheadEl: IdsMasthead) => mastheadEl.isMobile)).toBe(false);
      await masthead.evaluate((mastheadEl: IdsMasthead) => mastheadEl.renderBreakpoint());

      const section = await masthead.evaluate((mastheadEl: IdsMasthead) => {
        const sections = mastheadEl.elements.sections as any;
        const start = sections?.start?.querySelector('slot').assignedNodes();
        const center = sections?.center?.querySelector('slot').assignedNodes();
        const end = sections?.end?.querySelector('slot').assignedNodes();
        const more = sections?.more?.querySelector('slot').assignedNodes();
        return {
          start,
          center,
          end,
          more,
        };
      });
      await expect(section.start).toContain(await masthead.evaluate((mastheadEl: IdsMasthead) => mastheadEl.slots.start));
      await expect(section.center).toContain(await masthead.evaluate((mastheadEl:
      IdsMasthead) => mastheadEl.slots.center));
      await expect(section.end).toContain(await masthead.evaluate((mastheadEl: IdsMasthead) => mastheadEl.slots.end));
      await expect(section.more).toEqual([]);
    });

    test('can render breakpoint: tablet', async ({ page }) => {
      await page.setViewportSize({
        width: 640,
        height: 320
      });
      await expect(await masthead.evaluate((mastheadEl: IdsMasthead) => mastheadEl.isTablet)).toBe(true);
      await expect(await masthead.evaluate((mastheadEl: IdsMasthead) => mastheadEl.isDesktop)).toBe(false);
      await expect(await masthead.evaluate((mastheadEl: IdsMasthead) => mastheadEl.isMobile)).toBe(false);
      await masthead.evaluate((mastheadEl: IdsMasthead) => mastheadEl.renderBreakpoint());

      const section = await masthead.evaluate((mastheadEl: IdsMasthead) => {
        const sections = mastheadEl.elements.sections as any;
        const start = sections?.start?.querySelector('slot').assignedNodes();
        const center = sections?.center?.querySelector('slot').assignedNodes();
        const end = sections?.end?.querySelector('slot').assignedNodes();
        const more = sections?.more?.querySelector('slot').assignedNodes();
        return {
          start,
          center,
          end,
          more,
        };
      });
      await expect(section.start).toContain(await masthead.evaluate((mastheadEl: IdsMasthead) => mastheadEl.slots.start));

      await expect(section.center).toEqual([]);
      await expect(section.end).toEqual([]);
      await expect(section.more).toContain(await masthead.evaluate((mastheadEl: IdsMasthead) => mastheadEl.slots.center));
      await expect(section.more).toContain(await masthead.evaluate((mastheadEl: IdsMasthead) => mastheadEl.slots.end));
    });

    test('can render breakpoint: mobile', async ({ page }) => {
      await page.setViewportSize({
        width: 375,
        height: 320
      });
      await expect(await masthead.evaluate((mastheadEl: IdsMasthead) => mastheadEl.isMobile)).toBe(true);
      await expect(await masthead.evaluate((mastheadEl: IdsMasthead) => mastheadEl.isTablet)).toBe(false);
      await expect(await masthead.evaluate((mastheadEl: IdsMasthead) => mastheadEl.isDesktop)).toBe(false);
      await masthead.evaluate((mastheadEl: IdsMasthead) => mastheadEl.renderBreakpoint());

      const section = await masthead.evaluate((mastheadEl: IdsMasthead) => {
        const sections = mastheadEl.elements.sections as any;
        const start = sections?.start?.querySelector('slot').assignedNodes();
        const center = sections?.center?.querySelector('slot').assignedNodes();
        const end = sections?.end?.querySelector('slot').assignedNodes();
        const more = sections?.more?.querySelector('slot').assignedNodes();
        return {
          start,
          center,
          end,
          more,
        };
      });
      await expect(section.start).toEqual([]);
      await expect(section.center).toEqual([]);
      await expect(section.end).toEqual([]);
      await expect(section.more).toContain(await masthead.evaluate((mastheadEl: IdsMasthead) => mastheadEl.slots.start));
      await expect(section.more).toContain(await masthead.evaluate((mastheadEl: IdsMasthead) => mastheadEl.slots.center));
      await expect(section.more).toContain(await masthead.evaluate((mastheadEl: IdsMasthead) => mastheadEl.slots.end));
    });
  });
});
