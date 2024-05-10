import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { Locator, expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsTriggerField from '../../src/components/ids-trigger-field/ids-trigger-field';

test.describe('IdsTriggerField tests', () => {
  const url = '/ids-trigger-field/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Trigger Field Component');
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
      const handle = await page.$('ids-trigger-field');
      const html = await handle?.evaluate((el: IdsTriggerField) => el?.outerHTML);
      await expect(html).toMatchSnapshot('trigger-field-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-trigger-field');
      const html = await handle?.evaluate((el: IdsTriggerField) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('trigger-field-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-trigger-field-light');
    });
  });

  test.describe('IdsTriggerField functionality tests', () => {
    let idsTriggerField: Locator;

    test.beforeEach(async ({ page }) => {
      idsTriggerField = await page.locator('#trigger-field-1');
    });

    test('can append early to DOM', async ({ page }) => {
      const errors: any[] = [];
      page.on('pageerror', (err) => errors.push(err.message));
      page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text); });
      await page.evaluate(() => {
        const elem = document.createElement('ids-trigger-field') as IdsTriggerField;
        document.querySelector('ids-container')!.appendChild(elem);
        elem.setAttribute('id', 'trigger-field-test');
        elem.size = 'sm';
        elem.tabbable = false;
        elem.label = 'Date Field';
      });
      await expect(page.locator('#trigger-field-test')).toBeAttached();
      expect(errors).toEqual([]);
    });

    test('can append late to DOM', async ({ page }) => {
      const errors: any[] = [];
      page.on('pageerror', (err) => errors.push(err.message));
      page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text); });
      await page.evaluate(() => {
        const elem = document.createElement('ids-trigger-field') as IdsTriggerField;
        elem.setAttribute('id', 'trigger-field-test');
        elem.size = 'sm';
        elem.tabbable = false;
        elem.label = 'Date Field';
        document.querySelector('ids-container')!.appendChild(elem);
      });
      await expect(page.locator('#trigger-field-test')).toBeAttached();
      expect(errors).toEqual([]);
    });

    test('can get buttons of the trigger field', async () => {
      expect(await idsTriggerField.evaluate((element: IdsTriggerField) => element.buttons)).toBeTruthy();
    });

    test('can set/get tabbable', async () => {
      const testData = [
        { data: true, expected: true },
        { data: 'false', expected: false },
        { data: '', expected: true },
        { data: null, expected: false }
      ];

      expect(await idsTriggerField.evaluate((element: IdsTriggerField) => element.tabbable)).toBeFalsy();
      await expect(idsTriggerField).not.toHaveAttribute('tabbable');

      for (const data of testData) {
        expect(await idsTriggerField.evaluate((element: IdsTriggerField, tData) => {
          element.tabbable = tData as any;
          return element.tabbable;
        }, data.data)).toEqual(data.expected);
        if (data.expected) {
          await expect(idsTriggerField).toHaveAttribute('tabbable');
        } else {
          await expect(idsTriggerField).not.toHaveAttribute('tabbable');
        }
      }
    });

    test('can set/get disabled', async () => {
      const testData = [
        { data: true, expected: true },
        { data: 'false', expected: false },
        { data: '', expected: true },
        { data: null, expected: false }
      ];
      const checkButtonsDisabled = async (parent: Locator, isDisabled: boolean = true) => {
        for (const button of await parent.locator('ids-trigger-button').all()) {
          if (isDisabled) {
            await expect(button).toHaveAttribute('disabled');
          } else {
            await expect(button).not.toHaveAttribute('disabled');
          }
        }
      };

      expect(await idsTriggerField.evaluate((element: IdsTriggerField) => element.disabled)).toBeFalsy();
      await expect(idsTriggerField).not.toHaveAttribute('disabled');
      await checkButtonsDisabled(idsTriggerField, false);

      for (const data of testData) {
        expect(await idsTriggerField.evaluate((element: IdsTriggerField, tData) => {
          element.disabled = tData as any;
          return element.disabled;
        }, data.data)).toEqual(data.expected);
        if (data.expected) {
          await expect(idsTriggerField).toHaveAttribute('disabled');
        } else {
          await expect(idsTriggerField).not.toHaveAttribute('disabled');
        }
        await checkButtonsDisabled(idsTriggerField, data.expected);
      }
    });

    test('can set/get readonly', async () => {
      const testData = [
        { data: true, expected: true },
        { data: 'false', expected: false },
        { data: '', expected: true },
        { data: null, expected: false }
      ];

      const checkButtonsReadOnly = async (parent: Locator, isReadonly: boolean = true) => {
        for (const button of await parent.locator('ids-trigger-button').all()) {
          if (isReadonly) {
            await expect(button).toHaveAttribute('readonly');
          } else {
            await expect(button).not.toHaveAttribute('readonly');
          }
        }
      };

      expect(await idsTriggerField.evaluate((element: IdsTriggerField) => element.readonly)).toBeFalsy();
      await expect(idsTriggerField).not.toHaveAttribute('readonly');
      await checkButtonsReadOnly(idsTriggerField, false);

      for (const data of testData) {
        expect(await idsTriggerField.evaluate((element: IdsTriggerField, tData) => {
          element.readonly = tData as any;
          return element.readonly;
        }, data.data)).toEqual(data.expected);
        if (data.expected) {
          await expect(idsTriggerField).toHaveAttribute('readonly');
        } else {
          await expect(idsTriggerField).not.toHaveAttribute('readonly');
        }
        await checkButtonsReadOnly(idsTriggerField, data.expected);
      }
    });

    test('can set/get ids', async ({ page }) => {
      const defId = 'trigger-field-1';
      const newId = 'the-new-id';
      const suffix = '-internal';
      let idsTrigger = await page.locator(`#${defId}`);

      await expect(idsTrigger).toBeAttached();
      await expect(idsTrigger.locator('label').first()).toHaveAttribute('for', `${defId}${suffix}`);
      await expect(idsTrigger.locator('input').first()).toHaveAttribute('id', `${defId}${suffix}`);

      await idsTrigger.evaluate((element: IdsTriggerField, arg) => { element.id = arg; }, newId);
      idsTrigger = await page.locator(`#${newId}`);
      await expect(idsTrigger.locator('label').first()).toHaveAttribute('for', `${newId}${suffix}`);
      await expect(idsTrigger.locator('input').first()).toHaveAttribute('id', `${newId}${suffix}`);
    });

    test('can set/get format', async () => {

    });
  });
});
