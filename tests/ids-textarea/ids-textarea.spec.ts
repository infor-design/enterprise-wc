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
  });
});
