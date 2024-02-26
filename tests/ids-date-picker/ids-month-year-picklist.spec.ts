import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsMonthYearPicklist from '../../src/components/ids-date-picker/ids-month-year-picklist';

test.describe('IdsMonthYearPicklist tests', () => {
  const url = '/ids-date-picker/month-year-picklist.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Date Picker Component');
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

  test.describe('functionality tests', () => {
    test('should have initial/default properties', async ({ page }) => {
      const monthYearPicklistProps = await page.evaluate(() => {
        const component = document.querySelector<IdsMonthYearPicklist>('ids-month-year-picklist')!;
        component?.activatePicklist?.();

        return {
          month: component.month,
          year: component.year,
          showPicklistYear: component.showPicklistYear,
          showPicklistMonth: component.showPicklistMonth,
          showPicklistWeek: component.showPicklistWeek,
          disabled: component.disabled,
        };
      });

      expect(monthYearPicklistProps.month).toEqual(11);
      expect(monthYearPicklistProps.year).toEqual(2016);
      expect(monthYearPicklistProps.showPicklistYear).toBeTruthy();
      expect(monthYearPicklistProps.showPicklistMonth).toBeTruthy();
      expect(monthYearPicklistProps.showPicklistWeek).toBeFalsy();
    });

    test('should set properties', async ({ page }) => {
      const monthYearPicklistProps = await page.evaluate(() => {
        const component = document.querySelector<IdsMonthYearPicklist>('ids-month-year-picklist')!;
        component.month = 5;
        component.year = 2020;
        component.showPicklistMonth = false;
        component.showPicklistWeek = true;
        component.disabled = true;
        const disabledSet = component.disabled;
        component.disabled = false;
        const disabledUnset = component.disabled;

        component?.activatePicklist?.();

        return {
          month: component.month,
          year: component.year,
          showPicklistWeek: component.showPicklistWeek,
          disabledSet,
          disabledUnset
        };
      });

      expect(monthYearPicklistProps.month).toEqual(5);
      expect(monthYearPicklistProps.year).toEqual(2020);
      expect(monthYearPicklistProps.showPicklistWeek).toBeTruthy();
      expect(monthYearPicklistProps.disabledSet).toBeTruthy();
      expect(monthYearPicklistProps.disabledUnset).toBeFalsy();
    });

    test('should show week numbers', async ({ page }) => {
      const weekNumber = await page.evaluate(() => {
        const component = document.querySelector<IdsMonthYearPicklist>('ids-month-year-picklist')!;
        component.showPicklistWeek = true;
        component.activatePicklist();
        return component.container?.querySelector<HTMLElement>('.is-week.is-selected')?.dataset.week;
      });

      expect(weekNumber).toEqual('52');
    });
  });

  test.describe('interaction tests', () => {
    test('should select month/year on click', async ({ page }) => {
      const monthYearPicklistProps = await page.evaluate(() => {
        const component = document.querySelector<IdsMonthYearPicklist>('ids-month-year-picklist')!;
        component.activatePicklist();

        component.container?.querySelector<HTMLElement>('[data-month="6"]')?.click();
        const monthOnClick = component.month;

        component.container?.querySelector<HTMLElement>('.is-btn-up.is-month-nav')?.click();
        const monthUp = component.month;

        component.container?.querySelector<HTMLElement>('.is-btn-down.is-month-nav')?.click();
        const monthDown = component.month;

        component.container?.querySelector<HTMLElement>('[data-year="2014"]')?.click();
        const yearOnClick = component.year;

        component.container?.querySelector<HTMLElement>('.is-btn-up.is-year-nav')?.click();
        const yearUp = component.year;

        component.container?.querySelector<HTMLElement>('.is-btn-down.is-year-nav')?.click();
        const yearDown = component.year;

        return {
          monthOnClick,
          monthUp,
          monthDown,
          yearOnClick,
          yearUp,
          yearDown
        };
      });

      expect(monthYearPicklistProps.monthOnClick).toEqual(6);
      expect(monthYearPicklistProps.monthUp).toEqual(0);
      expect(monthYearPicklistProps.monthDown).toEqual(6);
      expect(monthYearPicklistProps.yearOnClick).toEqual(2014);
      expect(monthYearPicklistProps.yearUp).toEqual(2008);
      expect(monthYearPicklistProps.yearDown).toEqual(2014);
    });

    test('should select week on click', async ({ page }) => {
      const monthYearPicklistProps = await page.evaluate(() => {
        const component = document.querySelector<IdsMonthYearPicklist>('ids-month-year-picklist')!;
        component.showPicklistWeek = true;
        component.activatePicklist();
        const getSelectedWeek = () => component.container?.querySelector<HTMLElement>('.is-week.is-selected')?.dataset.week;

        component.container?.querySelector<HTMLElement>('[data-week="50"]')?.click();
        const weekOnClick = getSelectedWeek();

        component.container?.querySelector<HTMLElement>('.is-btn-up.is-week-nav')?.click();
        const weekUp = getSelectedWeek();

        component.container?.querySelector<HTMLElement>('.is-btn-down.is-week-nav')?.click();
        const weekDown = getSelectedWeek();

        return {
          weekOnClick,
          weekUp,
          weekDown
        };
      });

      expect(monthYearPicklistProps.weekOnClick).toEqual('50');
      expect(monthYearPicklistProps.weekUp).toEqual('44');
      expect(monthYearPicklistProps.weekDown).toEqual('50');
    });
  });

  test.describe('keyboard tests', () => {
    test('should navigate months/years with keyboard', async ({ page }) => {
      const getMonthYear = async () => {
        const value = await page.evaluate(() => {
          const component = document.querySelector<IdsMonthYearPicklist>('ids-month-year-picklist')!;

          return {
            month: component.month,
            year: component.year
          };
        });

        return value;
      };

      await page.evaluate(() => {
        const component = document.querySelector<IdsMonthYearPicklist>('ids-month-year-picklist')!;
        component.activatePicklist();
        component.container?.querySelector<HTMLElement>('.is-month.is-selected')?.focus();
      });

      await page.keyboard.press('ArrowUp');

      expect(await getMonthYear()).toEqual({ month: 10, year: 2016 });

      await page.keyboard.press('ArrowDown');

      expect(await getMonthYear()).toEqual({ month: 11, year: 2016 });

      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowDown');

      expect(await getMonthYear()).toEqual({ month: 6, year: 2016 });

      await page.keyboard.press('ArrowUp');
      await page.keyboard.press('ArrowUp');
      await page.keyboard.press('ArrowUp');

      expect(await getMonthYear()).toEqual({ month: 11, year: 2016 });

      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('ArrowUp');

      expect(await getMonthYear()).toEqual({ month: 11, year: 2015 });

      await page.keyboard.press('ArrowDown');

      expect(await getMonthYear()).toEqual({ month: 11, year: 2016 });

      await page.keyboard.press('ArrowUp');
      await page.keyboard.press('ArrowUp');
      await page.keyboard.press('ArrowUp');
      await page.keyboard.press('Enter');
      await page.keyboard.press('ArrowDown');

      expect(await getMonthYear()).toEqual({ month: 11, year: 2008 });

      await page.keyboard.press('ArrowDown');

      expect(await getMonthYear()).toEqual({ month: 11, year: 2009 });
    });

    test('should navigate weeks with keyboard', async ({ page }) => {
      const getWeek = async () => {
        const weekNumber = await page.evaluate(() => {
          const component = document.querySelector<IdsMonthYearPicklist>('ids-month-year-picklist')!;

          return component.container?.querySelector<HTMLElement>('.is-week.is-selected')?.dataset.week;
        });

        return weekNumber;
      };

      await page.evaluate(() => {
        const component = document.querySelector<IdsMonthYearPicklist>('ids-month-year-picklist')!;
        component.showPicklistWeek = true;
        component.activatePicklist();
        component.container?.querySelector<HTMLElement>('.is-week.is-selected')?.focus();
      });

      await page.keyboard.press('ArrowUp');
      await page.keyboard.press('ArrowUp');

      expect(await getWeek()).toEqual('50');

      await page.keyboard.press('ArrowDown');

      expect(await getWeek()).toEqual('51');

      await page.keyboard.press('ArrowUp');
      await page.keyboard.press('ArrowUp');
      await page.keyboard.press('Enter');
      await page.keyboard.press('ArrowUp');
      await page.keyboard.press('ArrowUp');

      expect(await getWeek()).toEqual('49');
    });
  });
});
