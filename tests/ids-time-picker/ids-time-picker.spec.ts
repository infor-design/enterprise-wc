import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
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
  });
});
