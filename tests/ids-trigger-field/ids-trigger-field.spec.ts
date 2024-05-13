import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { Locator, expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsTriggerField from '../../src/components/ids-trigger-field/ids-trigger-field';
import IdsTriggerButton from '../../src/components/ids-trigger-field/ids-trigger-button';

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
      const testData = [
        { data: 'MM/DD/YYYY', expected: 'MM/DD/YYYY' },
        { data: null, expected: null },
        { data: 'dd.mm.yyyy', expected: 'dd.mm.yyyy' },
        { data: '', expected: null }
      ];

      expect(await idsTriggerField.evaluate((element: IdsTriggerField) => element.format)).toBeNull();
      await expect(idsTriggerField).not.toHaveAttribute('format');

      for (const data of testData) {
        expect(await idsTriggerField.evaluate((element: IdsTriggerField, tData) => {
          element.format = tData;
          return element.format;
        }, data.data)).toEqual(data.expected);
        if (data.expected) {
          await expect(idsTriggerField).toHaveAttribute('format', data.expected);
        } else {
          await expect(idsTriggerField).not.toHaveAttribute('format');
        }
      }
    });

    test('can set/get noMargins attribute', async () => {
      const testData = [
        { data: true, expected: true },
        { data: 'false', expected: false },
        { data: '', expected: true },
        { data: null, expected: false }
      ];

      expect(await idsTriggerField.evaluate((element: IdsTriggerField) => element.noMargins)).toBeFalsy();
      await expect(idsTriggerField).not.toHaveAttribute('no-margins');

      for (const data of testData) {
        expect(await idsTriggerField.evaluate((element: IdsTriggerField, tData) => {
          element.noMargins = tData as any;
          return element.noMargins;
        }, data.data)).toEqual(data.expected);
        if (data.expected) {
          await expect(idsTriggerField).toHaveAttribute('no-margins');
        } else {
          await expect(idsTriggerField).not.toHaveAttribute('no-margins');
        }
      }
    });

    test('can fire triggerclicked event', async () => {
      const button = await idsTriggerField.locator('ids-trigger-button').first();
      await idsTriggerField.evaluate((element) => {
        (window as any).isEventTriggered = false;
        element.addEventListener('triggerclicked', () => {
          (window as any).isEventTriggered = true;
        });
      });
      await expect(button).toBeAttached();
      await button.dispatchEvent('click');
      expect(await idsTriggerField.evaluate(() => (window as any).isEventTriggered)).toBeTruthy();
    });

    test('can fire beforetriggerclicked event', async () => {
      const eventFireSequence = ['beforetriggerclicked', 'triggerclicked'];
      const button = await idsTriggerField.locator('ids-trigger-button').first();
      await idsTriggerField.evaluate((element) => {
        (window as any).eventSequence = [];
        element.addEventListener('beforetriggerclicked', () => {
          (window as any).eventSequence.push('beforetriggerclicked');
        });
        element.addEventListener('triggerclicked', () => {
          (window as any).eventSequence.push('triggerclicked');
        });
      });
      await expect(button).toBeAttached();
      await button.dispatchEvent('click');
      expect(await idsTriggerField.evaluate(() => (window as any).eventSequence)).toStrictEqual(eventFireSequence);
    });

    test('can adjust button field height on change', async () => {
      const button = await idsTriggerField.locator('ids-trigger-button').first();
      const testData = ['compact', '', '30px', null];

      await expect(button).not.toHaveAttribute('compact');
      await expect(button).not.toHaveAttribute('field-height');

      for (const data of testData) {
        await idsTriggerField.evaluate((
          element: IdsTriggerField,
          tData
        ) => { element.onFieldHeightChange(tData as any); }, data);
        if (data === 'compact') {
          await expect(button).toHaveAttribute('compact');
        } else if (data) {
          await expect(button).toHaveAttribute('field-height', data);
        } else {
          await expect(button).not.toHaveAttribute('compact');
          await expect(button).not.toHaveAttribute('field-height');
        }
      }
    });

    test('can set/get validate attribute', async () => {
      expect(await idsTriggerField.evaluate((element: IdsTriggerField) => element.validate)).toBeNull();
      await expect(idsTriggerField).not.toHaveAttribute('validate', 'required');
      await expect(idsTriggerField.locator('label').first()).not.toHaveClass(/required/);

      expect(await idsTriggerField.evaluate((element: IdsTriggerField) => {
        element.validate = 'required';
        return element.validate;
      })).toEqual('required');
      await expect(idsTriggerField).toHaveAttribute('validate', 'required');
      await expect(idsTriggerField.locator('label').first()).toHaveClass(/required/);
    });

    test('can add/remove validation errors', async () => {
      const errorContainer = await idsTriggerField.locator('#trigger-field-1-internal-error');
      await idsTriggerField.evaluate((element: IdsTriggerField) => {
        element.validate = 'required';
      });
      await expect(errorContainer).not.toBeAttached();
      await idsTriggerField.locator('input').focus();
      await idsTriggerField.press('Tab');
      await expect(errorContainer).toBeAttached();
    });

    test('can have two trigger buttons', async () => {
      await idsTriggerField.evaluate((element) => {
        const html = '<ids-trigger-button slot="trigger-start" id="firstBtn">'
        + '<ids-text audible="true">Starting Trigger Button</ids-text>'
        + '<ids-icon icon="schedule"></ids-icon>'
        + '</ids-trigger-button>';
        element.insertAdjacentHTML('afterbegin', html);
      });
      await expect(idsTriggerField.locator('#firstBtn')).toBeAttached();
      expect(await idsTriggerField.locator('ids-trigger-button').all()).toHaveLength(2);
    });
  });

  test.describe('IdsTriggerButton functionality tests', () => {
    let idsTriggerField: Locator;
    let idsTriggerButton: Locator;

    test.beforeEach(async ({ page }) => {
      idsTriggerField = await page.locator('#trigger-field-1');
      idsTriggerButton = await idsTriggerField.locator('ids-trigger-button').first();
    });

    test('can get protoClasses', async () => {
      const classes = ['ids-trigger-button', 'ids-icon-button'];
      const proto = await idsTriggerButton.evaluate((element: IdsTriggerButton) => element.protoClasses);
      expect(proto).toEqual(classes);
    });

    test('can be created with readyonly', async () => {
      await idsTriggerField.evaluate((element) => {
        const html = '<ids-trigger-button slot="trigger-start" id="firstBtn" readonly="true">'
        + '<ids-text audible="true">Starting Trigger Button</ids-text>'
        + '<ids-icon icon="schedule"></ids-icon>'
        + '</ids-trigger-button>';
        element.insertAdjacentHTML('afterbegin', html);
      });
      await expect(idsTriggerField.locator('#firstBtn')).toBeAttached();
      await expect(idsTriggerField.locator('#firstBtn')).toHaveAttribute('readonly');
      await expect(idsTriggerField).not.toHaveAttribute('readonly');
    });

    test('can set/get readonly', async () => {
      const testData = [
        { data: true, expected: true },
        { data: 'false', expected: false },
        { data: '', expected: true },
        { data: null, expected: false }
      ];

      expect(await idsTriggerButton.evaluate((element: IdsTriggerButton) => element.readonly)).toBeFalsy();
      await expect(idsTriggerButton).not.toHaveAttribute('readonly');

      for (const data of testData) {
        expect(await idsTriggerButton.evaluate((element: IdsTriggerButton, tData) => {
          element.readonly = tData as any;
          return element.readonly;
        }, data.data)).toEqual(data.expected);
        if (data.expected) {
          await expect(idsTriggerButton).toHaveAttribute('readonly');
        } else {
          await expect(idsTriggerButton).not.toHaveAttribute('readonly');
        }
        await expect(idsTriggerField).not.toHaveAttribute('readonly');
      }
    });

    test('can set/get tabbable', async () => {
      const testData = [
        { data: true, expected: true },
        { data: 'false', expected: false },
        { data: '', expected: true },
        { data: null, expected: false }
      ];

      expect(await idsTriggerButton.evaluate((element: IdsTriggerButton) => element.tabbable)).toBeFalsy();
      await expect(idsTriggerButton).not.toHaveAttribute('tabbable');
      await expect(idsTriggerField).not.toHaveAttribute('tabbable');

      for (const data of testData) {
        expect(await idsTriggerButton.evaluate((element: IdsTriggerButton, tData) => {
          element.tabbable = tData as any;
          return element.tabbable;
        }, data.data)).toEqual(data.expected);
        if (data.expected) {
          await expect(idsTriggerButton).toHaveAttribute('tabbable');
        } else {
          await expect(idsTriggerButton).not.toHaveAttribute('tabbable');
        }
        await expect(idsTriggerField).not.toHaveAttribute('tabbable');
      }
    });

    test('can set/get inline', async () => {
      const testData = [
        { data: true, expected: true },
        { data: 'false', expected: false },
        { data: '', expected: true },
        { data: null, expected: false }
      ];

      expect(await idsTriggerButton.evaluate((element: IdsTriggerButton) => element.inline)).toBeFalsy();
      await expect(idsTriggerButton).not.toHaveAttribute('inline');

      for (const data of testData) {
        expect(await idsTriggerButton.evaluate((element: IdsTriggerButton, tData) => {
          element.inline = tData as any;
          return element.inline;
        }, data.data)).toEqual(data.expected);
        if (data.expected) {
          await expect(idsTriggerButton).toHaveAttribute('inline');
        } else {
          await expect(idsTriggerButton).not.toHaveAttribute('inline');
        }
      }
    });

    test('can get inlineCssClass', async ({ page }) => {
      const twoBtnTrigField = await page.locator('#trigger-field-5');
      const buttons = await twoBtnTrigField.locator('ids-trigger-button').all();
      expect(buttons).toHaveLength(2);

      for (const button of buttons) {
        const inlineCss = await button.evaluate((element: IdsTriggerButton) => element.inlineCssClass);
        const inline = (await button.getAttribute('slot') === 'trigger-start') ? 'inline-start' : 'inline-end';
        expect(inlineCss).toEqual(inline);
      }
    });

    test('can set/get inheritColor', async () => {
      const testData = [
        { data: true, expected: true },
        { data: 'false', expected: false },
        { data: '', expected: true },
        { data: null, expected: false }
      ];

      expect(await idsTriggerButton.evaluate((element: IdsTriggerButton) => element.inheritColor)).toBeFalsy();
      await expect(idsTriggerButton).not.toHaveAttribute('inherit-color');
      await expect(idsTriggerButton).not.toHaveClass(/inherit-color/);

      for (const data of testData) {
        expect(await idsTriggerButton.evaluate((element: IdsTriggerButton, tData) => {
          element.inheritColor = tData as any;
          return element.inheritColor;
        }, data.data)).toEqual(data.expected);
        if (data.expected) {
          await expect(idsTriggerButton).toHaveAttribute('inherit-color');
          await expect(idsTriggerButton.locator('button')).toHaveClass(/inherit-color/);
        } else {
          await expect(idsTriggerButton).not.toHaveAttribute('inherit-color');
          await expect(idsTriggerButton.locator('button')).not.toHaveClass(/inherit-color/);
        }
      }
    });
  });
});
