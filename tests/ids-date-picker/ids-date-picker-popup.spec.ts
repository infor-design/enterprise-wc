import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import type IdsDatePickerPopup from '../../src/components/ids-date-picker/ids-date-picker-popup';
import type IdsDatePicker from '../../src/components/ids-date-picker/ids-date-picker';
import type IdsMonthView from '../../src/components/ids-month-view/ids-month-view';

test.describe('IdsDatePickerPopup tests', () => {
  const url = '/ids-date-picker/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('functionality tests', () => {
    test('should have initial/default properties', async ({ page }) => {
      const datePickerPopupProps = await page.evaluate(() => {
        const datePicker = document.querySelector<IdsDatePicker>('ids-date-picker')!;
        const component = datePicker.popup as IdsDatePickerPopup;

        return {
          value: component.value,
          format: component.format,
          expanded: component.expanded,
          showWeekNumbers: component.showWeekNumbers,
          showCancel: component.showCancel,
          showClear: component.showClear
        };
      });

      expect(datePickerPopupProps.expanded).toBeFalsy();
      expect(datePickerPopupProps.showWeekNumbers).toBeFalsy();
      expect(datePickerPopupProps.value).toEqual('3/4/2016');
      expect(datePickerPopupProps.format).toEqual('M/d/yyyy');
      expect(datePickerPopupProps.showCancel).toBeFalsy();
      expect(datePickerPopupProps.showClear).toBeFalsy();
    });

    test('should set properties', async ({ page }) => {
      const datePickerPopupProps = await page.evaluate(() => {
        const datePicker = document.querySelector<IdsDatePicker>('ids-date-picker')!;
        const component = datePicker.popup as IdsDatePickerPopup;

        component.expanded = true;
        const expandedSet = component.expanded;
        component.expanded = false;
        const expandedUnset = component.expanded;

        component.showWeekNumbers = true;
        const showWeekNumbersSet = component.showWeekNumbers;
        component.showWeekNumbers = false;
        const showWeekNumbersUnset = component.showWeekNumbers;

        component.showCancel = true;
        const showCancelSet = component.showCancel;
        component.showCancel = false;
        const showCancelUnset = component.showCancel;

        component.showClear = true;
        const showClearSet = component.showClear;
        component.showClear = false;
        const showClearUnset = component.showClear;

        return {
          expandedSet,
          expandedUnset,
          showWeekNumbersSet,
          showWeekNumbersUnset,
          showCancelSet,
          showCancelUnset,
          showClearSet,
          showClearUnset
        };
      });

      expect(datePickerPopupProps.expandedSet).toBeTruthy();
      expect(datePickerPopupProps.expandedUnset).toBeFalsy();
      expect(datePickerPopupProps.showWeekNumbersSet).toBeTruthy();
      expect(datePickerPopupProps.showWeekNumbersUnset).toBeFalsy();
      expect(datePickerPopupProps.showCancelSet).toBeTruthy();
      expect(datePickerPopupProps.showCancelUnset).toBeFalsy();
      expect(datePickerPopupProps.showClearSet).toBeTruthy();
      expect(datePickerPopupProps.showClearUnset).toBeFalsy();
    });

    test('should have clear/cancel buttons', async ({ page }) => {
      const datePickerPopupProps = await page.evaluate(() => {
        const datePicker = document.querySelector<IdsDatePicker>('ids-date-picker')!;
        const component = datePicker.popup as IdsDatePickerPopup;

        component.showClear = true;
        component.showCancel = true;

        const clearHidden = component.container?.querySelector('.popup-btn-clear')?.hasAttribute('hidden');
        const cancelHidden = component.container?.querySelector('.popup-btn-cancel')?.hasAttribute('hidden');
        component.container?.querySelector<HTMLElement>('.popup-btn-clear')?.click();

        component.expanded = true;

        component.container?.querySelector<HTMLElement>('.popup-btn-cancel')?.click();

        return {
          clearHidden,
          cancelHidden,
          valueAfterClear: component.value,
          expandedAfterCancel: component.expanded,
        };
      });

      expect(datePickerPopupProps.clearHidden).toBeFalsy();
      expect(datePickerPopupProps.cancelHidden).toBeFalsy();
      expect(datePickerPopupProps.valueAfterClear).toEqual('');
      expect(datePickerPopupProps.expandedAfterCancel).toBeFalsy();
    });
  });

  test.describe('interaction tests', () => {
    test('should handle today button click', async ({ page }) => {
      const datePickerPopupProps = await page.evaluate(() => {
        const datePicker = document.querySelector<IdsDatePicker>('ids-date-picker')!;
        const component = datePicker.popup as IdsDatePickerPopup;

        component?.container?.querySelector<HTMLElement>('.btn-today')?.click();

        return {
          month: component.month,
          year: component.year,
          day: component.day
        };
      });

      const today = new Date();
      expect(datePickerPopupProps.month).toEqual(today.getMonth());
      expect(datePickerPopupProps.year).toEqual(today.getFullYear());
      expect(datePickerPopupProps.day).toEqual(today.getDate());
    });

    test('should handle next/prev month button click', async ({ page }) => {
      const datePickerPopupProps = await page.evaluate(() => {
        const datePicker = document.querySelector<IdsDatePicker>('ids-date-picker')!;
        const component = datePicker.popup as IdsDatePickerPopup;

        component?.container?.querySelector<HTMLElement>('.btn-next')?.click();

        const monthNext = component?.container?.querySelector<IdsMonthView>('ids-month-view')?.month;

        component?.container?.querySelector<HTMLElement>('.btn-previous')?.click();

        const monthPrev = component?.container?.querySelector<IdsMonthView>('ids-month-view')?.month;

        return {
          monthNext,
          monthPrev
        };
      });

      expect(datePickerPopupProps.monthNext).toEqual(3);
      expect(datePickerPopupProps.monthPrev).toEqual(2);
    });
  });
});
