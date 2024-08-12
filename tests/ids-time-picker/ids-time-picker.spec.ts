import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect, Locator } from '@playwright/test';
import { test } from '../base-fixture';
import IdsTimePicker from '../../src/components/ids-time-picker/ids-time-picker';

test.describe('IdsTimePicker tests', () => {
  const url = '/ids-time-picker/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Time Picker Component');
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
    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-time-picker-light');
    });
  });

  test.describe('event tests', () => {
    test('should fire change event', async ({ page }) => {
      const eventFiredCount = await page.evaluate(() => {
        let changeCount = 0;
        const timePicker = document.querySelector('ids-time-picker') as IdsTimePicker;
        timePicker.addEventListener('change', () => { changeCount++; });
        timePicker.value = '3:15 PM';
        return changeCount;
      });

      expect(eventFiredCount).toEqual(1);
    });

    test('should fire input event', async ({ page }) => {
      const eventFiredCount = await page.evaluate(() => {
        let changeCount = 0;
        const timePicker = document.querySelector('ids-time-picker') as IdsTimePicker;
        timePicker.addEventListener('input', () => { changeCount++; });
        timePicker.value = '3:15 PM';
        return changeCount;
      });

      expect(eventFiredCount).toEqual(1);
    });
  });

  test.describe('functionality tests', () => {
    const isPopupVisible = async (timepicker: Locator) => {
      const result = await timepicker.evaluate((node: IdsTimePicker) => node.picker!.popup!.visible);
      return result;
    };

    test('can render via document.createElement', async ({ page, pageErrorsTest }) => {
      await page.evaluate(() => {
        const time = document.createElement('ids-time-picker');
        time.id = 'test-time';
        document.querySelector('ids-container')!.appendChild(time);
      });
      await expect(page.locator('#test-time').first()).toBeAttached();
      expect(pageErrorsTest.hasErrors()).toBeFalsy();
    });

    test('can render placeholder', async ({ page }) => {
      const timepicker = await page.locator('#timepicker-default').first();
      const input = await timepicker.locator('#timepicker-default-internal');

      expect(await timepicker.evaluate((element: IdsTimePicker) => element.placeholder)).toEqual('Default');
      await expect(timepicker).toHaveAttribute('placeholder', 'Default');
      await expect(input).toHaveAttribute('placeholder', 'Default');

      expect(await timepicker.evaluate((element: IdsTimePicker) => {
        element.placeholder = 'A Placeholder';
        return element.placeholder;
      })).toEqual('A Placeholder');
      await expect(timepicker).toHaveAttribute('placeholder', 'A Placeholder');
      await expect(input).toHaveAttribute('placeholder', 'A Placeholder');

      expect(await timepicker.evaluate((element: IdsTimePicker) => {
        element.placeholder = null as any;
        return element.placeholder;
      })).toEqual('');
      await expect(timepicker).not.toHaveAttribute('placeholder');
      await expect(input).not.toHaveAttribute('placeholder');
    });

    test('can render label', async ({ page }) => {
      const timepicker = await page.locator('#timepicker-default').first();
      const label = await timepicker.locator('ids-text[part="label"]').first();

      expect(await timepicker.evaluate((element: IdsTimePicker) => element.label)).toEqual('Time Picker - default');
      await expect(label).toHaveText('Time Picker - default');

      expect(await timepicker.evaluate((element: IdsTimePicker) => {
        element.label = 'A Label';
        return element.label;
      })).toEqual('A Label');
      await expect(label).toHaveText('A Label');

      expect(await timepicker.evaluate((element: IdsTimePicker) => {
        element.label = null as any;
        return element.label;
      })).toEqual('');
      await expect(label).not.toHaveText('Time Picker - default');
      await expect(label).not.toHaveText('A Label');
    });

    test('can render 12 hours format', async ({ page }) => {
      const timepicker = page.locator('#timepicker-default').first();

      expect(await timepicker.evaluate((element: IdsTimePicker) => {
        element.format = 'hh:mm';
        element.autoupdate = true;
        element.hours = 12;
        element.minutes = 0;
        return element.value;
      })).toEqual('12:00');
    });

    test('can render 24 hours format', async ({ page }) => {
      const timepicker = page.locator('#timepicker-default').first();

      expect(await timepicker.evaluate((element: IdsTimePicker) => {
        element.format = 'HH:mm';
        element.autoupdate = true;
        element.hours = 23;
        element.minutes = 0;
        return element.value;
      })).toEqual('23:00');

      expect(await timepicker.evaluate((element: IdsTimePicker) => {
        element.hours = 11;
        element.minutes = 30;
        return element.value;
      })).toEqual('11:30');
    });

    test('can render minutes', async ({ page }) => {
      const timepicker = page.locator('#timepicker-default').first();

      expect(await timepicker.evaluate((element: IdsTimePicker) => {
        element.setAttribute('format', 'hh:mm');
        element.autoupdate = true;
        element.hours = 10;
        element.minutes = 35;
        return element.value;
      })).toEqual('10:35');

      expect(await timepicker.evaluate((element: IdsTimePicker) => {
        element.hours = 9;
        element.minutes = 5;
        return element.value;
      })).toEqual('09:05');
    });

    test('can support locale time format', async ({ page }) => {
      const timepicker = page.locator('#timepicker-default').first();

      expect(await timepicker.evaluate((element: IdsTimePicker) => element.format)).toEqual('h:mm a');

      await page.evaluate(async () => { await ((window as any).IdsGlobal as any).locale.setLocale('es-419'); });
      expect(await timepicker.evaluate((element: IdsTimePicker) => element.format)).toEqual('HH:mm');
    });

    test('can render seconds', async ({ page }) => {
      const timepicker = page.locator('#timepicker-default').first();

      expect(await timepicker.evaluate((element: IdsTimePicker) => {
        element.setAttribute('format', 'hh:mm:ss');
        element.autoupdate = true;
        element.hours = 10;
        element.minutes = 10;
        element.seconds = 35;
        return element.value;
      })).toEqual('10:10:35');

      expect(await timepicker.evaluate((element: IdsTimePicker) => {
        element.seconds = 5;
        return element.value;
      })).toEqual('10:10:05');

      expect(await timepicker.evaluate((element: IdsTimePicker) => {
        element.seconds = 0;
        return element.value;
      })).toEqual('10:10:00');
    });

    test('can not render seconds', async ({ page }) => {
      const timepicker = page.locator('#timepicker-default').first();

      expect(await timepicker.evaluate((element: IdsTimePicker) => {
        element.setAttribute('format', 'hh:mm');
        element.autoupdate = true;
        element.hours = 10;
        element.minutes = 10;
        element.seconds = 35;
        return element.value;
      })).toEqual('10:10');

      expect(await timepicker.evaluate((element: IdsTimePicker) => {
        element.seconds = 5;
        return element.value;
      })).toEqual('10:10');

      expect(await timepicker.evaluate((element: IdsTimePicker) => {
        element.seconds = 0;
        return element.value;
      })).toEqual('10:10');
    });

    test('can set 12 am/pm', async ({ page }) => {
      const timepicker = page.locator('#timepicker-default').first();

      expect(await timepicker.evaluate((element: IdsTimePicker) => {
        element.useCurrentTime = false;
        element.autoupdate = true;
        element.hours = 12;
        element.minutes = 0;
        element.period = 'AM';
        return element.value;
      })).toEqual('12:00 AM');

      expect(await timepicker.evaluate((element: IdsTimePicker) => {
        element.period = 'PM';
        return element.value;
      })).toEqual('12:00 PM');

      expect(await timepicker.evaluate((element: IdsTimePicker) => {
        element.hours = null;
        return element.value;
      })).toEqual('1:00 PM');

      expect(await timepicker.evaluate((element: IdsTimePicker) => {
        element.minutes = null;
        element.seconds = null;
        return element.value;
      })).toEqual('1:00 PM');
    });

    test('can parse input value', async ({ page }) => {
      const timepicker = page.locator('#timepicker-default').first();

      expect(await timepicker.evaluate((element: IdsTimePicker) => {
        element.useCurrentTime = false;
        element.minuteInterval = 1;
        element.secondInterval = 1;
        element.value = '12:22 AM';
        const result = { hours: element.hours, minutes: element.minutes, period: element.period };
        return result;
      })).toEqual({ hours: 12, minutes: 22, period: 'AM' });

      expect(await timepicker.evaluate((element: IdsTimePicker) => {
        element.value = '12:22 PM';
        const result = { hours: element.hours, minutes: element.minutes, period: element.period };
        return result;
      })).toEqual({ hours: 12, minutes: 22, period: 'PM' });

      expect(await timepicker.evaluate((element: IdsTimePicker) => {
        element.value = '1:59 AM';
        const result = { hours: element.hours, minutes: element.minutes, period: element.period };
        return result;
      })).toEqual({ hours: 1, minutes: 59, period: 'AM' });

      expect(await timepicker.evaluate((element: IdsTimePicker) => {
        element.value = '';
        const result = { hours: element.hours, minutes: element.minutes, period: element.period };
        return result;
      })).toEqual({ hours: 1, minutes: 0, period: 'AM' });

      // with seconds
      expect(await timepicker.evaluate((element: IdsTimePicker) => {
        element.format = 'HH:mm:ss';
        element.value = '23:12:18';
        const result = { hours: element.hours, minutes: element.minutes, seconds: element.seconds };
        return result;
      })).toEqual({ hours: 23, minutes: 12, seconds: 18 });

      expect(await timepicker.evaluate((element: IdsTimePicker) => {
        element.value = '00:00:00';
        const result = { hours: element.hours, minutes: element.minutes, seconds: element.seconds };
        return result;
      })).toEqual({ hours: 0, minutes: 0, seconds: 0 });

      expect(await timepicker.evaluate((element: IdsTimePicker) => {
        element.value = '12:00:00';
        const result = { hours: element.hours, minutes: element.minutes, seconds: element.seconds };
        return result;
      })).toEqual({ hours: 12, minutes: 0, seconds: 0 });
    });

    test('can return current time', async ({ page }) => {
      const timepicker = page.locator('#timepicker-default').first();

      const getPageTime = async () => {
        const ret = await page.evaluate(() => {
          const dt = new Date();
          const result = {
            hours: dt.getHours(),
            minutes: dt.getMinutes(),
            seconds: dt.getSeconds()
          };
          return result;
        });
        return ret;
      };

      // might fail when 1st time is 1 second earlier, hence inside the expect.toPass() to retry for another time
      await expect(async () => {
        expect(await timepicker.evaluate((element: IdsTimePicker) => {
          element.format = 'HH:mm:ss';
          element.minuteInterval = 1;
          element.secondInterval = 1;
          element.useCurrentTime = true;
          element.value = '';
          const result = { hours: element.hours, minutes: element.minutes, seconds: element.seconds };
          return result;
        })).toEqual(await getPageTime());
      }).toPass();
    });

    test('can prevent render of period (AM/PM)', async ({ page }) => {
      const timepicker = page.locator('#timepicker-default').first();

      expect(await timepicker.evaluate((element: IdsTimePicker) => {
        element.format = 'hh:mm';
        element.autoupdate = true;

        element.hours = '10';
        element.minutes = '00';
        element.period = 'AM';
        return element.value;
      })).toEqual('10:00');

      expect(await timepicker.evaluate((element: IdsTimePicker) => {
        element.period = 'PM';
        return element.value;
      })).toEqual('10:00');
    });

    test('can show and hide popup', async ({ page }) => {
      const timepicker = page.locator('#timepicker-default').first();

      expect(await isPopupVisible(timepicker)).toBeFalsy();

      await timepicker.evaluate((element: IdsTimePicker) => element.open());
      expect(await isPopupVisible(timepicker)).toBeTruthy();

      await timepicker.evaluate((element: IdsTimePicker) => element.close());
      expect(await isPopupVisible(timepicker)).toBeFalsy();
    });

    test('can show popup on autoselect in input', async ({ page }) => {
      const timepicker = page.locator('#timepicker-default').first();
      const input = timepicker.locator('input').first();

      await input.click({ delay: 50 });
      expect(await timepicker.evaluate((element: IdsTimePicker) => element.autoselect)).toBeFalsy();
      expect(await isPopupVisible(timepicker)).toBeFalsy();

      expect(await timepicker.evaluate((element: IdsTimePicker) => {
        element.autoselect = true;
        return element.autoselect;
      })).toBeTruthy();
      await page.locator('html body').click({ delay: 50 });
      await input.click({ delay: 50 });
      expect(await isPopupVisible(timepicker)).toBeTruthy();

      expect(await timepicker.evaluate((element: IdsTimePicker) => {
        element.autoselect = false;
        return element.autoselect;
      })).toBeFalsy();
      await page.locator('html body').click({ delay: 50 });
      await input.click({ delay: 50 });
      expect(await isPopupVisible(timepicker)).toBeFalsy();
    });

    test('can show and hide popup on clicking the trigger button', async ({ page }) => {
      const timepicker = await page.locator('#timepicker-default').first();
      const button = await timepicker.locator('ids-trigger-button').first();

      expect(await isPopupVisible(timepicker)).toBeFalsy();

      await button.click({ delay: 50 });
      expect(await isPopupVisible(timepicker)).toBeTruthy();

      await button.click({ delay: 50 });
      expect(await isPopupVisible(timepicker)).toBeFalsy();
    });

    test('can show popup with arrow down key', async ({ page }) => {
      const timepicker = await page.locator('#timepicker-default').first();
      const input = await timepicker.locator('input').first();

      await input.click({ delay: 50 });
      expect(await isPopupVisible(timepicker)).toBeFalsy();

      await input.press('ArrowDown', { delay: 50 });
      expect(await isPopupVisible(timepicker)).toBeTruthy();
    });

    test('can hide popup with escape key', async ({ page }) => {
      const timepicker = await page.locator('#timepicker-default').first();
      const button = await timepicker.locator('ids-trigger-button').first();

      expect(await isPopupVisible(timepicker)).toBeFalsy();

      await button.click({ delay: 50 });
      expect(await isPopupVisible(timepicker)).toBeTruthy();

      await timepicker.press('Escape', { delay: 50 });
      expect(await isPopupVisible(timepicker)).toBeFalsy();
    });

    test('can hide popup with backspace key', async ({ page }) => {
      const timepicker = await page.locator('#timepicker-default').first();
      const button = await timepicker.locator('ids-trigger-button').first();

      expect(await isPopupVisible(timepicker)).toBeFalsy();

      await button.click({ delay: 50 });
      expect(await isPopupVisible(timepicker)).toBeTruthy();

      await timepicker.press('Backspace', { delay: 50 });
      expect(await isPopupVisible(timepicker)).toBeFalsy();
    });

    test('can set ID', async ({ page, pageErrorsTest }) => {
      let timepicker = await page.locator('#timepicker-default').first();

      await timepicker.evaluate((node) => { node.id = 'new-test-id'; });
      timepicker = await page.locator('#new-test-id').first();
      await expect(timepicker).toBeAttached();
      expect(pageErrorsTest.hasErrors()).toBeFalsy();
    });

    test('can be disabled', async ({ page }) => {
      const timepicker = await page.locator('#timepicker-default').first();

      expect(await timepicker.evaluate((element: IdsTimePicker) => element.disabled)).toBeFalsy();
      await expect(timepicker).not.toHaveAttribute('disabled');

      expect(await timepicker.evaluate((element: IdsTimePicker) => {
        element.setAttribute('disabled', 'true');
        return element.disabled;
      })).toBeTruthy();
      await expect(timepicker).toHaveAttribute('disabled');

      expect(await timepicker.evaluate((element: IdsTimePicker) => {
        element.disabled = false;
        return element.disabled;
      })).toBeFalsy();
      await expect(timepicker).not.toHaveAttribute('disabled');
    });

    test('can be readonly', async ({ page }) => {
      const timepicker = await page.locator('#timepicker-default').first();

      expect(await timepicker.evaluate((element: IdsTimePicker) => element.readonly)).toBeFalsy();
      await expect(timepicker).not.toHaveAttribute('readonly');

      expect(await timepicker.evaluate((element: IdsTimePicker) => {
        element.setAttribute('readonly', 'true');
        return element.readonly;
      })).toBeTruthy();
      await expect(timepicker).toHaveAttribute('readonly');

      expect(await timepicker.evaluate((element: IdsTimePicker) => {
        element.readonly = false;
        return element.readonly;
      })).toBeFalsy();
      await expect(timepicker).not.toHaveAttribute('readonly');
    });

    test('can hide on outside click', async ({ page }) => {
      const timepicker = await page.locator('#timepicker-default').first();

      expect(await isPopupVisible(timepicker)).toBeFalsy();
      await timepicker.evaluate((element: IdsTimePicker) => element.open());
      expect(await isPopupVisible(timepicker)).toBeTruthy();

      await page.locator('html body').click({ delay: 50 });
      expect(await isPopupVisible(timepicker)).toBeFalsy();
    });

    test('can be embeddable', async ({ page }) => {
      const result = await page.evaluate(() => {
        const html = '<ids-time-picker id="embeddable" embeddable="true"></ids-time-picker>';
        document.querySelector('ids-container')!.insertAdjacentHTML('afterbegin', html);
        const tp = document.querySelector('#embeddable') as IdsTimePicker;
        return { input: tp.input, picker: tp.picker };
      });
      expect(result).toEqual({ input: null, picker: null });
      await expect(page.locator('#embeddable')).toBeAttached();
    });

    test('can set/get tabbable', async ({ page }) => {
      const timepicker = await page.locator('#timepicker-default').first();

      expect(await timepicker.evaluate((element: IdsTimePicker) => element.tabbable)).toBeTruthy();

      expect(await timepicker.evaluate((element: IdsTimePicker) => {
        element.tabbable = false;
        return element.tabbable;
      })).toBeFalsy();
      await expect(timepicker).toHaveAttribute('tabbable', 'false');

      expect(await timepicker.evaluate((element: IdsTimePicker) => {
        element.tabbable = true;
        return element.tabbable;
      })).toBeTruthy();
      await expect(timepicker).toHaveAttribute('tabbable', 'true');
    });

    test('can validate required', async ({ page, eventsTest }) => {
      const timepicker = await page.locator('#timepicker-default').first();
      const input = await timepicker.locator('ids-trigger-field').first();

      await eventsTest.onEvent('input', 'validate', input);
      expect(await timepicker.evaluate((element: IdsTimePicker) => element.validate)).toBeNull();

      expect(await timepicker.evaluate((element: IdsTimePicker) => {
        element.validate = 'required';
        element.validationEvents = 'blur';
        element.input!.checkValidation();
        return { validate: element.validate, validationEvents: element.validationEvents };
      })).toEqual({ validate: 'required', validationEvents: 'blur' });
      await expect(timepicker).toHaveAttribute('validate', 'required');
      await expect(timepicker).toHaveAttribute('validation-events', 'blur');
      expect(await eventsTest.isEventTriggered('input', 'validate')).toBeTruthy();

      expect(await timepicker.evaluate((element: IdsTimePicker) => {
        element.validate = null;
        element.validationEvents = null;
        return { validate: element.validate, validationEvents: element.validationEvents };
      })).toEqual({ validate: null, validationEvents: 'change blur' });
    });

    test('can validate time', async ({ page }) => {
      const timepicker = await page.locator('#timepicker-default').first();

      expect(await timepicker.evaluate((element: IdsTimePicker) => {
        element.value = '1:00 AM';
        element.validate = 'time';
        (window as any).isValid = false;
        element.input!.addEventListener('validate', (e: any) => {
          (window as any).isValid = e.detail.isValid;
        });
        element.input!.checkValidation();
        return (window as any).isValid;
      })).toBeTruthy();

      expect(await timepicker.evaluate((element: IdsTimePicker) => {
        element.value = '99:00 AM';
        return (window as any).isValid;
      })).toBeFalsy();
    });

    test('can set/get field height', async ({ page }) => {
      const timepicker = await page.locator('#timepicker-default').first();
      const container = await timepicker.locator('div[part="container"]').first();
      const testData = [
        { data: 'xs', expected: 'xs' },
        { data: 'sm', expected: 'sm' },
        { data: 'md', expected: 'md' },
        { data: '', expected: 'md' },
        { data: 'lg', expected: 'lg' },
        { data: null, expected: 'md' }
      ];

      for (const data of testData) {
        expect(await timepicker.evaluate((element: IdsTimePicker, tData) => {
          element.fieldHeight = tData as any;
          return element.fieldHeight;
        }, data.data)).toEqual(data.expected);
        if (data.data) {
          await expect(timepicker).toHaveAttribute('field-height', data.expected);
          await expect(container).toHaveClass(new RegExp(`field-height-${data.expected}`, 'g'));
          const validData = testData.filter((item) => item.data !== data.data && item.data);
          for (let i = 0; i < validData.length; i++) {
            await expect(container).not.toHaveClass(new RegExp(`field-height-${validData[i].expected}`, 'g'));
          }
        } else {
          await expect(timepicker).not.toHaveAttribute('field-height');
          await expect(container).toHaveClass(/field-height-md/);
        }
      }
    });

    test('can set/get compact', async ({ page }) => {
      const timepicker = await page.locator('#timepicker-default').first();
      const container = await timepicker.locator('div[part="container"]').first();

      expect(await timepicker.evaluate((element: IdsTimePicker) => element.compact)).toBeFalsy();
      await expect(timepicker).not.toHaveAttribute('compact');
      await expect(container).not.toHaveClass(/compact/);

      expect(await timepicker.evaluate((element: IdsTimePicker) => {
        element.compact = true;
        return element.compact;
      })).toBeTruthy();
      await expect(timepicker).toHaveAttribute('compact');
      await expect(container).toHaveClass(/compact/);
    });

    test('can set/get size', async ({ page }) => {
      const timepicker = await page.locator('#timepicker-default').first();
      const container = await timepicker.locator('div[part="container"]').first();
      const input = await timepicker.locator('ids-trigger-field').first();
      const testData = [
        { data: 'xs', expected: 'xs' },
        { data: 'sm', expected: 'sm' },
        { data: 'mm', expected: 'mm' },
        { data: 'md', expected: 'md' },
        { data: 'lg', expected: 'lg' },
        { data: null, expected: 'sm' },
        { data: 'full', expected: 'full' }
      ];

      for (const data of testData) {
        expect(await timepicker.evaluate((element: IdsTimePicker, tData) => {
          element.size = tData as any;
          return element.size;
        }, data.data)).toEqual(data.expected);
        if (data.data) {
          await expect(timepicker).toHaveAttribute('size', data.expected);
          await expect(input).toHaveAttribute('size', data.expected);
          await expect(container).toHaveClass(new RegExp(data.expected, 'g'));
        } else {
          await expect(timepicker).not.toHaveAttribute('size', data.expected);
        }
      }
    });

    test('can set/get margins', async ({ page }) => {
      const timepicker = await page.locator('#timepicker-default').first();
      const input = await timepicker.locator('ids-trigger-field').first();

      expect(await timepicker.evaluate((element: IdsTimePicker) => element.noMargins)).toBeFalsy();
      await expect(timepicker).not.toHaveAttribute('no-margins');
      await expect(input).not.toHaveAttribute('no-margins');

      expect(await timepicker.evaluate((element: IdsTimePicker) => {
        element.noMargins = true;
        return element.noMargins;
      })).toBeTruthy();
      await expect(timepicker).toHaveAttribute('no-margins');
      await expect(input).toHaveAttribute('no-margins');
    });

    test('can set values via template', async ({ page, pageErrorsTest }) => {
      await page.evaluate(() => {
        const html = `<ids-time-picker
          id="test-time"
          color-variant="alternate-formatter"
          label-state="collapsed"
          compact
          no-margins></ids-time-picker>`;
        const template = document.createElement('template');
        template.innerHTML = html;
        document.querySelector('ids-container')!.appendChild(template.content.childNodes[0]);
      });
      expect(pageErrorsTest.hasErrors()).toBeFalsy();
      await expect(page.locator('#test-time').first()).toBeAttached();
      expect(await page.locator('#test-time').first().evaluate((element: IdsTimePicker) => {
        const res = {
          colorVariant: element.colorVariant,
          labelState: element.labelState,
          compact: element.compact,
          noMargins: element.noMargins
        };
        return res;
      })).toEqual({
        colorVariant: 'alternate-formatter',
        labelState: 'collapsed',
        compact: true,
        noMargins: true
      });
    });

    test('can set/get dirty tracking', async ({ page }) => {
      const timepicker = await page.locator('#timepicker-default').first();
      const input = await timepicker.locator('ids-trigger-field').first();

      expect(await timepicker.evaluate((element: IdsTimePicker) => element.dirtyTracker)).toBeFalsy();
      await expect(timepicker).not.toHaveAttribute('dirty-tracker');
      await expect(input).not.toHaveAttribute('dirty-tracker');

      expect(await timepicker.evaluate((element: IdsTimePicker) => {
        element.dirtyTracker = true;
        return element.dirtyTracker;
      })).toBeTruthy();
      await expect(timepicker).toHaveAttribute('dirty-tracker');
      await expect(input).toHaveAttribute('dirty-tracker');

      expect(await timepicker.evaluate((element: IdsTimePicker) => {
        element.dirtyTracker = false;
        return element.dirtyTracker;
      })).toBeFalsy();
      await expect(timepicker).not.toHaveAttribute('dirty-tracker');
      await expect(input).not.toHaveAttribute('dirty-tracker');
    });

    test('can set/get mask', async ({ page }) => {
      const timepicker = await page.locator('#timepicker-default').first();
      const input = await timepicker.locator('ids-trigger-field').first();

      expect(await timepicker.evaluate((element: IdsTimePicker) => element.mask)).toBeFalsy();
      await expect(timepicker).not.toHaveAttribute('mask');
      await expect(input).not.toHaveAttribute('mask');

      expect(await timepicker.evaluate((element: IdsTimePicker) => {
        element.mask = true;
        return element.mask;
      })).toBeTruthy();
      await expect(timepicker).toHaveAttribute('mask');
      await expect(input).toHaveAttribute('mask', 'date');

      expect(await timepicker.evaluate((element: IdsTimePicker) => {
        element.format = 'HH:mm:ss';
        element.mask = null;
        return { format: element.input!.maskOptions.format, mask: element.mask };
      })).toEqual({ format: 'HH:mm:ss', mask: false });
    });

    test('can select time from time picker dropdown', async ({ page }) => {
      const timepicker = await page.locator('#timepicker-default').first();
      const button = await timepicker.locator('ids-trigger-button').first();
      const trigH = await timepicker.locator('#triggerBtn-hours').first();
      const sixthH = await timepicker.locator('#timepicker-hours-6').first();
      const trigM = await timepicker.locator('#triggerBtn-minutes').first();
      const forthM = await timepicker.locator('#timepicker-minutes-40').first();
      const trigP = await timepicker.locator('#triggerBtn-period').first();
      const pm = await timepicker.locator('#timepicker-period-PM').first();
      const set = await timepicker.locator('ids-modal-button').first();

      expect(await timepicker.evaluate((element: IdsTimePicker) => element.value)).toEqual('');
      await button.click({ delay: 50 });
      await trigH.click({ delay: 50 });
      await sixthH.click({ delay: 50 });
      await trigM.click({ delay: 50 });
      await forthM.click({ delay: 50 });
      await trigP.click({ delay: 50 });
      await pm.click({ delay: 50 });
      await set.click({ delay: 50 });
      expect(await timepicker.evaluate((element: IdsTimePicker) => element.value)).toEqual('6:40 PM');
    });

    test('can change value of dropdown on change', async ({ page }) => {
      const timepicker = await page.locator('#timepicker-default').first();
      const input = await timepicker.locator('input').first();
      const button = await timepicker.locator('ids-trigger-button').first();
      const hours = await timepicker.locator('#triggerField-hours input').first();
      const minutes = await timepicker.locator('#triggerField-minutes input').first();
      const period = await timepicker.locator('#triggerField-period input').first();

      await input.pressSequentially('6:40 PM');
      await button.click({ delay: 50 });
      await expect(hours).toHaveValue('6');
      await expect(minutes).toHaveValue('40');
      await expect(period).toHaveValue('PM');
    });
  });
});
