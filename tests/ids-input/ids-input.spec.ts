import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';
import { LABEL_WRAPS } from '../../src/components/ids-input/ids-input-attributes';
import IdsDataSource from '../../src/core/ids-data-source';
import dataset from '../../src/assets/data/states.json';

import IdsInput from '../../src/components/ids-input/ids-input';

test.describe('IdsInput tests', () => {
  const url = '/ids-input/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Input Component');
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

  test.describe('event tests', () => {
    test('should dispatch native events', async ({ page }) => {
      const events = ['focus', 'select', 'keydown', 'keypress', 'keyup', 'click', 'dbclick', 'blur'];

      for (const evt of events) {
        await page.evaluate((arg: string) => {
          (window as any).eventResponse = null;
          const input = document.querySelector('ids-input') as IdsInput;
          input.addEventListener(arg, () => {
            (window as any).eventResponse = 'triggered';
          });
          if (arg === 'focus') {
            input.input?.focus();
          } else if (arg === 'blur') {
            input.input?.blur();
          } else {
            const event = new Event(arg);
            input.input?.dispatchEvent(event);
          }
        }, evt);
        expect(await page.evaluate(() => (window as any).eventResponse)).toEqual('triggered');
      }
    });

    test('should trigger a change event once when the input value is changed programmatically', async ({ page }) => {
      await page.evaluate(() => {
        (window as any).changeEventCount = 0;
        document.addEventListener('change', () => {
          (window as any).changeEventCount++;
        });
        const input = document.querySelector('ids-input') as IdsInput;
        input.value = 'test';
      });

      expect(await page.evaluate(() => (window as any).changeEventCount)).toEqual(1);
    });

    test('should trigger a change event once when the internal HTMLInputElement\'s change event is fired', async ({ page }) => {
      await page.evaluate(() => {
        (window as any).changeEventCount = 0;
        document.addEventListener('change', () => {
          (window as any).changeEventCount++;
        });
        const input = document.querySelector('ids-input') as IdsInput;
        input.input!.value = 'test';
        input.input?.dispatchEvent(new Event('change', { bubbles: true }));
      });

      expect(await page.evaluate(() => (window as any).changeEventCount)).toEqual(1);
    });
  });

  test.describe('functionality tests', () => {
    test('should be able to set value', async ({ page }) => {
      await expect(await page.locator('#test-input').first().getAttribute('value')).toEqual(null);

      await page.evaluate(() => {
        const elem = document.querySelector('#test-input') as IdsInput;
        elem.value = 'test';
      });

      await expect(await page.locator('#test-input').first().getAttribute('value')).toEqual('test');
      await page.evaluate(() => {
        const elem = document.querySelector('#test-input') as IdsInput;
        elem.value = null;
      });

      await expect(await page.locator('#test-input').first().getAttribute('value')).toEqual('');
    });

    test('should be able to set label text', async ({ page }) => {
      await expect(await page.locator('#test-input').first().getAttribute('label')).toEqual('First Name');

      await page.evaluate(() => {
        const elem = document.querySelector('#test-input') as IdsInput;
        elem.label = 'test';
      });

      await expect(await page.locator('#test-input').first().getAttribute('label')).toEqual('test');

      await page.evaluate(() => {
        document.body.insertAdjacentHTML('beforeend', '<ids-input label="Hello World" id="test-id"></ids-input>');
      });

      await expect(await page.locator('#test-id').first().getAttribute('label')).toEqual('Hello World');

      await page.evaluate(() => {
        const elem = document.querySelector('#test-input') as IdsInput;
        elem.label = '';
      });

      await expect(await page.locator('#test-input').first().getAttribute('label')).toEqual(null);
    });

    test('should be able to set label required indicator', async ({ page }) => {
      await expect(await page.locator('#test-input').first().getAttribute('validate')).toEqual(null);
      await expect(await page.locator('#test-input').first().getAttribute('label-required')).toEqual(null);

      await page.evaluate(() => {
        const elem = document.querySelector('#test-input') as IdsInput;
        elem.validate = 'required';
      });

      await expect(await page.locator('#test-input').first().getAttribute('validate')).toEqual('required');
      await expect(await page.locator('#test-input').first().getAttribute('label-required')).toEqual(null);

      await page.evaluate(() => {
        const elem = document.querySelector('#test-input') as IdsInput;
        elem.labelRequired = false;
      });
      await expect(await page.locator('#test-input').first().getAttribute('validate')).toEqual('required');
      await expect(await page.locator('#test-input').first().getAttribute('label-required')).toEqual('false');

      await page.evaluate(() => {
        const elem = document.querySelector('#test-input') as IdsInput;
        elem.labelRequired = true;
      });
      await expect(await page.locator('#test-input').first().getAttribute('validate')).toEqual('required');
      await expect(await page.locator('#test-input').first().getAttribute('label-required')).toEqual('true');
    });

    test('should set/unset type attribute/property', async ({ page }) => {
      const input = await page.locator('ids-input').first();
      const inputTypes = ['text', 'number', 'email', 'password'];

      for (const inputType of inputTypes) {
        await input.evaluate((elem: IdsInput, arg: string) => {
          elem.type = arg;
        }, inputType);
        expect(await input.getAttribute('type')).toEqual(inputType);
        expect(await input.evaluate((elem: IdsInput) => elem.type)).toEqual(inputType);
      }

      await input.evaluate((elem: any) => {
        elem.type = null;
      });
      expect(await input.getAttribute('type')).toEqual('text');
      expect(await input.evaluate((elem: IdsInput) => elem.type)).toEqual('text');
    });

    test('should set/unset placeholder attribute/property', async ({ page }) => {
      const input = await page.locator('ids-input').first();
      await input.evaluate((elem: any) => {
        elem.placeholder = null;
      });
      expect(await input.getAttribute('placeholder')).toBeNull();
      expect(await input.evaluate((elem: IdsInput) => elem.placeholder)).toBeNull();
      await input.evaluate((elem: any) => {
        elem.placeholder = 'Placeholder Text';
      });
      expect(await input.getAttribute('placeholder')).toEqual('Placeholder Text');
      expect(await input.evaluate((elem: IdsInput) => elem.placeholder)).toEqual('Placeholder Text');
    });

    test('renders showable password', async ({ page }) => {
      const input = await page.locator('ids-input').first();
      await input.evaluate((elem: any) => {
        elem.type = 'password';
        elem.revealablePassword = 'true';
        elem.passwordVisible = 'true';
      });

      expect(await input.getAttribute('password-visible')).toBe('true');
      expect(await input.getAttribute('revealable-password')).toBe('true');
      expect(await input.evaluate(
        (elem: IdsInput) => elem.container?.querySelector('.show-hide-password')?.textContent
      )).toBe('HIDE');
      await input.evaluate((elem: any) => {
        elem.passwordVisible = 'false';
      });
      expect(await input.evaluate(
        (elem: IdsInput) => elem.container?.querySelector('.show-hide-password')?.textContent
      )).toBe('SHOW');
    });

    test('renders capslock indicator', async ({ page }) => {
      const input = await page.locator('ids-input').first();
      await input.evaluate((elem: any) => {
        elem.capsLock = 'true';
      });
      expect(await input.getAttribute('caps-lock')).toBe('true');
      await input.evaluate((elem: any) => {
        const capslockEvent = new KeyboardEvent('keyup', { key: 'w', modifierCapsLock: true });
        elem.input.dispatchEvent(capslockEvent);
      });
      expect(await input.evaluate((elem: IdsInput) => elem.capsLockIcon)).toBeDefined();
    });

    test('should set compact mode', async ({ page }) => {
      const input = await page.locator('ids-input').first();
      expect(await input.getAttribute('compact')).toBeNull();
      expect(await input.evaluate((elem: IdsInput) => elem.compact)).toBeFalsy();
      expect(await input.evaluate((elem: IdsInput) => elem.container?.classList.contains('compact'))).toBeFalsy();
      await input.evaluate((elem: any) => {
        elem.compact = true;
      });
      await expect(input).toHaveAttribute('compact');
      expect(await input.evaluate((elem: IdsInput) => elem.compact)).toBeTruthy();
      expect(await input.evaluate((elem: IdsInput) => elem.container?.classList.contains('compact'))).toBeTruthy();
      await input.evaluate((elem: any) => {
        elem.compact = false;
      });
      await expect(input).not.toHaveAttribute('compact');
      expect(await input.evaluate((elem: IdsInput) => elem.compact)).toBeFalsy();
      expect(await input.evaluate((elem: IdsInput) => elem.container?.classList.contains('compact'))).toBeFalsy();
    });

    test('cannot have both a "compact" and "field-height" setting applied', async ({ page }) => {
      const input = await page.locator('ids-input').first();
      await input.evaluate((elem: any) => {
        elem.compact = true;
      });
      await expect(input).toHaveAttribute('compact');
      expect(await input.evaluate((elem: IdsInput) => elem.compact)).toBeTruthy();
      await input.evaluate((elem: any) => {
        elem.fieldHeight = 'xs';
      });
      expect(await input.getAttribute('compact')).toBeNull();
      expect(await input.evaluate((elem: IdsInput) => elem.container?.classList.contains('compact'))).toBeFalsy();
      expect(await input.getAttribute('field-height')).toEqual('xs');
      expect(await input.evaluate((elem: IdsInput) => elem.container?.classList.contains('field-height-xs'))).toBeTruthy();
      await input.evaluate((elem: any) => {
        elem.compact = true;
      });
      await expect(input).toHaveAttribute('compact');
      expect(await input.evaluate((elem: IdsInput) => elem.compact)).toBeTruthy();
      expect(await input.evaluate((elem: IdsInput) => elem.container?.classList.contains('compact'))).toBeTruthy();
      expect(await input.getAttribute('field-height')).toBeNull();
      expect(await input.evaluate((elem: IdsInput) => elem.container?.classList.contains('field-height-xs'))).toBeFalsy();
    });

    test('should set disabled', async ({ page }) => {
      const input = await page.locator('ids-input').first();
      expect(await input.getAttribute('disabled')).toBeNull();
      expect(await input.evaluate((elem: IdsInput) => elem.input?.disabled)).toBeFalsy();
      expect(await input.evaluate(
        (elem: IdsInput) => elem.container?.classList.contains('disabled')
      )).toBeFalsy();
      await input.evaluate((elem: any) => {
        elem.disabled = true;
      });
      await expect(input).toHaveAttribute('disabled');
      expect(await input.evaluate((elem: IdsInput) => elem.input?.disabled)).toBeTruthy();
      expect(await input.evaluate(
        (elem: IdsInput) => elem.container?.classList.contains('disabled')
      )).toBeTruthy();
      await input.evaluate((elem: any) => {
        elem.disabled = false;
      });
      expect(await input.getAttribute('disabled')).toBeNull();
      expect(await input.evaluate((elem: IdsInput) => elem.input?.disabled)).toBeFalsy();
      expect(await input.evaluate(
        (elem: IdsInput) => elem.container?.classList.contains('disabled')
      )).toBeFalsy();
    });

    test('should set readonly', async ({ page }) => {
      const input = await page.locator('ids-input').first();
      expect(await input.getAttribute('readonly')).toBeNull();
      expect(await input.evaluate((elem: IdsInput) => elem.input?.readOnly)).toBeFalsy();
      expect(await input.evaluate(
        (elem: IdsInput) => elem.container?.classList.contains('readonly')
      )).toBeFalsy();
      await input.evaluate((elem: any) => {
        elem.readonly = true;
      });
      await expect(input).toHaveAttribute('readonly');
      expect(await input.evaluate((elem: IdsInput) => elem.input?.readOnly)).toBeTruthy();
      expect(await input.evaluate(
        (elem: IdsInput) => elem.container?.classList.contains('readonly')
      )).toBeTruthy();
      await input.evaluate((elem: any) => {
        elem.readonly = false;
      });
      expect(await input.getAttribute('readonly')).toBeNull();
      expect(await input.evaluate((elem: IdsInput) => elem.input?.readOnly)).toBeFalsy();
      expect(await input.evaluate(
        (elem: IdsInput) => elem.container?.classList.contains('readonly')
      )).toBeFalsy();
    });

    test('should skip invalid input state', async ({ page }) => {
      const input = await page.locator('ids-input').first();
      expect(await input.getAttribute('test')).toBeNull();
      expect(await input.evaluate((elem: IdsInput) => elem.input?.getAttribute('test'))).toBeNull();
      expect(await input.evaluate((elem: IdsInput) => elem.container?.classList.contains('test'))).toBeFalsy();
      await input.evaluate((elem: any) => {
        elem.setInputState('test');
      });
      expect(await input.getAttribute('test')).toBeNull();
      expect(await input.evaluate((elem: IdsInput) => elem.input?.getAttribute('test'))).toBeNull();
      expect(await input.evaluate((elem: IdsInput) => elem.container?.classList.contains('test'))).toBeFalsy();
    });

    test('should render an error on blur for required', async ({ page }) => {
      const input = await page.locator('ids-input').first();
      expect(await input.evaluate(
        (elem: IdsInput) => elem.container?.querySelector('.validation-message')
      )).toBeNull();
      await input.evaluate((elem: any) => {
        elem.validate = 'required';
        elem.value = '';
      });
      await input.click();
      await page.keyboard.press('Tab');
      expect(await input.evaluate(
        (elem: IdsInput) => elem.container?.querySelector('.validation-message')
      )).not.toBeNull();
    });

    test('should have an input with "aria-label" set when label-state="hidden" or "collapsed"', async ({ page }) => {
      // should have an input with "aria-label" set when label-state="hidden" or "collapsed"
      // is flagged and a label exists, then toggles this by unsetting it
      const input = await page.locator('ids-input').first();
      await input.evaluate((elem: any) => {
        elem.labelState = 'hidden';
      });
      expect(await input.evaluate((elem: IdsInput) => elem.labelState)).toBeTruthy();
      expect(await input.evaluate((elem: IdsInput) => elem.input?.getAttribute('aria-label')?.length)).toBeGreaterThan(0);
      await input.evaluate((elem: any) => {
        elem.labelState = null;
      });
      expect(await input.evaluate((elem: IdsInput) => elem.labelState)).toBeFalsy();
      expect(await input.evaluate((elem: IdsInput) => elem.input?.hasAttribute('aria-label'))).toBeFalsy();
      await input.evaluate((elem: any) => {
        elem.labelState = 'collapsed';
      });
      expect(await input.evaluate((elem: IdsInput) => elem.labelState)).toBeTruthy();
      expect(await input.evaluate((elem: IdsInput) => elem.input?.getAttribute('aria-label')?.length)).toBeGreaterThan(0);
    });

    test('renders label-state from a template with no issues', async ({ page }) => {
      let hasConsoleError = false;
      page.on('console', (message) => {
        if (message.type() === 'error') {
          hasConsoleError = true;
        }
      });
      await page.evaluate(() => {
        const template = document.createElement('template');
        template.innerHTML = '<ids-input label="testing input" label-state="hidden"></ids-input>';

        let input = template.content.childNodes[0];
        document.body.appendChild(input);

        template.innerHTML = '<ids-input label="testing input" label-state="collapsed"></ids-input>';

        input = template.content.childNodes[0];
        document.body.appendChild(input);
      });
      expect(hasConsoleError).toBeFalsy();
    });

    test('should call template', async ({ page }) => {
      const input = await page.locator('ids-input').first();
      await input.evaluate((elem: IdsInput) => {
        elem.value = 'test';
        elem.readonly = 'true';
        elem.disabled = 'true';
        elem.bgTransparent = 'true';
        elem.textEllipsis = 'true';
        elem.compact = 'true';
        elem.template();
      });

      expect(await input.evaluate((elem: IdsInput) => elem.input?.value)).toEqual('test');
    });

    test('renders field as bg-transparent', async ({ page }) => {
      const input = await page.locator('ids-input').first();
      expect(await input.getAttribute('bg-transparent')).toBeNull();
      expect(await input.evaluate((elem: IdsInput) => elem.input?.classList.contains('bg-transparent'))).toBeFalsy();
      await input.evaluate((elem: any) => {
        elem.bgTransparent = true;
      });
      expect(await input.getAttribute('bg-transparent')).toBe('true');
      expect(await input.evaluate((elem: IdsInput) => elem.input?.classList.contains('bg-transparent'))).toBeTruthy();
      await input.evaluate((elem: any) => {
        elem.bgTransparent = false;
      });
      expect(await input.getAttribute('bg-transparent')).toBeNull();
      expect(await input.evaluate((elem: IdsInput) => elem.input?.classList.contains('bg-transparent'))).toBeFalsy();
    });

    test('renders field as text-ellipsis', async ({ page }) => {
      const input = await page.locator('ids-input').first();
      expect(await input.getAttribute('text-ellipsis')).toBeNull();
      expect(await input.evaluate((elem: IdsInput) => elem.input?.classList.contains('text-ellipsis'))).toBeFalsy();
      await input.evaluate((elem: any) => {
        elem.textEllipsis = true;
      });
      expect(await input.getAttribute('text-ellipsis')).toBe('true');
      expect(await input.evaluate((elem: IdsInput) => elem.input?.classList.contains('text-ellipsis'))).toBeTruthy();
      await input.evaluate((elem: any) => {
        elem.textEllipsis = false;
      });
      expect(await input.getAttribute('text-ellipsis')).toBeNull();
      expect(await input.evaluate((elem: IdsInput) => elem.input?.classList.contains('text-ellipsis'))).toBeFalsy();
    });

    test('should setup and destroy dirty tracking', async ({ page }) => {
      const input = await page.locator('ids-input').first();
      expect(await input.getAttribute('dirty-tracker')).toEqual(null);
      expect(await input.evaluate((elem: IdsInput) => elem.dirtyTracker)).toBeFalsy();
      expect(await input.evaluate((elem: IdsInput) => elem.container?.querySelector('.icon-dirty'))).toBeFalsy();
      await input.evaluate((elem: IdsInput) => {
        elem.dirtyTracker = true;
        elem.setDirtyTracker();
      });
      expect(await input.getAttribute('dirty-tracker')).toEqual('true');
      expect(await input.evaluate((elem: IdsInput) => elem.dirtyTracker)).toBeTruthy();
      await input.evaluate((elem: IdsInput) => {
        elem.input!.value = 'test';
        elem.handleDirtyTracker();
        const event = new Event('change', { bubbles: true });
        elem.input?.dispatchEvent(event);
      });
      expect(await input.evaluate(
        (elem: IdsInput) => elem.container?.querySelector('.icon-dirty')
      )).toBeDefined();
      expect(await input.evaluate(
        (elem: IdsInput) => elem.labelEl?.querySelector('.msg-dirty')
      )).toBeDefined();

      await input.evaluate((elem: IdsInput) => {
        elem.destroyDirtyTracker();
      });
      expect(await input.evaluate((elem: IdsInput) => elem.container?.querySelector('.icon-dirty'))).toBeNull();
      expect(await input.evaluate(
        (elem: IdsInput) => elem.labelEl?.querySelector('.msg-dirty')
      )).toBeNull();

      await input.evaluate((elem: IdsInput) => {
        elem.dirtyTracker = true;
        elem.input?.remove();
        elem.dirtyTrackerEvents();
      });
      expect(await input.evaluate((elem: IdsInput) => elem.dirty)).toEqual({ original: 'test' });

      const results = await page.evaluate(() => {
        document.body.innerHTML = '';
        const template = document.createElement('template');
        template.innerHTML = '<ids-input label="testing input"></ids-input>';
        const elem = template.content.childNodes[0];
        document.body.appendChild(elem);
        const inputEl = document.querySelector<IdsInput>('ids-input');
        inputEl!.dirtyTracker = true;
        inputEl?.handleDirtyTracker();

        return inputEl?.dirty;
      });
      expect(results).toEqual({ original: '' });
    });

    test('should handle dirty tracking', async ({ page }) => {
      const input = await page.locator('ids-input').first();
      await input.evaluate((elem: IdsInput) => {
        elem.dirtyTracker = true;
      });
      expect(await input.getAttribute('dirty-tracker')).toEqual('true');
      expect(await input.evaluate((elem: IdsInput) => elem.dirtyTracker)).toBeTruthy();
      expect(await input.evaluate((elem: IdsInput) => elem.container?.querySelector('.icon-dirty'))).toBeNull();
      expect(await input.evaluate((elem: IdsInput) => elem.labelEl?.querySelector('.msg-dirty'))).toBeNull();
      await input.evaluate((elem: IdsInput) => {
        elem.input!.value = 'test';
        elem.setDirtyTracker(elem.input?.value);
      });
      expect(await input.evaluate((elem: IdsInput) => elem.container?.querySelector('.icon-dirty'))).toBeDefined();
      expect(await input.evaluate((elem: IdsInput) => elem.labelEl?.querySelector('.msg-dirty'))).toBeDefined();
      await input.evaluate((elem: IdsInput) => {
        elem.input!.value = '';
        elem.setDirtyTracker(elem.input?.value);
      });
      expect(await input.evaluate((elem: IdsInput) => elem.container?.querySelector('.icon-dirty'))).toBeNull();
      expect(await input.evaluate((elem: IdsInput) => elem.labelEl?.querySelector('.msg-dirty'))).toBeNull();
      await input.evaluate((elem: IdsInput) => {
        elem.dirtyTracker = false;
      });
      expect(await input.getAttribute('dirty-tracker')).toBeNull();
      expect(await input.evaluate((elem: IdsInput) => elem.dirtyTracker)).toBeFalsy();
      expect(await input.evaluate((elem: IdsInput) => elem.container?.querySelector('.icon-dirty'))).toBeNull();
      expect(await input.evaluate((elem: IdsInput) => elem.labelEl?.querySelector('.msg-dirty'))).toBeNull();
      await input.evaluate((elem: IdsInput) => {
        elem.dirtyTracker = true;
        elem.input!.value = 'test2';
        elem.setDirtyTracker(elem.input?.value);
      });
      expect(await input.evaluate((elem: IdsInput) => elem.container?.querySelector('.icon-dirty'))).toBeDefined();
      expect(await input.evaluate((elem: IdsInput) => elem.labelEl?.querySelector('.msg-dirty'))).toBeDefined();
    });

    test('should handle clearable', async ({ page }) => {
      const input = await page.locator('ids-input').first();
      await input.evaluate((elem: IdsInput) => {
        elem.clearable = false;
      });
      let hasConsoleError = false;
      page.on('console', (message) => {
        if (message.type() === 'error') {
          hasConsoleError = true;
        }
      });
      expect(hasConsoleError).toBeFalsy();
      expect(await input.evaluate((elem: IdsInput) => elem.container?.querySelector('.btn-clear'))).toBeNull();
      expect(await input.getAttribute('clearable')).toBeNull();
      expect(await input.evaluate((elem: IdsInput) => elem.container?.classList.contains('has-clearable'))).toBeFalsy();
      await input.evaluate((elem: IdsInput) => {
        elem.checkContents();
      });
      expect(hasConsoleError).toBeFalsy();
      await input.evaluate((elem: IdsInput) => {
        elem.clearable = true;
      });
      expect(await input.getAttribute('clearable')).toEqual('true');
      expect(await input.evaluate(
        (elem: IdsInput) => elem.container?.classList.contains('has-clearable')
      )).toBeTruthy();
      expect(await input.evaluate(
        (elem: IdsInput) => elem.container?.querySelector('.btn-clear')
      )).toBeDefined();
      await input.evaluate((elem: IdsInput) => {
        elem.input?.focus();
        elem.value = 'test';
        elem?.checkContents();
      });
      expect(await input.evaluate(
        (elem: IdsInput) => elem.container?.querySelector('.btn-clear')?.classList.contains('is-empty')
      )).toBeFalsy();
      await input.evaluate((elem: IdsInput) => {
        elem.container?.querySelector<HTMLElement>('.btn-clear')?.click();
      });
      expect(await input.evaluate((elem: IdsInput) => elem.value)).toEqual('');
      // should not error calling with no button
      await input.evaluate((elem: IdsInput) => {
        elem.clearable = true;
        const btn = document.createElement('ids-trigger-button');
        btn.className = 'btn-clear';
        elem.container?.appendChild(btn);
        elem.appendClearableButton();
        elem.removeClearableButton();
        elem.clearable = false;
      });
      expect(await input.evaluate(
        (elem: IdsInput) => elem.container?.querySelector('.btn-clear')
      )).toBeNull();
    });

    test('should render clearable-forced icon', async ({ page }) => {
      const input = await page.locator('ids-input').first();
      await input.evaluate((elem: any) => {
        elem.clearableForced = true;
      });
      expect(await input.getAttribute('clearable-forced')).toEqual('true');
      expect(await input.evaluate(
        (elem: IdsInput) => elem.container?.classList.contains('has-clearable')
      )).toBeTruthy();
      expect(await input.evaluate(
        (elem: IdsInput) => elem.container?.querySelector('.btn-clear')?.classList?.contains('is-empty')
      )).toBeTruthy();
      await input.evaluate((elem: IdsInput) => {
        elem.input?.focus();
        elem.value = 'test';
        elem.checkContents();
      });
      expect(await input.evaluate(
        (elem: IdsInput) => elem.container?.querySelector('.btn-clear')?.classList?.contains('is-empty')
      )).toBeFalsy();
      await input.evaluate((elem: IdsInput) => {
        elem.container?.querySelector<HTMLElement>('.btn-clear')?.click();
      });
      expect(await input.evaluate((elem: IdsInput) => elem.value)).toEqual('');
      await input.evaluate((elem: any) => {
        elem.clearableForced = false;
      });
      expect(await input.getAttribute('clearable-forced')).toBeNull();
      expect(await input.evaluate(
        (elem: IdsInput) => elem.container?.classList.contains('has-clearable')
      )).toBeFalsy();
    });

    test('should handle text-align', async ({ page }) => {
      const input = await page.locator('ids-input').first();
      expect(await input.getAttribute('text-align')).toBeNull();
      expect(await input.evaluate((elem: IdsInput) => elem.textAlign)).toContain('start');
      const textAligns = ['start', 'center', 'end'];
      const checkAlign = async (textAlign: string) => {
        await input.evaluate((elem: any, arg: string) => {
          elem.textAlign = arg;
        }, textAlign);
        expect(await input.getAttribute('text-align')).toEqual(textAlign);
        expect(await input.evaluate((elem: IdsInput, arg: string) => {
          const hasClass = elem.input?.classList.contains(arg);
          return hasClass;
        }, textAlign)).toBeTruthy();
        for (const s of textAligns.filter((item: string) => item !== textAlign)) {
          expect(await input.evaluate((elem: IdsInput, arg: string) => {
            const hasClass = elem.input?.classList.contains(arg);
            return hasClass;
          }, s)).toBeFalsy();
        }
      };

      for (const textAlign of textAligns) {
        await checkAlign(textAlign);
      }

      await input.evaluate((elem: any) => {
        elem.textAlign = 'test';
      });
      expect(await input.getAttribute('text-align')).toBe('start');
      expect(await input.evaluate((elem: IdsInput) => elem.input?.classList.contains('test'))).toBeFalsy();
    });

    test('should set label wrap', async ({ page }) => {
      const input = await page.locator('ids-input').first();
      const attrName = 'label-wrap';
      const defaultVal = 'wrap';
      const check = async (applyVal: string, propVal: string | null, attrVal: string | null) => {
        await input.evaluate((elem: any, arg: string) => {
          elem.labelWrap = arg;
        }, applyVal);
        expect(await input.evaluate((elem: IdsInput) => elem.labelWrap)).toEqual(propVal);
        expect(await input.getAttribute(attrName)).toEqual(attrVal);
      };

      expect(await input.evaluate((elem: IdsInput) => elem.labelWrap)).toEqual(defaultVal);
      expect(await input.getAttribute(attrName)).toBeNull();

      for (const val of LABEL_WRAPS) {
        await check(val, val, val);
      }
      await check('test', defaultVal, null);
    });

    test('should handle input sizes', async ({ page }) => {
      const input = await page.locator('ids-input').first();
      const sizes = ['xs', 'sm', 'mm', 'md', 'lg', 'full'];
      const checkSize = async (size: string) => {
        await input.evaluate((elem: any, arg: string) => {
          elem.size = arg;
        }, size);
        expect(await input.getAttribute('size')).toEqual(size);
        expect(await input.evaluate((elem: IdsInput) => elem.size)).toEqual(size);
        for (const s of sizes.filter((item: string) => item !== size)) {
          expect(await input.evaluate((elem: IdsInput, arg: string) => {
            const hasClass = elem.container?.classList.contains(arg);
            return hasClass;
          }, s)).toBeFalsy();
        }
      };

      expect(await input.evaluate((elem: IdsInput) => elem.size)).toEqual('md');
      expect(await input.getAttribute('size')).toBeNull();

      for (const size of sizes) {
        await checkSize(size);
      }

      await input.evaluate((elem: any) => {
        elem.size = 'test';
      });
      expect(await input.evaluate((elem: IdsInput) => elem.size)).toEqual('md');
      expect(await input.getAttribute('size')).toBe('md');
      await input.evaluate((elem: any) => {
        elem.size = null;
      });
      expect(await input.evaluate((elem: IdsInput) => elem.size)).toEqual('md');
      expect(await input.getAttribute('size')).toBe('md');
    });

    test('should handle input field height', async ({ page }) => {
      const input = await page.locator('ids-input').first();
      const heights = ['xs', 'sm', 'md', 'lg'];
      const defaultHeight = 'md';
      const className = (h: any) => `field-height-${h}`;
      const checkHeight = async (height: string) => {
        await input.evaluate((elem: any, arg: string) => {
          elem.fieldHeight = arg;
        }, height);
        expect(await input.getAttribute('field-height')).toEqual(height);
        expect(await input.evaluate((elem: IdsInput) => elem.fieldHeight)).toEqual(height);
        expect(await input.evaluate((elem: IdsInput, arg: string) => {
          const hasClass = elem.container?.classList.contains(arg);
          return hasClass;
        }, className(height))).toBeTruthy();
        for (const h of heights.filter((item: string) => item !== height)) {
          expect(await input.evaluate((elem: IdsInput, arg: string) => {
            const hasClass = elem.container?.classList.contains(arg);
            return hasClass;
          }, className(h))).toBeFalsy();
        }
      };

      expect(await input.evaluate((elem: IdsInput) => elem.fieldHeight)).toEqual(defaultHeight);
      expect(await input.getAttribute('field-height')).toBeNull();
      expect(await input.evaluate((elem: IdsInput) => elem.container?.classList.contains('field-height-md'))).toBeTruthy();

      for (const height of heights) {
        await checkHeight(height);
      }

      await input.evaluate((elem: any) => {
        elem.fieldHeight = null;
        elem.fieldHeight = 'test';
      });
      expect(await input.evaluate((elem: IdsInput) => elem.fieldHeight)).toEqual(defaultHeight);
      expect(await input.getAttribute('field-height')).toBeNull();
      expect(await input.evaluate((elem: IdsInput) => elem.container?.classList.contains('field-height-md'))).toBeTruthy();
    });

    test('supports setting cursor', async ({ page }) => {
      const input = await page.locator('ids-input').first();
      await input.evaluate((elem: any) => {
        elem.cursor = 'pointer';
      });
      expect(await input.evaluate((elem: IdsInput) => elem.input?.style.cursor)).toEqual('pointer');
      expect(await input.evaluate((elem: IdsInput) => elem.cursor)).toEqual('pointer');
      await input.evaluate((elem: any) => {
        elem.cursor = null;
      });
      expect(await input.evaluate((elem: IdsInput) => elem.input?.style.cursor)).toEqual('');
    });

    test('supports setting noMargins', async ({ page }) => {
      const input = await page.locator('ids-input').first();
      await input.evaluate((elem: any) => {
        elem.noMargins = true;
      });
      expect(await input.evaluate((elem: IdsInput) => elem.noMargins)).toBeTruthy();
      expect(await input.evaluate((elem: IdsInput) => elem.container?.classList.contains('no-margins'))).toBeTruthy();
      await expect(input).toHaveAttribute('no-margins');
      await input.evaluate((elem: any) => {
        elem.noMargins = false;
      });
      expect(await input.evaluate((elem: IdsInput) => elem.noMargins)).toBeFalsy();
      expect(await input.evaluate((elem: IdsInput) => elem.container?.classList.contains('no-margins'))).toBeFalsy();
      await expect(input).not.toHaveAttribute('no-margins');
    });

    test('supports setting padding', async ({ page }) => {
      const input = await page.locator('ids-input').first();
      await input.evaluate((elem: any) => {
        elem.padding = '10';
      });
      expect(await input.evaluate((elem: IdsInput) => elem.padding)).toEqual('10');
      expect(await input.evaluate((elem: IdsInput) => elem.input?.style.getPropertyValue('padding-inline-end'))).toEqual('10px');
      await input.evaluate((elem: any) => {
        elem.padding = '';
      });
      expect(await input.evaluate((elem: IdsInput) => elem.padding)).toEqual('');
      expect(await input.evaluate((elem: IdsInput) => elem.input?.style.getPropertyValue('padding-inline-end'))).toEqual('');
    });

    test('should set readonly background', async ({ page }) => {
      const input = await page.locator('ids-input').first();
      expect(await input.getAttribute('readonly-background')).toBeNull();
      expect(await input.evaluate((elem: IdsInput) => elem.readonlyBackground)).toBeFalsy();
      expect(await input.evaluate((elem: IdsInput) => elem.container?.classList.contains('readonly-background'))).toBeFalsy();
      await input.evaluate((elem: any) => {
        elem.readonlyBackground = true;
      });
      await expect(input).toHaveAttribute('readonly-background');
      expect(await input.evaluate((elem: IdsInput) => elem.readonlyBackground)).toBeTruthy();
      expect(await input.evaluate((elem: IdsInput) => elem.container?.classList.contains('readonly-background'))).toBeTruthy();
    });

    test('should set active', async ({ page }) => {
      const input = await page.locator('ids-input').first();
      expect(await input.evaluate((elem: IdsInput) => elem.active)).toBeFalsy();
      expect(await input.evaluate((elem: IdsInput) => elem.container?.classList.contains('is-active'))).toBeFalsy();
      await input.evaluate((elem: any) => {
        elem.active = true;
      });
      expect(await input.evaluate((elem: IdsInput) => elem.active)).toBeTruthy();
      expect(await input.evaluate((elem: IdsInput) => elem.container?.classList.contains('is-active'))).toBeTruthy();
    });

    test('focuses its inner HTMLInputElement when the host element becomes focused', async ({ page }) => {
      const input = await page.locator('ids-input').first();
      await input.focus();
      expect(await page.evaluate(() => document.activeElement))
        .toEqual(await input.evaluate((elem: IdsInput) => elem));
    });

    test('focuses its inner HTMLInputElement when its label is clicked', async ({ page }) => {
      const input = await page.locator('ids-input').first();
      const results = await input.evaluate((elem: IdsInput) => {
        const labelEl = elem.container?.querySelector('label');
        labelEl?.click();

        return elem.input?.isEqualNode(elem.shadowRoot?.activeElement as HTMLElement);
      });

      expect(results).toBeTruthy();
    });

    test('should autoselect', async ({ page }) => {
      const input = await page.locator('ids-input').first();
      await input.evaluate((elem: any) => {
        elem.autoselect = true;
        elem.value = 'test';
      });
      expect(await input.getAttribute('autoselect')).toEqual('true');
      await input.evaluate((elem: any) => {
        elem.input?.focus();
        elem.container?.querySelector('.ids-input-field')?.focus();
      });
      await input.evaluate((elem: any) => {
        elem.autoselect = false;
        elem.handleInputFocusEvent('remove');
      });
      expect(await input.getAttribute('autoselect')).toBeNull();
    });
  });

  test('should fire dirty tracker events', async ({ page }) => {
    const inputDirtyTracker = await page.locator('ids-input#e2e-dirty-tracker-input');

    // test `dirty` event being fired
    const inputDirtyEvent = inputDirtyTracker.evaluate((input: IdsInput) => new Promise((resolve) => {
      input.addEventListener('dirty', (e) => { resolve(e); });
    }));
    await inputDirtyTracker.evaluate((input: IdsInput) => { input.value = '020061'; });
    const dirtyEventFired = await inputDirtyEvent;
    expect(dirtyEventFired).toBeDefined();

    // test `pristine` event being fired
    const inputPrisineEvent = inputDirtyTracker.evaluate((input: IdsInput) => new Promise((resolve) => {
      input.addEventListener('pristine', (e) => { resolve(e); });
    }));
    await inputDirtyTracker.evaluate((input: IdsInput) => { input.value = '02006'; });
    const pristineEventFired = await inputPrisineEvent;
    expect(pristineEventFired).toBeDefined();

    // test `afterresetdirty` event being fired
    const inputAfterResetEvent = inputDirtyTracker.evaluate((input: IdsInput) => new Promise((resolve) => {
      input.addEventListener('afterresetdirty', (e) => { resolve(e); });
    }));
    await inputDirtyTracker.evaluate((input: IdsInput) => { input.resetDirtyTracker(); });
    const afterResetEventFired = await inputAfterResetEvent;
    expect(afterResetEventFired).toBeDefined();
  });

  test.describe('snapshot tests', () => {
    test('should match innerHTML snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-input');
      const html = await handle?.evaluate((el: IdsInput) => el?.outerHTML);
      await expect(html).toMatchSnapshot('input-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-input');
      const html = await handle?.evaluate((el: IdsInput) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('input-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-input-light');
    });

    test('should match the visual snapshot in percy for sizes', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await page.goto('/ids-input/sizes.html');
      await percySnapshot(page, 'ids-input-sizes-light');
    });
  });

  test.describe('edge case tests', () => {
    test('should still handle required after reattaching', async ({ page }) => {
      await page.goto('/ids-input/reattach.html');
      expect(await page.locator('#test-input-internal-error').count()).toBe(0);
      await page.locator('#reattach').click();
      await page.evaluate(() => {
        document.querySelector<IdsInput>('ids-input')!.value = 'x';
        document.querySelector<IdsInput>('ids-input')!.value = '';
      });
      await expect(await page.locator('#test-input-internal-error')).toBeVisible();
    });
  });

  test.describe('autocomplete tests', () => {
    test('should set autocomplete', async ({ page }) => {
      const input = await page.locator('ids-input').first();
      expect(await input.getAttribute('autocomplete')).toBeNull();
      expect(await input.evaluate((elem: IdsInput) => elem.autocomplete)).toBeFalsy();
      const datasource = new IdsDataSource();
      await input.evaluate((elem: any, arg) => {
        elem.autocomplete = true;
        elem.datasource = arg.datasource;
        elem.data = arg.dataset;
      }, {
        dataset,
        datasource
      });

      await expect(input).toHaveAttribute('autocomplete');
      expect(await input.evaluate((elem: IdsInput) => elem.autocomplete)).toBeTruthy();
      expect(await input.evaluate((elem: IdsInput) => elem.data.length)).toEqual(59);
      expect(await input.evaluate((elem: IdsInput) => elem.searchField)).toEqual('value');
      await input.evaluate((elem: any) => {
        elem.searchField = 'label';
      });
      expect(await input.evaluate((elem: IdsInput) => elem.searchField)).toEqual('label');
    });

    test('should open popup on keydown if autocomplete is enabled', async ({ page }) => {
      await page.goto('/ids-input/autocomplete.html');
      const input = await page.locator('ids-input');
      expect(await input.evaluate((elem: IdsInput) => elem.autocomplete)).toBeTruthy();
      await expect(input).toHaveAttribute('autocomplete');
      await input.evaluate((elem: any) => {
        elem.popup.animated = false;
        elem.input?.focus();
      });
      await page.keyboard.press('a');
      await page.waitForFunction(() => {
        const elem = document.querySelector<IdsInput>('ids-input');
        return elem?.popup?.visible;
      });
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowDown');
      expect(await input.evaluate(
        (elem: IdsInput) => elem.options[1].classList.contains('is-selected')
      )).toBeTruthy();
      await page.keyboard.press('ArrowUp');
      expect(await input.evaluate(
        (elem: IdsInput) => elem.options[0].classList.contains('is-selected')
      )).toBeTruthy();
      await page.keyboard.press('Enter');
      expect(await input.evaluate((elem: IdsInput) => elem.value)).toEqual('Alabama');
      await input.evaluate((elem: IdsInput) => {
        elem.value = '';
        elem.disabled = true;
        elem.readonly = true;
      });
      await input.evaluate((elem: any) => {
        elem.input?.focus();
      });
      await page.keyboard.press('a');
      await page.waitForFunction(() => {
        const elem = document.querySelector<IdsInput>('ids-input');
        return !elem?.popup?.visible;
      });
    });
  });
});
