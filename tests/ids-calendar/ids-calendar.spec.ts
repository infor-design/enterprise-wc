import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsCalendar from '../../src/components/ids-calendar/ids-calendar';

test.describe('IdsCalendar tests', () => {
  const url = '/ids-calendar/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Calendar Component');
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
        .disableRules(['color-contrast'])
        .analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('snapshot tests', () => {
    test('should match innerHTML snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-calendar');
      const html = await handle?.evaluate((el: IdsCalendar) => el?.outerHTML);
      await expect(html).toMatchSnapshot('calendar-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-calendar');
      const html = await handle?.evaluate((el: IdsCalendar) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('calendar-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-calendar-light');
    });
  });

  test.describe('setting/attribute tests', () => {
    test('should set suppress-form', async ({ page }) => {
      const locator = await page.locator('ids-calendar').first();
      const handle = await page.$('ids-calendar');
      await handle?.evaluate((el: IdsCalendar) => {
        el.suppressForm = true;
      });
      await expect(await locator.getAttribute('suppress-form')).toEqual('');
      await handle?.evaluate((el: IdsCalendar) => {
        el.suppressForm = false;
      });
      await expect(await locator.getAttribute('suppress-form')).toEqual(null);
    });

    test('should set day, month, year', async ({ page }) => {
      const handle = await page.$('ids-calendar');

      const date = await handle?.evaluate((calendar: IdsCalendar) => {
        const day = 5;
        const month = 11;
        const year = 2019;
        calendar.date = `${month}/${day}/${year}`;
        return calendar.date;
      });

      expect(date?.getDate()).toEqual(5);
      expect(date?.getMonth()).toEqual(10);
      expect(date?.getFullYear()).toEqual(2019);
    });

    test('should set visiblity of panes', async ({ page }) => {
      const locator = await page.locator('ids-calendar').first();
      const handle = await page.$('ids-calendar');

      // set showing legend and details to true
      await handle?.evaluate((calendar: IdsCalendar) => {
        calendar.showLegend = true;
        calendar.showDetails = true;
      });
      expect(await locator.getAttribute('show-legend')).toEqual('');
      expect(await locator.getAttribute('show-details')).toEqual('');

      // set showing legend and details to false
      await handle?.evaluate((calendar: IdsCalendar) => {
        calendar.showLegend = false;
        calendar.showDetails = false;
      });
      expect(await locator.getAttribute('show-legend')).toEqual(null);
      expect(await locator.getAttribute('show-details')).toEqual(null);
    });
  });

  test.describe('methods/api', () => {
    test('should change view with changeView()', async ({ page }) => {
      const handle = await page.$('ids-calendar');
      let view = '';

      // set to week view
      await handle?.evaluate((calendar: IdsCalendar) => calendar.changeView('week'));
      view = await handle?.evaluate((calendar: IdsCalendar) => calendar.state.view);
      expect(view).toEqual('week');

      // set to day view
      await handle?.evaluate((calendar: IdsCalendar) => calendar.changeView('day'));
      view = await handle?.evaluate((calendar: IdsCalendar) => calendar.state.view);
      expect(view).toEqual('day');

      // set to month view
      await handle?.evaluate((calendar: IdsCalendar) => calendar.changeView('month'));
      view = await handle?.evaluate((calendar: IdsCalendar) => calendar.state.view);
      expect(view).toEqual('month');
    });
  });
});
