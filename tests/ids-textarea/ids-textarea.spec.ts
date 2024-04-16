import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsTextarea from '../../src/components/ids-textarea/ids-textarea';

test.describe('IdsTextarea tests', () => {
  const url = '/ids-textarea/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Textarea Component');
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
      const handle = await page.$('ids-textarea');
      const html = await handle?.evaluate((el: IdsTextarea) => el?.outerHTML);
      await expect(html).toMatchSnapshot('textarea-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-textarea');
      const html = await handle?.evaluate((el: IdsTextarea) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('textarea-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-textarea-light');
    });
  });

  test.describe('page append tests', () => {
    test('should be able to createElement', async ({ page }) => {
      await page.evaluate(() => {
        const elem = document.createElement('ids-textarea') as IdsTextarea;
        elem.id = 'test-textarea';
        elem.placeholder = 'Placeholder Text';
        elem.value = 'Test Content';
        document.body.appendChild(elem);
      });
      await expect(await page.locator('#test-textarea')).toHaveAttribute('id');
      await expect(await page.locator('#test-textarea').getAttribute('placeholder')).toBe('Placeholder Text');
      await expect(await page.locator('#test-textarea').getAttribute('value')).toBe('Test Content');
    });
  });

  test.describe('functionality tests', () => {
    test('should be able to set placeholder setting', async ({ page }) => {
      const locator = await page.locator('ids-textarea').first();
      const value = await page.evaluate(() => {
        const elem = document.querySelector<IdsTextarea>('ids-textarea')!;
        elem.placeholder = 'Placeholder Text';
        return elem.placeholder;
      });
      await expect(await locator.getAttribute('placeholder')).toEqual('Placeholder Text');
      await expect(await value).toEqual('Placeholder Text');
    });

    test('should be able to set label setting', async ({ page }) => {
      const locator = await page.locator('ids-textarea').first();
      const value = await page.evaluate(() => {
        const elem = document.querySelector<IdsTextarea>('ids-textarea')!;
        elem.label = 'test';
        return elem.label;
      });
      await expect(await locator.getAttribute('label')).toEqual('test');
      await expect(await value).toEqual('test');
    });

    test('should be able to set label required indicator', async ({ page }) => {
      const textarea = await page.locator('ids-textarea').first();
      expect(await textarea.getAttribute('validate')).toEqual(null);
      expect(await textarea.getAttribute('label-required')).toEqual(null);

      await page.evaluate(() => {
        const elem = document.querySelector<IdsTextarea>('ids-textarea')!;
        elem.validate = 'required';
      });

      expect(await textarea.getAttribute('validate')).toEqual('required');
      expect(await textarea.getAttribute('label-required')).toEqual(null);

      await page.evaluate(() => {
        const elem = document.querySelector<IdsTextarea>('ids-textarea')!;
        elem.labelRequired = false;
      });

      expect(await textarea.getAttribute('validate')).toEqual('required');
      expect(await textarea.getAttribute('label-required')).toEqual('false');

      await page.evaluate(() => {
        const elem = document.querySelector<IdsTextarea>('ids-textarea')!;
        elem.labelRequired = false;
      });

      expect(await textarea.getAttribute('validate')).toEqual('required');
      expect(await textarea.getAttribute('label-required')).toEqual('false');
    });

    test('should be able to set validation events', async ({ page }) => {
      const textarea = await page.locator('ids-textarea').first();
      expect(await textarea.getAttribute('validate')).toEqual(null);
      expect(await textarea.getAttribute('validation-events')).toEqual(null);

      await page.evaluate(() => {
        const elem = document.querySelector<IdsTextarea>('ids-textarea')!;
        elem.validate = 'required';
        elem.validationEvents = 'blur';
      });

      expect(await textarea.getAttribute('validate')).toEqual('required');
      expect(await textarea.getAttribute('validation-events')).toEqual('blur');

      await page.evaluate(() => {
        const elem = document.querySelector<IdsTextarea>('ids-textarea')!;
        elem.validationEvents = null;
      });

      expect(await textarea.getAttribute('validate')).toEqual('required');
      expect(await textarea.getAttribute('validation-events')).toEqual(null);

      await page.evaluate(() => {
        const elem = document.querySelector<IdsTextarea>('ids-textarea')!;
        elem.validate = null;
      });

      expect(await textarea.getAttribute('validate')).toEqual(null);
      expect(await textarea.getAttribute('validation-events')).toEqual(null);
    });

    test('should be able to set value', async ({ page }) => {
      const value = await page.evaluate(() => {
        const elem = document.querySelector<IdsTextarea>('ids-textarea')!;
        elem.value = '';
        return elem?.input?.value;
      });
      expect(await value).toEqual('');
      const value2 = await page.evaluate(() => {
        const elem = document.querySelector<IdsTextarea>('ids-textarea')!;
        elem.value = 'test';
        return elem?.input?.value;
      });
      expect(value2).toEqual('test');
      const value3 = await page.evaluate(() => {
        const elem = document.querySelector<IdsTextarea>('ids-textarea')!;
        elem.value = null as any;
        return elem?.input?.value;
      });
      expect(value3).toEqual('');
    });

    test('should re render calling template', async ({ page }) => {
      const value = await page.evaluate(() => {
        const textarea = document.querySelector<IdsTextarea>('ids-textarea')!;
        textarea.value = 'test';
        textarea.rows = '15';
        textarea.maxlength = '90';
        textarea.characterCounter = 'true';
        textarea.readonly = 'true';
        textarea.disabled = 'true';
        textarea.printable = 'false';
        textarea.placeholder = 'test';
        textarea.resizable = 'true';
        textarea.size = 'sm';
        textarea.template();
        return textarea?.input?.value;
      });

      expect(value).toEqual('test');
    });

    test('should be able to disabled', async ({ page }) => {
      const textarea = await page.locator('ids-textarea').first();
      expect(await textarea.getAttribute('disabled')).toEqual(null);

      const values = await page.evaluate(() => {
        const elem = document.querySelector<IdsTextarea>('ids-textarea')!;
        return [elem?.input?.getAttribute('disabled'), elem?.container?.classList];
      });

      expect(await textarea.getAttribute('disabled')).toEqual(null);
      expect(await values[0]).toBe(null);
      expect(await values[1]).not.toContain('disabled');

      const values2 = await page.evaluate(() => {
        const elem = document.querySelector<IdsTextarea>('ids-textarea')!;
        elem.validate = 'required';
        elem.checkValidation();
        elem.disabled = true;
        return [elem?.input?.getAttribute('disabled'), elem?.container?.classList];
      });
      expect(await textarea.getAttribute('disabled')).toEqual('true');
      expect(await values2[0]).toBe('true');
      if (values2[1]) expect(await values2[1]['1']).toContain('disabled');
    });

    test('should be able disable and enable', async ({ page }) => {
      const textarea = await page.locator('ids-textarea').first();
      expect(await textarea.getAttribute('disabled')).toEqual(null);
      const values = await page.evaluate(() => {
        const elem = document.querySelector<IdsTextarea>('ids-textarea')!;
        return [(elem as any)?.input?.getAttribute('disabled'), elem?.container?.classList];
      });
      expect(await values[0]).toBe(null);
      expect(await values[1]).not.toContain('disabled');
      await page.evaluate(() => {
        const elem = document.querySelector<IdsTextarea>('ids-textarea')!;
        elem.disabled = true;
      });
      expect(await textarea.getAttribute('disabled')).toEqual('true');
      const values2 = await page.evaluate(() => {
        const elem = document.querySelector<IdsTextarea>('ids-textarea')!;
        return [(elem as any)?.input?.getAttribute('disabled'), elem?.container?.classList];
      });
      expect(await values2[0]).toBe('true');
      expect(await values2[1]['1']).toContain('disabled');
      await page.evaluate(() => {
        const elem = document.querySelector<IdsTextarea>('ids-textarea')!;
        elem.disabled = false;
      });
      expect(await textarea.getAttribute('disabled')).toEqual(null);
      const values3 = await page.evaluate(() => {
        const elem = document.querySelector<IdsTextarea>('ids-textarea')!;
        return [(elem as any)?.input?.getAttribute('disabled'), elem?.container?.classList];
      });
      expect(await values3[0]).toBe(null);
      expect(await values3[1]).not.toContain('disabled');
    });

    test('should be able renders field as readonly', async ({ page }) => {
      const textarea = await page.locator('ids-textarea').first();
      expect(textarea.getAttribute('readonly')).not.toEqual('true');
      const values = await page.evaluate(() => {
        const elem = document.querySelector<IdsTextarea>('ids-textarea')!;
        return [(elem as any)?.input?.getAttribute('readonly'), elem?.container?.classList];
      });
      expect(values[0]).toBe(null);
      expect(values[1]).not.toContain('readonly');
      await page.evaluate(() => {
        const elem = document.querySelector<IdsTextarea>('ids-textarea')!;
        elem.validate = 'required';
        elem.checkValidation();
        elem.readonly = true;
      });

      const values2 = await page.evaluate(() => {
        const elem = document.querySelector<IdsTextarea>('ids-textarea')!;
        return [(elem as any)?.input?.getAttribute('readonly'), elem?.container?.classList, elem.readonly];
      });
      expect(values2[0]).toBe('true');
      expect(values2[1]['1']).toContain('readonly');
      expect(values2[2]).toBe(true);

      await page.evaluate(() => {
        const elem = document.querySelector<IdsTextarea>('ids-textarea')!;
        elem.readonly = false;
      });

      const values3 = await page.evaluate(() => {
        const elem = document.querySelector<IdsTextarea>('ids-textarea')!;
        return [(elem as any)?.input?.getAttribute('readonly'), elem?.container?.classList, elem.readonly];
      });
      expect(values3[0]).toBe(null);
      expect(values3[1]).not.toContain('readonly');
      expect(values3[2]).toEqual(false);
    });

    test('can get input/formInput/fieldContainer elements', async ({ page }) => {
      const idsTextArea = await page.locator('ids-textarea').first();
      const actual = await idsTextArea.evaluate((element: IdsTextarea) => {
        const res = { input: element.input, formInput: element.formInput, fieldContainer: element.fieldContainer };
        return res;
      });
      expect(actual.input).toBeTruthy();
      expect(actual.formInput).toBeTruthy();
      expect(actual.fieldContainer).toBeTruthy();
    });

    test('can set/get autogrow attribute', async ({ page }) => {
      const idsTextArea = await page.locator('ids-textarea').first();
      const testData = [
        { data: 'true', expected: true },
        { data: false, expected: false },
        { data: '', expected: true }
      ];

      expect(await idsTextArea.evaluate((element: IdsTextarea) => element.autogrow)).toBeFalsy();
      await expect(idsTextArea).not.toHaveAttribute('autogrow');

      for (const data of testData) {
        expect(await idsTextArea.evaluate((element: IdsTextarea, tData) => {
          element.autogrow = tData;
          return element.autogrow;
        }, data.data)).toEqual(data.expected);
        if (data.expected) {
          await expect(idsTextArea).toHaveAttribute('autogrow', 'true');
        } else {
          await expect(idsTextArea).not.toHaveAttribute('autogrow');
        }
      }
    });

    test('can set/get maxHeight attribute', async ({ page }) => {
      const idsTextArea = await page.locator('ids-textarea').first();
      const container = await idsTextArea.locator('div').first();
      const textarea = await container.locator('textarea');
      const testData = [
        { data: '200px', expected: '200px' },
        { data: '', expected: null },
        { data: 100, expected: '100' },
        { data: null, expected: null }
      ];

      expect(await idsTextArea.evaluate((element: IdsTextarea) => element.maxHeight)).toBeNull();
      await expect(idsTextArea).not.toHaveAttribute('max-height');
      await expect(container).not.toHaveClass(/has-max-height/);
      await expect(textarea).not.toHaveCSS('max-height', '');

      for (const data of testData) {
        expect(await idsTextArea.evaluate((element: IdsTextarea, tData) => {
          element.maxHeight = tData as any;
          return element.maxHeight;
        }, data.data)).toEqual(data.expected);
        if (data.expected) {
          await expect(idsTextArea).toHaveAttribute('max-height', data.expected);
          await expect(container).toHaveClass(/has-max-height/);
          await expect(textarea).toHaveCSS('max-height', (data.expected.includes('px') ? data.expected : `${data.expected}px`));
        } else {
          await expect(idsTextArea).not.toHaveAttribute('max-height');
          await expect(container).not.toHaveClass(/has-max-height/);
          await expect(textarea).not.toHaveCSS('max-height', '');
        }
      }
    });

    test('can set/get maxWidth attribute', async ({ page }) => {
      const idsTextArea = await page.locator('ids-textarea').first();
      const container = await idsTextArea.locator('div').first();
      const textarea = await container.locator('textarea');
      const testData = [
        { data: '200px', expected: '200px' },
        { data: '', expected: null },
        { data: 100, expected: '100' },
        { data: null, expected: null }
      ];

      expect(await idsTextArea.evaluate((element: IdsTextarea) => element.maxWidth)).toBeNull();
      await expect(idsTextArea).not.toHaveAttribute('max-width');
      await expect(container).not.toHaveClass(/has-max-width/);
      await expect(textarea).not.toHaveCSS('max-width', '');

      for (const data of testData) {
        expect(await idsTextArea.evaluate((element: IdsTextarea, tData) => {
          element.maxWidth = tData as any;
          return element.maxWidth;
        }, data.data)).toEqual(data.expected);
        if (data.expected) {
          await expect(idsTextArea).toHaveAttribute('max-width', data.expected);
          await expect(container).toHaveClass(/has-max-width/);
          await expect(textarea).toHaveCSS('max-width', (data.expected.includes('px') ? data.expected : `${data.expected}px`));
        } else {
          await expect(idsTextArea).not.toHaveAttribute('max-width');
          await expect(container).not.toHaveClass(/has-max-width/);
          await expect(textarea).not.toHaveCSS('max-width', '');
        }
      }
    });

    test('can set/get minHeight attribute', async ({ page }) => {
      const idsTextArea = await page.locator('ids-textarea').first();
      const container = await idsTextArea.locator('div').first();
      const textarea = await container.locator('textarea');
      const testData = [
        { data: '200px', expected: '200px' },
        { data: '', expected: null },
        { data: 100, expected: '100' },
        { data: null, expected: null }
      ];

      expect(await idsTextArea.evaluate((element: IdsTextarea) => element.minHeight)).toBeNull();
      await expect(idsTextArea).not.toHaveAttribute('min-height');
      await expect(container).not.toHaveClass(/has-min-height/);
      await expect(textarea).not.toHaveCSS('min-height', '');

      for (const data of testData) {
        expect(await idsTextArea.evaluate((element: IdsTextarea, tData) => {
          element.minHeight = tData as any;
          return element.minHeight;
        }, data.data)).toEqual(data.expected);
        if (data.expected) {
          await expect(idsTextArea).toHaveAttribute('min-height', data.expected);
          await expect(container).toHaveClass(/has-min-height/);
          await expect(textarea).toHaveCSS('min-height', (data.expected.includes('px') ? data.expected : `${data.expected}px`));
        } else {
          await expect(idsTextArea).not.toHaveAttribute('min-height');
          await expect(container).not.toHaveClass(/has-min-height/);
          await expect(textarea).not.toHaveCSS('min-height', '');
        }
      }
    });

    test('can set/get minWidth attribute', async ({ page }) => {
      const idsTextArea = await page.locator('ids-textarea').first();
      const container = await idsTextArea.locator('div').first();
      const textarea = await container.locator('textarea');
      const testData = [
        { data: '200px', expected: '200px' },
        { data: '', expected: null },
        { data: 100, expected: '100' },
        { data: null, expected: null }
      ];

      expect(await idsTextArea.evaluate((element: IdsTextarea) => element.minWidth)).toBeNull();
      await expect(idsTextArea).not.toHaveAttribute('min-width');
      await expect(container).not.toHaveClass(/has-min-width/);
      await expect(textarea).not.toHaveCSS('min-width', '');

      for (const data of testData) {
        expect(await idsTextArea.evaluate((element: IdsTextarea, tData) => {
          element.minWidth = tData as any;
          return element.minWidth;
        }, data.data)).toEqual(data.expected);
        if (data.expected) {
          await expect(idsTextArea).toHaveAttribute('min-width', data.expected);
          await expect(container).toHaveClass(/has-min-width/);
          await expect(textarea).toHaveCSS('min-width', (data.expected.includes('px') ? data.expected : `${data.expected}px`));
        } else {
          await expect(idsTextArea).not.toHaveAttribute('min-width');
          await expect(container).not.toHaveClass(/has-min-width/);
          await expect(textarea).not.toHaveCSS('min-width', '');
        }
      }
    });

    test('can set/get autoselect attribute', async ({ page }) => {
      const idsTextArea = await page.locator('ids-textarea').first();
      const testData = [
        { data: 'true', expected: true },
        { data: false, expected: false },
        { data: '', expected: true }
      ];

      expect(await idsTextArea.evaluate((element: IdsTextarea) => element.autoselect)).toBeFalsy();
      await expect(idsTextArea).not.toHaveAttribute('autoselect');

      for (const data of testData) {
        expect(await idsTextArea.evaluate((element: IdsTextarea, tData) => {
          element.autoselect = tData;
          return element.autoselect;
        }, data.data)).toEqual(data.expected);
        if (data.expected) {
          await expect(idsTextArea).toHaveAttribute('autoselect', 'true');
        } else {
          await expect(idsTextArea).not.toHaveAttribute('autoselect');
        }
      }
    });

    test('can set/get charMaxText attribute', async ({ page }) => {
      const idsTextArea = await page.locator('ids-textarea').first();
      const defText = 'Character count of {0}  exceeded';
      const testData = [
        { data: 'just another text', expected: 'just another text' },
        { data: 100, expected: '100' },
        { data: '', expected: defText },
        { data: null, expected: defText }
      ];

      expect(await idsTextArea.evaluate((element: IdsTextarea) => element.charMaxText)).toEqual(defText);
      await expect(idsTextArea).not.toHaveAttribute('char-max-text');

      for (const data of testData) {
        expect(await idsTextArea.evaluate((element: IdsTextarea, tData) => {
          element.charMaxText = tData as any;
          return element.charMaxText;
        }, data.data)).toEqual(data.expected);
        if (data.data !== null && data.data.toString().length > 0) {
          await expect(idsTextArea).toHaveAttribute('char-max-text', data.expected.toString());
        } else {
          await expect(idsTextArea).not.toHaveAttribute('char-max-text');
        }
      }
    });

    test('can set/get charRemainingText attribute', async ({ page }) => {
      const idsTextArea = await page.locator('ids-textarea').first();
      const defText = 'Characters left {0}';
      const testData = [
        { data: 'just another text', expected: 'just another text' },
        { data: 100, expected: '100' },
        { data: '', expected: defText },
        { data: null, expected: defText }
      ];

      expect(await idsTextArea.evaluate((element: IdsTextarea) => element.charRemainingText)).toEqual(defText);
      await expect(idsTextArea).not.toHaveAttribute('char-remaining-text');

      for (const data of testData) {
        expect(await idsTextArea.evaluate((element: IdsTextarea, tData) => {
          element.charRemainingText = tData as any;
          return element.charRemainingText;
        }, data.data)).toEqual(data.expected);
        if (data.data !== null && data.data.toString().length > 0) {
          await expect(idsTextArea).toHaveAttribute('char-remaining-text', data.expected.toString());
        } else {
          await expect(idsTextArea).not.toHaveAttribute('char-remaining-text');
        }
      }
    });

    test('can set/get characterCounter attribute', async ({ page }) => {
      const idsTextArea = await page.locator('ids-textarea').first();
      const testData = [
        { data: 'false', expected: false },
        { data: true, expected: true },
        { data: '', expected: true }
      ];

      expect(await idsTextArea.evaluate((element: IdsTextarea) => element.characterCounter)).toBeTruthy();
      await expect(idsTextArea).not.toHaveAttribute('character-counter');

      for (const data of testData) {
        expect(await idsTextArea.evaluate((element: IdsTextarea, tData) => {
          element.characterCounter = tData;
          return element.characterCounter;
        }, data.data)).toEqual(data.expected);
        await expect(idsTextArea).toHaveAttribute('character-counter', data.expected.toString());
      }
    });

    // https://github.com/infor-design/enterprise-wc/issues/2226
    test('can set/get maxlength attribute', async ({ page }) => {
      const idsTextArea = await page.locator('ids-textarea').first();
      const textarea = await idsTextArea.locator('div textarea').first();
      const testData = [
        { data: 30, expected: '30' },
        { data: '40', expected: '40' },
        { data: '', expected: null },
        { data: null, expected: null }
      ];

      expect(await idsTextArea.evaluate((element: IdsTextarea) => element.maxlength)).toBeNull();
      await expect(idsTextArea).not.toHaveAttribute('maxlength');
      await expect(textarea).not.toHaveAttribute('maxlength');

      for (const data of testData) {
        expect(await idsTextArea.evaluate((element: IdsTextarea, tData) => {
          element.maxlength = tData as any;
          return element.maxlength;
        }, data.data)).toEqual(data.expected);
        if (data.expected) {
          await expect(idsTextArea).toHaveAttribute('maxlength', data.expected.toString());
          await expect(textarea).toHaveAttribute('maxlength', data.expected.toString());
        } else {
          await expect(idsTextArea).not.toHaveAttribute('maxlength');
          await expect(textarea).not.toHaveAttribute('maxlength');
        }
      }
    });

    test('can set/get printable attribute', async ({ page }) => {
      const idsTextArea = await page.locator('ids-textarea').first();
      const testData = [
        { data: 'true', expected: 'true' },
        { data: false, expected: null },
        { data: '', expected: 'true' },
        { data: null, expected: null }
      ];

      expect(await idsTextArea.evaluate((element: IdsTextarea) => element.printable)).toBeFalsy();
      await expect(idsTextArea).not.toHaveAttribute('printable');

      for (const data of testData) {
        expect(await idsTextArea.evaluate((element: IdsTextarea, tData) => {
          element.printable = tData as any;
          return element.printable;
        }, data.data)).toEqual(data.expected);
        if (data.expected) {
          await expect(idsTextArea).toHaveAttribute('printable', 'true');
        } else {
          await expect(idsTextArea).not.toHaveAttribute('printable');
        }
      }
    });

    test('can set/get resizable attribute', async ({ page }) => {
      const idsTextArea = await page.locator('ids-textarea').first();
      const container = await idsTextArea.locator('div').first();
      const testData = [
        { data: 'true', expected: true },
        { data: false, expected: false },
        { data: 'x', expected: true },
        { data: 'y', expected: true },
        { data: 'both', expected: true },
        { data: null, expected: false }
      ];

      expect(await idsTextArea.evaluate((element: IdsTextarea) => element.resizable)).toBeFalsy();
      await expect(idsTextArea).not.toHaveAttribute('resizable');
      await expect(container).not.toHaveClass(/resizable/);

      for (const data of testData) {
        expect(await idsTextArea.evaluate((element: IdsTextarea, tData) => {
          element.resizable = tData as any;
          return element.resizable;
        }, data.data)).toEqual(data.expected);
        if (data.data) {
          await expect(idsTextArea).toHaveAttribute('resizable', (data.data.toString()));
          const size = (data.expected.toString() === 'x' || data.expected.toString() === 'y') ? `resizable-${data.expected.toString()}` : `resizable`;
          await expect(container).toHaveClass(new RegExp(size, 'g'));
        } else {
          await expect(idsTextArea).not.toHaveAttribute('resizable');
          await expect(container).not.toHaveClass(/resizable/);
        }
      }
    });

    test('can set/get rows attribute', async ({ page }) => {
      const idsTextArea = await page.locator('ids-textarea').first();
      const textarea = await idsTextArea.locator('div textarea').first();
      const testData = [
        { data: 30, expected: '30' },
        { data: '40', expected: '40' },
        { data: '', expected: null },
        { data: null, expected: null }
      ];

      expect(await idsTextArea.evaluate((element: IdsTextarea) => element.rows)).toBeNull();
      await expect(idsTextArea).not.toHaveAttribute('rows');
      await expect(textarea).not.toHaveAttribute('rows');

      for (const data of testData) {
        expect(await idsTextArea.evaluate((element: IdsTextarea, tData) => {
          element.rows = tData as any;
          return element.rows;
        }, data.data)).toEqual(data.expected);
        if (data.expected) {
          await expect(idsTextArea).toHaveAttribute('rows', data.expected.toString());
          await expect(textarea).toHaveAttribute('rows', data.expected.toString());
        } else {
          await expect(idsTextArea).not.toHaveAttribute('rows');
          await expect(textarea).not.toHaveAttribute('rows');
        }
      }
    });

    test('can set/get size attribute', async ({ page }) => {
      const idsTextArea = await page.locator('ids-textarea').first();
      const fieldContainer = await idsTextArea.locator('div div.field-container');
      const defSize = 'md';
      const testData = [
        { data: 'sm', expected: 'sm' },
        { data: 'lg', expected: 'lg' },
        { data: 'xs', expected: defSize },
        { data: '', expected: defSize },
        { data: null, expected: defSize }
      ];

      expect(await idsTextArea.evaluate((element: IdsTextarea) => element.size)).toEqual(defSize);
      await expect(idsTextArea).not.toHaveAttribute('size');
      await expect(fieldContainer).toHaveClass(new RegExp(defSize, 'g'));

      for (const data of testData) {
        expect(await idsTextArea.evaluate((element: IdsTextarea, tData) => {
          element.size = tData as any;
          return element.size;
        }, data.data)).toEqual(data.expected);
        await expect(idsTextArea).toHaveAttribute('size', data.expected);
        await expect(fieldContainer).toHaveClass(new RegExp(data.expected, 'g'));
      }
    });

    test('can set/get textAlign attributes', async ({ page }) => {
      const idsTextArea = await page.locator('ids-textarea').first();
      const textarea = await idsTextArea.locator('div textarea').first();
      const defAlign = 'left';
      const testData = [
        { data: 'start', expected: defAlign },
        { data: 'end', expected: 'right' },
        { data: 'middle', expected: defAlign },
        { data: '', expected: defAlign },
        { data: null, expected: defAlign }
      ];

      expect(await idsTextArea.evaluate((element: IdsTextarea) => element.textAlign)).toEqual(defAlign);
      await expect(idsTextArea).not.toHaveAttribute('text-align');
      await expect(textarea).toHaveClass(new RegExp(defAlign, 'g'));

      for (const data of testData) {
        expect(await idsTextArea.evaluate((element: IdsTextarea, tData) => {
          element.textAlign = tData as any;
          return element.textAlign;
        }, data.data)).toEqual(data.expected);
        await expect(idsTextArea).toHaveAttribute('text-align', data.expected);
        await expect(textarea).toHaveClass(new RegExp(data.expected, 'g'));
      }
    });
  });
});
