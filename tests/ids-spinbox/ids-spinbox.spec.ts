import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsSpinbox from '../../src/components/ids-spinbox/ids-spinbox';

test.describe('IdsSpinbox tests', () => {
  const url = '/ids-spinbox/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Spinbox Component');
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

  test.describe('functionality tests', () => {
    test('can remove max value and then can set value with no ceiling', async ({ page }) => {
      const locator = await page.locator('ids-spinbox').first();
      const handle = await page.$('ids-spinbox');
      await handle?.evaluate((el: IdsSpinbox) => {
        el.max = null;
        el.value = '10000';
      });
      await expect(await locator.getAttribute('value')).toEqual('10000');
    });

    test('can set the label placeholder', async ({ page }) => {
      const locator = await page.locator('ids-spinbox').first();
      const handle = await page.$('ids-spinbox');
      await handle?.evaluate((el: IdsSpinbox) => {
        el.placeholder = 'This is helpful';
        el.label = 'Heading 1';
      });
      await expect(await locator.getAttribute('placeholder')).toEqual('This is helpful');
      await expect(await locator.getAttribute('label')).toEqual('Heading 1');
    });

    test('can remove min value and then can set value with no floor', async ({ page }) => {
      const locator = await page.locator('ids-spinbox').first();
      const handle = await page.$('ids-spinbox');
      await handle?.evaluate((el: IdsSpinbox) => {
        el.min = null;
        el.value = '-10000';
      });
      await expect(await locator.getAttribute('value')).toEqual('-10000');
    });

    test('can update the min value to a high value', async ({ page }) => {
      const locator = await page.locator('ids-spinbox').first();
      const handle = await page.$('ids-spinbox');
      await handle?.evaluate((el: IdsSpinbox) => {
        el.min = -10000;
        el.value = '-10000';
      });
      await expect(await locator.getAttribute('value')).toEqual('-10000');
    });

    test('can updates max value to a high value', async ({ page }) => {
      const locator = await page.locator('ids-spinbox').first();
      const handle = await page.$('ids-spinbox');
      await handle?.evaluate((el: IdsSpinbox) => {
        el.min = 10000;
        el.value = '10000';
      });
      await expect(await locator.getAttribute('value')).toEqual('10000');
    });

    test('can increment and decrement with the buttons to a min', async ({ page }) => {
      const locator = await page.locator('ids-spinbox').first();
      const handle = await page.$('ids-spinbox');
      await handle?.evaluate((el: IdsSpinbox) => {
        el.min = 10000;
        el.value = '10000';
      });

      const decrement = await page.getByRole('spinbutton', { name: 'Basic Spinbox' }).getByLabel('-');
      const increment = await page.getByRole('spinbutton', { name: 'Basic Spinbox' }).getByLabel('+');

      await decrement.click();
      expect(await locator.getAttribute('value')).toEqual('10000');
      await increment.click();
      expect(await locator.getAttribute('value')).toEqual('10001');
    });

    test('can increment the value until max', async ({ page }) => {
      const locator = await page.locator('ids-spinbox').first();
      const handle = await page.$('ids-spinbox');
      await handle?.evaluate((el: IdsSpinbox) => {
        el.max = 5;
        el.value = '0';
      });

      const increment = await page.getByRole('spinbutton', { name: 'Basic Spinbox' }).getByLabel('+');
      await increment.click();
      await increment.click();
      await increment.click();
      await increment.click();
      await increment.click();
      expect(await increment.getAttribute('disabled')).toEqual('');
      expect(await locator.getAttribute('value')).toEqual('5');
    });

    test('can decrement the value until min', async ({ page }) => {
      const locator = await page.locator('ids-spinbox').nth(2);
      const increment = await locator.getByLabel('+');
      const decrement = await locator.getByLabel('-');
      await increment.click();
      await decrement.click();
      expect(await decrement.getAttribute('disabled')).toEqual('');
      expect(await locator.getAttribute('value')).toEqual('0');
    });

    test('can increment with the ArrowUp key', async ({ page }) => {
      const locator = await page.locator('ids-spinbox').first();
      await page.evaluate(() => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
        document.querySelector('ids-spinbox')?.dispatchEvent(event);
      });
      expect(await locator.getAttribute('value')).toEqual('1');
    });

    test('can decrement with the ArrowDown key', async ({ page }) => {
      const locator = await page.locator('ids-spinbox').first();
      await page.evaluate(() => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
        document.querySelector('ids-spinbox')?.dispatchEvent(event);
      });
      expect(await locator.getAttribute('value')).toEqual('-1');
    });

    test('can render a dirty indicator', async ({ page }) => {
      const locator = await page.locator('ids-spinbox').nth(1);
      const isDirty = await page.evaluate(() => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
        const field = document.querySelectorAll<IdsSpinbox>('ids-spinbox')[1];
        field.dispatchEvent(event);
        return field.isDirty;
      });
      expect(await locator.getAttribute('dirty-tracker')).toEqual('true');
      expect(isDirty).toEqual(true);
    });

    test('can toggle the disabled state', async ({ page }) => {
      const locator = await page.locator('ids-spinbox').first();
      await page.evaluate(() => {
        document.querySelector<IdsSpinbox>('ids-spinbox')!.disabled = true;
      });
      expect(await locator.getAttribute('disabled')).toEqual('true');
      await page.evaluate(() => {
        document.querySelector<IdsSpinbox>('ids-spinbox')!.disabled = false;
      });
      expect(await locator.getAttribute('disabled')).toBeNull();
    });

    test('can toggle the readonly state', async ({ page }) => {
      const locator = await page.locator('ids-spinbox').first();
      await page.evaluate(() => {
        document.querySelector<IdsSpinbox>('ids-spinbox')!.readonly = true;
      });
      expect(await locator.getAttribute('readonly')).toEqual('true');
      await page.evaluate(() => {
        document.querySelector<IdsSpinbox>('ids-spinbox')!.readonly = false;
      });
      expect(await locator.getAttribute('readonly')).toBeNull();
    });

    test('can increment steps out of step sequence', async ({ page }) => {
      const locator = await page.locator('ids-spinbox').nth(4);
      await page.evaluate(() => {
        const field = document.querySelectorAll<IdsSpinbox>('ids-spinbox')[4];
        field.value = '3';
      });
      const increment = await locator.getByLabel('+');
      await increment.click();
      expect(await locator.getAttribute('value')).toEqual('8');
    });
  });

  test.describe('snapshot tests', () => {
    test('should match innerHTML snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-spinbox');
      const html = await handle?.evaluate((el: IdsSpinbox) => el?.outerHTML);
      await expect(html).toMatchSnapshot('spinbox-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-spinbox');
      const html = await handle?.evaluate((el: IdsSpinbox) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('spinbox-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-spinbox-light');
    });
  });
});
