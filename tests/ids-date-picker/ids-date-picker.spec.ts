import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import type IdsDatePicker from '../../src/components/ids-date-picker/ids-date-picker';
import type IdsTimePickerPopup from '../../src/components/ids-time-picker/ids-time-picker-popup';
import type IdsMonthView from '../../src/components/ids-month-view/ids-month-view';

test.describe('IdsDatePicker tests', () => {
  const url = '/ids-date-picker/example.html';

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
      const handle = await page.$('ids-date-picker');
      const html = await handle?.evaluate((el: IdsDatePicker) => el?.outerHTML);
      await expect(html).toMatchSnapshot('date-picker-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-date-picker');
      const html = await handle?.evaluate((el: IdsDatePicker) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('date-picker-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-date-picker-light');
    });
  });

  test.describe('event tests', () => {
    test('should fire change event', async ({ page }) => {
      const eventFiredCount = await page.evaluate(() => {
        let changeCount = 0;
        const datePicker = document.querySelector('ids-date-picker') as IdsDatePicker;
        datePicker.addEventListener('change', () => { changeCount++; });
        datePicker.value = '3/20/2016';
        return changeCount;
      });

      expect(eventFiredCount).toEqual(1);
    });

    test('should fire input event', async ({ page }) => {
      const eventFiredCount = await page.evaluate(() => {
        let changeCount = 0;
        const datePicker = document.querySelector('ids-date-picker') as IdsDatePicker;
        datePicker.addEventListener('input', () => { changeCount++; });
        datePicker.value = '3/20/2016';
        return changeCount;
      });

      expect(eventFiredCount).toEqual(1);
    });
  });

  test.describe('locale tests', () => {
    test('should change format based on locale', async ({ page }) => {
      const currentFormat = await page.evaluate(() => {
        const datePicker = document.querySelector<IdsDatePicker>('ids-date-picker')!;
        return datePicker.format;
      });

      expect(currentFormat).toEqual('M/d/yyyy');

      await page.evaluate(async () => {
        await window?.IdsGlobal?.locale?.setLocale('de-DE');
      });

      const newFormat = await page.evaluate(() => {
        const datePicker = document.querySelector('ids-date-picker') as IdsDatePicker;
        return datePicker.format;
      });

      expect(newFormat).toEqual('dd.MM.yyyy');
    });
  });

  test.describe('functionality tests', () => {
    test('should have initial/default properties', async ({ page }) => {
      const datePickerValue = await page.evaluate(() => {
        const component = document.querySelector<IdsDatePicker>('ids-date-picker')!;
        return {
          tabbable: component.tabbable,
          showToday: component.showToday,
          firstDayOfWeek: component.firstDayOfWeek,
          id: component.id,
          label: component.label,
          disabled: component.disabled,
          readonly: component.readonly,
          value: component.value,
          size: component.size,
          validate: component.validate,
          validationEvents: component.validationEvents,
          format: component.format,
          month: component.month,
          year: component.year,
          day: component.day,
          showPicklistYear: component.showPicklistYear,
          showPicklistMonth: component.showPicklistMonth,
          showPicklistWeek: component.showPicklistWeek,
          showClear: component.showClear,
          showCancel: component.showCancel,
          disableSettings: component.disableSettings,
          hasFocus: component.hasFocus,
          noMargins: component.noMargins,
          showWeekNumbers: component.showWeekNumbers,
          useCurrentTime: component.useCurrentTime,
          placeholder: component.placeholder,
        };
      });
      expect(datePickerValue.tabbable).toBeFalsy();
      expect(datePickerValue.showToday).toBeTruthy();
      expect(datePickerValue.firstDayOfWeek).toEqual(0);
      expect(datePickerValue.id).toEqual('datepicker-value');
      expect(datePickerValue.label).toEqual('Date Field');
      expect(datePickerValue.disabled).toBeFalsy();
      expect(datePickerValue.readonly).toBeFalsy();
      expect(datePickerValue.value).toEqual('3/4/2016');
      expect(datePickerValue.size).toEqual('sm');
      expect(datePickerValue.validate).toBeNull();
      expect(datePickerValue.validationEvents).toEqual('change blur');
      expect(datePickerValue.format).toEqual('M/d/yyyy');
      expect(datePickerValue.month).toEqual((new Date()).getMonth());
      expect(datePickerValue.year).toEqual((new Date()).getFullYear());
      expect(datePickerValue.day).toEqual((new Date()).getDate());
      expect(datePickerValue.showPicklistYear).toBeTruthy();
      expect(datePickerValue.showPicklistMonth).toBeTruthy();
      expect(datePickerValue.showPicklistWeek).toBeFalsy();
      expect(datePickerValue.showClear).toBeFalsy();
      expect(datePickerValue.showCancel).toBeFalsy();
      expect(datePickerValue.disableSettings).toEqual({
        dates: [],
        years: [],
        minDate: '',
        maxDate: '',
        dayOfWeek: [],
        isEnable: false
      });
      expect(datePickerValue.hasFocus).toBeFalsy();
      expect(datePickerValue.noMargins).toBeFalsy();
      expect(datePickerValue.showWeekNumbers).toBeFalsy();
      expect(datePickerValue.useCurrentTime).toBeFalsy();
    });

    test('should set properties', async ({ page }) => {
      const datePickerValue = await page.evaluate(() => {
        const component = document.querySelector<IdsDatePicker>('ids-date-picker')!;

        // Set placeholder
        component.placeholder = false;
        const placeholderUnset = component.placeholder;
        component.placeholder = true;
        const placeholderSet = component.placeholder;

        // Set disabled
        component.disabled = true;
        const disabledSet = component.disabled;
        component.disabled = false;
        const disabledUnset = component.disabled;

        // Set readonly
        component.readonly = true;
        const readonlySet = component.readonly;
        component.readonly = false;
        const readonlyUnset = component.readonly;

        // Set validationEvents
        component.validationEvents = 'change';
        const validationEventsSet = component.validationEvents;
        component.validationEvents = null;
        const validationEventsUnset = component.validationEvents;

        // Set noMargins
        component.noMargins = true;
        const noMarginsSet = component.noMargins;
        component.noMargins = false;
        const noMarginsUnset = component.noMargins;

        // Set mask
        component.mask = true;
        const maskSet = component.mask;
        component.mask = false;
        const maskUnset = component.mask;

        // Set showClear
        component.showClear = true;
        const showClearSet = component.showClear;
        const showClearPicker = component.popup?.showClear;
        component.showClear = false;
        const showClearUnset = component.showClear;

        // Set showCancel
        component.showCancel = true;
        const showCancelSet = component.showCancel;
        const showCancelPicker = component.popup?.showCancel;
        component.showCancel = false;
        const showCancelUnset = component.showCancel;

        // Set showPicklistYear
        component.showPicklistYear = false;
        const showPicklistYearSet = component.showPicklistYear;
        const showPicklistYearPicker = component.popup?.showPicklistYear;
        component.showPicklistYear = true;
        const showPicklistYearUnset = component.showPicklistYear;

        // Set showPicklistMonth
        component.showPicklistMonth = false;
        const showPicklistMonthSet = component.showPicklistMonth;
        const showPicklistMonthPicker = component.popup?.showPicklistMonth;
        component.showPicklistMonth = true;
        const showPicklistMonthUnset = component.showPicklistMonth;

        // Set showPicklistWeek
        component.showPicklistWeek = true;
        const showPicklistWeekSet = component.showPicklistWeek;
        const showPicklistWeekPicker = component.popup?.showPicklistWeek;
        component.showPicklistWeek = false;
        const showPicklistWeekUnset = component.showPicklistWeek;

        // Set showWeekNumbers
        component.showWeekNumbers = true;
        const showWeekNumbersSet = component.showWeekNumbers;
        component.showWeekNumbers = false;
        const showWeekNumbersUnset = component.showWeekNumbers;

        // Set useCurrentTime
        component.useCurrentTime = true;
        const useCurrentTimeSet = component.useCurrentTime;
        const useCurrentTimePicker = component.popup?.useCurrentTime;
        component.useCurrentTime = false;
        const useCurrentTimeUnset = component.useCurrentTime;

        // Set secondInterval
        component.secondInterval = 10;
        const secondIntervalSet = component.secondInterval;
        const secondIntervalPicker = component.popup?.secondInterval;
        component.secondInterval = null;
        const secondIntervalUnset = component.secondInterval;

        // Set minuteInterval
        component.minuteInterval = 10;
        const minuteIntervalSet = component.minuteInterval;
        const minuteIntervalPicker = component.popup?.minuteInterval;
        component.minuteInterval = null;
        const minuteIntervalUnset = component.minuteInterval;

        // Set validate
        component.validate = 'required';
        const validateSet = component.validate;
        component.validate = null;
        const validateUnset = component.validate;

        // Set ID
        component.id = 'test-id';
        const idSet = component.id;
        component.onIdChange(null);
        const idUnset = component.id;

        // Set format
        component.format = 'yyyy-MM-dd';
        const formatSet = component.format;
        component.format = null;
        const formatUnset = component.format;

        // Set dirty tracker
        component.dirtyTracker = true;
        const dirtyTrackerSet = component.dirtyTracker;
        component.dirtyTracker = false;
        const dirtyTrackerUnset = component.dirtyTracker;

        // Set label required
        component.labelRequired = true;
        const labelRequiredSet = component.labelRequired;
        component.labelRequired = false;
        const labelRequiredUnset = component.labelRequired;

        // Set label state
        component.labelState = 'collapsed';
        const labelStateSet = component.labelState;
        component.labelState = null;
        const labelStateUnset = component.labelState;

        // Set color variant
        component.colorVariant = 'borderless';
        const colorVariantSet = component.colorVariant;
        component.colorVariant = null;
        const colorVariantUnset = component.colorVariant;

        return {
          placeholderUnset,
          placeholderSet,
          disabledSet,
          disabledUnset,
          readonlySet,
          readonlyUnset,
          validationEventsSet,
          validationEventsUnset,
          noMarginsSet,
          noMarginsUnset,
          maskSet,
          maskUnset,
          showClearSet,
          showClearPicker,
          showClearUnset,
          showCancelSet,
          showCancelPicker,
          showCancelUnset,
          showPicklistYearSet,
          showPicklistYearPicker,
          showPicklistYearUnset,
          showPicklistMonthSet,
          showPicklistMonthPicker,
          showPicklistMonthUnset,
          showPicklistWeekSet,
          showPicklistWeekPicker,
          showPicklistWeekUnset,
          showWeekNumbersSet,
          showWeekNumbersUnset,
          useCurrentTimeSet,
          useCurrentTimePicker,
          useCurrentTimeUnset,
          secondIntervalSet,
          secondIntervalPicker,
          secondIntervalUnset,
          minuteIntervalSet,
          minuteIntervalPicker,
          minuteIntervalUnset,
          validateSet,
          validateUnset,
          idSet,
          idUnset,
          formatSet,
          formatUnset,
          dirtyTrackerSet,
          dirtyTrackerUnset,
          labelRequiredSet,
          labelRequiredUnset,
          labelStateSet,
          labelStateUnset,
          colorVariantSet,
          colorVariantUnset
        };
      });

      expect(datePickerValue.placeholderUnset).toEqual('');
      expect(datePickerValue.placeholderSet).toEqual('M/d/yyyy');
      expect(datePickerValue.disabledSet).toBeTruthy();
      expect(datePickerValue.disabledUnset).toBeFalsy();
      expect(datePickerValue.readonlySet).toBeTruthy();
      expect(datePickerValue.readonlyUnset).toBeFalsy();
      expect(datePickerValue.validationEventsSet).toEqual('change');
      expect(datePickerValue.validationEventsUnset).toEqual('change blur');
      expect(datePickerValue.noMarginsSet).toBeTruthy();
      expect(datePickerValue.noMarginsUnset).toBeFalsy();
      expect(datePickerValue.maskSet).toBeTruthy();
      expect(datePickerValue.maskUnset).toBeFalsy();
      expect(datePickerValue.showClearSet).toBeTruthy();
      expect(datePickerValue.showClearPicker).toBeTruthy();
      expect(datePickerValue.showClearUnset).toBeFalsy();
      expect(datePickerValue.showCancelSet).toBeTruthy();
      expect(datePickerValue.showCancelPicker).toBeTruthy();
      expect(datePickerValue.showCancelUnset).toBeFalsy();
      expect(datePickerValue.showPicklistYearSet).toBeFalsy();
      expect(datePickerValue.showPicklistYearPicker).toBeFalsy();
      expect(datePickerValue.showPicklistYearUnset).toBeTruthy();
      expect(datePickerValue.showPicklistMonthSet).toBeFalsy();
      expect(datePickerValue.showPicklistMonthPicker).toBeFalsy();
      expect(datePickerValue.showPicklistMonthUnset).toBeTruthy();
      expect(datePickerValue.showPicklistWeekSet).toBeTruthy();
      expect(datePickerValue.showPicklistWeekPicker).toBeTruthy();
      expect(datePickerValue.showPicklistWeekUnset).toBeFalsy();
      expect(datePickerValue.showWeekNumbersSet).toBeTruthy();
      expect(datePickerValue.showWeekNumbersUnset).toBeFalsy();
      expect(datePickerValue.useCurrentTimeSet).toBeTruthy();
      expect(datePickerValue.useCurrentTimePicker).toBeTruthy();
      expect(datePickerValue.useCurrentTimeUnset).toBeFalsy();
      expect(datePickerValue.secondIntervalSet).toEqual(10);
      expect(datePickerValue.secondIntervalPicker).toEqual(10);
      expect(datePickerValue.secondIntervalUnset).toBeNaN();
      expect(datePickerValue.minuteIntervalSet).toEqual(10);
      expect(datePickerValue.minuteIntervalPicker).toEqual(10);
      expect(datePickerValue.minuteIntervalUnset).toBeNaN();
      expect(datePickerValue.validateSet).toEqual('required');
      expect(datePickerValue.validateUnset).toBeNull();
      expect(datePickerValue.idSet).toEqual('test-id');
      expect(datePickerValue.idUnset).toEqual('');
      expect(datePickerValue.formatSet).toEqual('yyyy-MM-dd');
      expect(datePickerValue.formatUnset).toEqual('M/d/yyyy');
      expect(datePickerValue.dirtyTrackerSet).toBeTruthy();
      expect(datePickerValue.dirtyTrackerUnset).toBeFalsy();
      expect(datePickerValue.labelRequiredSet).toBeTruthy();
      expect(datePickerValue.labelRequiredUnset).toBeFalsy();
      expect(datePickerValue.labelStateSet).toEqual('collapsed');
      expect(datePickerValue.labelStateUnset).toBeNull();
      expect(datePickerValue.colorVariantSet).toEqual('borderless');
      expect(datePickerValue.colorVariantUnset).toBeNull();
    });

    test('should set size', async ({ page }) => {
      const sizes = ['xs', 'sm', 'mm', 'md', 'lg', 'full'];
      const defaultSize = 'sm';
      const checkSize = async (size: string) => {
        const datePickerSizes = await page.evaluate((sizeArg) => {
          const component = document.querySelector<IdsDatePicker>('ids-date-picker')!;
          component.size = sizeArg;

          return {
            size: component.size,
            triggerFieldSize: component.triggerField.size,
          };
        }, size);

        expect(datePickerSizes.size).toEqual(size);
        expect(datePickerSizes.triggerFieldSize).toEqual(size);
      };

      sizes.forEach((s) => checkSize(s));

      // Reset to default size
      const datePickerSizes = await page.evaluate(() => {
        const component = document.querySelector<IdsDatePicker>('ids-date-picker')!;
        component.size = null;

        return {
          size: component.size,
          triggerFieldSize: component.triggerField.size,
        };
      });

      expect(datePickerSizes.size).toEqual(defaultSize);
      expect(datePickerSizes.triggerFieldSize).toEqual(defaultSize);

      const datePickerFull = await page.evaluate(() => {
        const component = document.querySelector<IdsDatePicker>('ids-date-picker')!;
        component.size = 'full';

        return component?.container?.classList.contains('full');
      });

      expect(datePickerFull).toBeTruthy();
    });

    test('should render field height', async ({ page }) => {
      const heights = ['xs', 'sm', 'md', 'lg'];
      const defaultHeight = 'md';
      const checkHeight = async (height: string) => {
        const datePickerHeights = await page.evaluate((heightArg) => {
          const component = document.querySelector<IdsDatePicker>('ids-date-picker')!;
          component.fieldHeight = heightArg;

          return {
            fieldHeight: component.fieldHeight,
            inputFieldHeight: component.input.fieldHeight,
            hasClass: component?.container?.classList.contains(`field-height-${heightArg}`),
          };
        }, height);

        expect(datePickerHeights.fieldHeight).toEqual(height);
        expect(datePickerHeights.inputFieldHeight).toEqual(height);
        expect(datePickerHeights.hasClass).toBeTruthy();
      };

      heights.forEach((h: any) => checkHeight(h));

      // Reset to default height
      const datePickerHeights = await page.evaluate((heightArg) => {
        const component = document.querySelector<IdsDatePicker>('ids-date-picker')!;
        component.fieldHeight = heightArg;
        component.onFieldHeightChange(heightArg);

        return {
          fieldHeight: component.fieldHeight,
          inputFieldHeight: component.input.fieldHeight,
          hasClass: component?.container?.classList.contains(`field-height-${heightArg}`),
        };
      }, defaultHeight);

      expect(datePickerHeights.fieldHeight).toEqual(defaultHeight);
      expect(datePickerHeights.inputFieldHeight).toEqual(defaultHeight);
      expect(datePickerHeights.hasClass).toBeTruthy();
    });

    test('should set compact height', async ({ page }) => {
      const datePickerValue = await page.evaluate(() => {
        const component = document.querySelector<IdsDatePicker>('ids-date-picker')!;

        component.compact = true;
        const compactPropSet = component.compact;
        const compactAttrSet = component.hasAttribute('compact');
        const compactClassSet = component?.container?.classList.contains('compact');

        component.compact = false;
        const compactPropUnset = component.compact;
        const compactAttrUnset = component.hasAttribute('compact');
        const compactClassUnset = component?.container?.classList.contains('compact');

        return {
          compactPropSet,
          compactAttrSet,
          compactClassSet,
          compactPropUnset,
          compactAttrUnset,
          compactClassUnset,
        };
      });

      expect(datePickerValue.compactPropSet).toBeTruthy();
      expect(datePickerValue.compactAttrSet).toBeTruthy();
      expect(datePickerValue.compactClassSet).toBeTruthy();
      expect(datePickerValue.compactPropUnset).toBeFalsy();
      expect(datePickerValue.compactAttrUnset).toBeFalsy();
      expect(datePickerValue.compactClassUnset).toBeFalsy();
    });

    test('should set day, month, year', async ({ page }) => {
      const datePickerValue = await page.evaluate(() => {
        const component = document.querySelector<IdsDatePicker>('ids-date-picker')!;

        component.onMonthChange(2, true);
        component.onYearChange(2010, true);
        component.onDayChange(4, true);
        const monthSet = component?.picker?.month;
        const yearSet = component?.picker?.year;
        const daySet = component?.picker?.day;
        component.onMonthChange(3, false);
        component.onYearChange(2024, false);
        component.onDayChange(10, false);
        const monthUnset = component?.picker?.month;
        const yearUnset = component?.picker?.year;
        const dayUnset = component?.picker?.day;

        return {
          monthSet,
          yearSet,
          daySet,
          monthUnset,
          yearUnset,
          dayUnset,
        };
      });

      expect(datePickerValue.monthSet).toEqual(2);
      expect(datePickerValue.yearSet).toEqual(2010);
      expect(datePickerValue.daySet).toEqual(4);
      expect(datePickerValue.monthUnset).toEqual((new Date()).getMonth());
      expect(datePickerValue.yearUnset).toEqual((new Date()).getFullYear());
      expect(datePickerValue.dayUnset).toEqual((new Date()).getDate());
    });

    test('should set focus', async ({ page }) => {
      const hasFocus = await page.evaluate(() => {
        const component = document.querySelector<IdsDatePicker>('ids-date-picker')!;
        component?.focus();
        return component.hasFocus;
      });

      expect(hasFocus).toBeTruthy();
    });

    test('should set range settings', async ({ page }) => {
      const datePickerValue = await page.evaluate(() => {
        const component = document.querySelector<IdsDatePicker>('ids-date-picker')!;

        component.useRange = true;
        component.rangeSettings = {
          start: '5/11/2020',
          end: '5/14/2020',
          selectWeek: true,
          separator: ' - '
        };

        const useRangeSet = component.useRange;
        const value = component.value;

        component.useRange = false;
        const useRangeUnset = component.useRange;

        return {
          useRangeSet,
          value,
          useRangeUnset
        };
      });

      expect(datePickerValue.useRangeSet).toBeTruthy();
      expect(datePickerValue.value).toEqual('5/11/2020 - 5/14/2020');
      expect(datePickerValue.useRangeUnset).toBeFalsy();
    });
  });

  test.describe('interaction tests', () => {
    test('should open and close the popup with methods', async ({ page }) => {
      const datePickerValue = await page.evaluate(() => {
        const component = document.querySelector<IdsDatePicker>('ids-date-picker')!;
        if (component.popup?.popup?.animated) {
          component.popup.popup.animated = false;
        }
        component.open();
        const pickerVisible = component.popup?.visible;
        component.close();
        const pickerHidden = component.popup?.visible;
        return {
          pickerVisible,
          pickerHidden
        };
      });

      expect(datePickerValue.pickerVisible).toBeTruthy();
      expect(datePickerValue.pickerHidden).toBeFalsy();
    });

    test('should select a date', async ({ page }) => {
      const selectedDate = await page.evaluate(() => {
        const component = document.querySelector<IdsDatePicker>('ids-date-picker')!;
        const monthView = component?.popup?.container?.querySelector<IdsMonthView>('ids-month-view');
        monthView?.container?.querySelector<HTMLElement>('[data-day="28"]')?.click();

        return component.value;
      });

      expect(selectedDate).toEqual('2/28/2016');
    });
  });

  test.describe('keyboard tests', () => {
    test('should open and close the popup with keyboard', async ({ page }) => {
      await page.evaluate(() => {
        const component = document.querySelector<IdsDatePicker>('ids-date-picker')!;
        if (component.popup?.popup?.animated) {
          component.popup.popup.animated = false;
        }
        component.focus();
      });
      await page.keyboard.press('ArrowDown');
      await page.waitForTimeout(100);

      const pickerVisible = await page.evaluate(() => {
        const component = document.querySelector<IdsDatePicker>('ids-date-picker')!;
        if (component.popup?.popup?.animated) {
          component.popup.popup.animated = false;
        }
        return component.popup?.visible;
      });

      expect(pickerVisible).toBeTruthy();

      await page.keyboard.press('Escape');
      await page.waitForTimeout(100);

      const pickerHidden = await page.evaluate(() => {
        const component = document.querySelector<IdsDatePicker>('ids-date-picker')!;
        return component.popup?.visible;
      });

      expect(pickerHidden).toBeFalsy();
    });
  });

  test.describe('parser tests', () => {
    test('should parse dates in yyyy-MM-dd format', async ({ page }) => {
      const parseDate = await page.evaluate(() => {
        const component = document.querySelector<IdsDatePicker>('ids-date-picker')!;

        component.format = 'yyyy-MM-dd';
        const date = component.getDateValue('1990-04-21');

        return date;
      });

      expect(parseDate instanceof Date).toBeTruthy();
      expect(parseDate?.getMonth()).toEqual(3);
      expect(parseDate?.getFullYear()).toEqual(1990);
      expect(parseDate?.getDate()).toEqual(21);
    });

    test('should parse dates in dd.MM.yyyy format (German)', async ({ page }) => {
      const parseDate = await page.evaluate(() => {
        const component = document.querySelector<IdsDatePicker>('ids-date-picker')!;

        component.format = 'dd.MM.yyyy';
        const date = component.getDateValue('21.04.1990');

        return date;
      });

      expect(parseDate instanceof Date).toBeTruthy();
      expect(parseDate?.getMonth()).toEqual(3);
      expect(parseDate?.getFullYear()).toEqual(1990);
      expect(parseDate?.getDate()).toEqual(21);
    });

    test('should parse dates in dd/MM/yyyy format (Hebrew)', async ({ page }) => {
      const parseDate = await page.evaluate(() => {
        const component = document.querySelector<IdsDatePicker>('ids-date-picker')!;

        component.format = 'dd/MM/yyyy';
        const date = component.getDateValue('21/04/1990');

        return date;
      });

      expect(parseDate instanceof Date).toBeTruthy();
      expect(parseDate?.getMonth()).toEqual(3);
      expect(parseDate?.getFullYear()).toEqual(1990);
      expect(parseDate?.getDate()).toEqual(21);
    });
  });

  test.describe('validation tests', () => {
    test('should validate dates', async ({ page }) => {
      const checkValidation = async (value: string, format: string, expected: boolean) => {
        const isValid = await page.evaluate((args) => {
          let isValidEventValue;
          const component = document.querySelector<IdsDatePicker>('ids-date-picker')!;
          component.validate = 'date';
          component.format = args.format;
          component.value = args.value;
          component.input.addEventListener('validate', (e: any) => {
            isValidEventValue = e.detail.isValid;
          });
          component.input.checkValidation();
          return isValidEventValue;
        }, {
          value, format
        });

        expect(isValid).toEqual(expected);
      };
      const values = [{
        value: '2012-03-04',
        format: 'yyyy-MM-dd',
        expected: true
      }, {
        value: '201-03-04',
        format: 'yyyy-MM-dd',
        expected: false
      }, {
        value: '2012-40-04',
        format: 'yyyy-MM-dd',
        expected: false
      }, {
        value: '2012-03-50',
        format: 'yyyy-MM-dd',
        expected: false
      }, {
        value: '2012',
        format: 'yyyy',
        expected: true
      }, {
        value: '201',
        format: 'yyyy',
        expected: false
      }];

      values.forEach((v) => checkValidation(v.value, v.format, v.expected));
    });

    test('should validate unavailable dates', async ({ page }) => {
      const checkValidation = async (value: string, expected: boolean) => {
        const isValid = await page.evaluate((valueArg) => {
          let isValidEventValue;
          const component = document.querySelector<IdsDatePicker>('ids-date-picker')!;
          component.validate = 'availableDate';
          component.disableSettings = {
            dates: ['2/15/2010', '2/25/2010'],
            dayOfWeek: [0, 6]
          };
          component.format = 'M/d/yyyy';
          component.value = valueArg;
          component.input.addEventListener('validate', (e: any) => {
            isValidEventValue = e.detail.isValid;
          });
          component.input.checkValidation();
          return isValidEventValue;
        }, value);

        expect(isValid).toEqual(expected);
      };
      const values = [{
        value: '2/16/2010',
        expected: true
      }, {
        value: '2/15/2010',
        expected: false
      }];
      values.forEach((v) => checkValidation(v.value, v.expected));
    });
  });

  test.describe('date time picker tests', () => {
    test('should render time picker when format changes', async ({ page }) => {
      const format = 'M/d/yyyy hh:mm:ss a';
      const value = '2/3/2010 08:24:11 AM';
      const timePickerVisible = await page.evaluate((args) => {
        const component = document.querySelector<IdsDatePicker>('ids-date-picker')!;
        component.minuteInterval = 1;
        component.secondInterval = 1;
        component.format = args.format;
        component.value = args.value;
        component.popup!.value = args.value;

        const timePicker = component.popup?.container?.querySelector<IdsTimePickerPopup>('ids-time-picker-popup');

        return {
          hours: timePicker?.hours,
          minutes: timePicker?.minutes,
          seconds: timePicker?.seconds,
          period: timePicker?.period
        };
      }, {
        format,
        value
      });

      expect(timePickerVisible.hours).toEqual(8);
      expect(timePickerVisible.minutes).toEqual(24);
      expect(timePickerVisible.seconds).toEqual(11);
      expect(timePickerVisible.period).toEqual('AM');
    });
  });
});
