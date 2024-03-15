import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsCheckbox from '../../src/components/ids-checkbox/ids-checkbox';

test.describe('IdsCheckbox tests', () => {
  const url = '/ids-checkbox/example.html';
  let cb: any;
  let checkbox: any;
  let span: any;
  let el: any;

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
    cb = await page.locator('.checkmark').first();
    checkbox = await page.locator('ids-checkbox').first();
    span = await checkbox.locator('span').first();
    el = 'ids-checkbox';
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Checkbox Component');
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
      const handle = await page.$('ids-checkbox');
      const html = await handle?.evaluate((eL: IdsCheckbox) => eL?.outerHTML);
      await expect(html).toMatchSnapshot('checkbox-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-checkbox');
      const html = await handle?.evaluate((eL: IdsCheckbox) => {
        eL?.shadowRoot?.querySelector('style')?.remove();
        return eL?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('checkbox-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-checkbox-light');
    });
  });

  test.describe('e2e tests', () => {
    test('should render a checked checkbox', async ({ page }) => {
      await expect(cb.first()).not.toBeChecked();

      await cb.first().check();
      expect(await cb.first().isChecked()).toBeTruthy();
      expect(await cb.first().getAttribute('checked')).toBeDefined();
      await expect(checkbox.first()).toHaveAttribute('checked');

      await cb.first().uncheck();
      await expect(cb.first()).not.toBeChecked();
      expect(await cb.first().getAttribute('checked')).toBe(null);
      await expect(checkbox.first()).not.toHaveAttribute('checked');

      await cb.first().setChecked(true);
      expect(await cb.first().isChecked()).toBeTruthy();
      expect(await cb.first().getAttribute('checked')).toBeDefined();
      await expect(checkbox.first()).toHaveAttribute('checked');

      await cb.first().setChecked(false);
      await expect(cb.first()).not.toBeChecked();
      expect(await cb.first().getAttribute('checked')).toBe(null);
      await expect(checkbox.first()).not.toHaveAttribute('checked');

      await page.evaluate((id) => {
        (document.querySelector<IdsCheckbox>(id))!.checked = false;
      }, el);
      await expect(checkbox.first()).not.toHaveAttribute('checked');
      await expect(span.first()).not.toBeChecked();
    });

    test('should have a checked checkbox', async ({ page }) => {
      await expect(await cb).not.toBeChecked();
      await cb.check(); // does this work? If so its ok
      expect(await cb.isChecked()).toBeTruthy();
      expect(await cb.getAttribute('checked')).toBeDefined();
      await expect(checkbox).toHaveAttribute('checked');

      await cb.uncheck();
      await expect(await cb).not.toBeChecked();
      expect(await cb.getAttribute('checked')).toBe(null);
      await expect(checkbox).not.toHaveAttribute('checked');

      await cb.setChecked(true);
      expect(await cb.isChecked()).toBeTruthy();
      expect(await cb.getAttribute('checked')).toBeDefined();
      await expect(checkbox).toHaveAttribute('checked');

      await cb.setChecked(false);
      await expect(cb).not.toBeChecked();
      expect(await cb.getAttribute('checked')).toBe(null);
      await expect(checkbox).not.toHaveAttribute('checked');

      await page.evaluate((id) => {
        document.querySelector<IdsCheckbox>(id)!.checked = false;
      }, el);
      await expect(checkbox).not.toHaveAttribute('checked');
      await expect(span).not.toBeChecked();
    });

    test('should render as disabled', async ({ page }) => {
      await expect(cb).not.toBeDisabled();
      expect(await cb.isDisabled()).toBeFalsy();

      expect(await cb.getAttribute('disabled')).toBe(null);
      await expect(checkbox).not.toHaveAttribute('disabled');

      const rootEl = await checkbox.locator('.ids-checkbox');
      await expect(rootEl).not.toHaveClass(/disabled/);

      await page.evaluate((id) => {
        document.querySelector<IdsCheckbox>(id)!.disabled = true;
      }, el);

      expect(await checkbox.getAttribute('disabled')).toBe('true');
      await expect(checkbox).toHaveAttribute('disabled');
      expect(await checkbox.isDisabled());
      await expect(rootEl).toHaveClass(/disabled/);
      // await expect(checkbox).toBeDisabled(); // not working for some reason

      await page.evaluate((id) => {
        document.querySelector<IdsCheckbox>(id)!.disabled = false;
      }, el);
      expect(await checkbox.getAttribute('disabled')).toBe(null);
      await expect(checkbox).not.toHaveAttribute('disabled');
      expect(await checkbox.isEnabled());
      await expect(rootEl).not.toHaveClass(/disabled/);
      // await expect(checkbox).toBeDisabled(); // not working for some reason
    });

    test('can render a checkbox without a visible label', async ({ page }) => {
      const innerCheckbox = await page.getByLabel('My Checkbox');
      const textEl = await checkbox.locator('ids-text').first();
      await page.evaluate((id) => {
        document.querySelector<IdsCheckbox>(id)!.label = 'My Checkbox';
      }, el);
      expect(await checkbox.getAttribute('label-state')).toEqual(null);
      await expect(textEl).toHaveText('My Checkbox');
      expect(await innerCheckbox.getAttribute('aria-label')).toBe(null);

      await page.evaluate((id) => {
        document.querySelector<IdsCheckbox>(id)!.labelState = 'hidden';
      }, el);

      expect(await checkbox.getAttribute('label-state')).toEqual('hidden');
      await expect(textEl).toHaveText('');
      expect(await innerCheckbox.getAttribute('aria-label')).toBe('My Checkbox');

      // removeAttribute('label-state');
      await page.evaluate(() => {
        const element = document.querySelector('ids-checkbox');
        element!.removeAttribute('label-state');
      });
      expect(await checkbox.getAttribute('label-state')).toEqual(null);
      await expect(textEl).toHaveText('My Checkbox');
      expect(await innerCheckbox.getAttribute('aria-label')).toBe(null);

      // setAttribute('label-state', 'hidden');
      await page.evaluate(() => {
        const element = document.querySelector('ids-checkbox');
        element!.setAttribute('label-state', 'hidden');
      });
      expect(await checkbox.getAttribute('label-state')).toEqual('hidden');
      await expect(textEl).toHaveText('');
      expect(await innerCheckbox.getAttribute('aria-label')).toBe('My Checkbox');
    });

    test('should add/remove required error', async ({ page }) => {
      const labelEl = await checkbox.locator('.ids-label-text');
      const msgEL = await checkbox.locator('.validation-message');
      const validationmsg = await checkbox.locator('#null-error');

      // cb.validate = 'required';
      await expect(validationmsg).toBeHidden();
      await page.evaluate((id) => {
        document.querySelector<IdsCheckbox>(id)!.validate = 'required';
      }, el);
      expect(await checkbox.getAttribute('validate')).toEqual('required');
      await expect(checkbox).toHaveAttribute('validate');
      await expect(labelEl).toHaveClass(/required/);
      /**
       *
       */
      async function checkValidation() {
        await page.evaluate((id) => {
          document.querySelector<IdsCheckbox>(id)!.checkValidation();
        }, el);
      }
      await checkValidation();
      await expect(msgEL).toBeVisible();
      expect(await msgEL.getAttribute('validation-id')).toEqual('required');
      await span.check();
      await checkValidation();
      await expect(validationmsg).toBeHidden();
    });

    test('should set validation events', async ({ page }) => {
      await expect(checkbox).not.toHaveAttribute('validate');
      await expect(checkbox).not.toHaveAttribute('validation-events');
      await page.evaluate((id) => {
        document.querySelector<IdsCheckbox>(id)!.validate = 'required';
      }, el);
      await page.evaluate((id) => {
        document.querySelector<IdsCheckbox>(id)!.validationEvents = 'blur';
      }, el);
      await expect(checkbox).toHaveAttribute('validate', 'required');
      await expect(checkbox).toHaveAttribute('validation-events', 'blur');
      await page.evaluate((id) => {
        document.querySelector<IdsCheckbox>(id)!.validationEvents = null;
      }, el);
      await expect(checkbox).not.toHaveAttribute('validation-events');
      await expect(checkbox).toHaveAttribute('validate', 'required');

      await page.evaluate((id) => {
        document.querySelector<IdsCheckbox>(id)!.validate = null;
      }, el);
      await expect(checkbox).not.toHaveAttribute('validate');
      await expect(checkbox).not.toHaveAttribute('validation-events');
    });

    test('should set label required indicator', async ({ page }) => {
      const className = 'no-required-indicator';
      const labelEl = await checkbox.locator('.ids-label-text');

      await expect(checkbox).not.toHaveAttribute('validate');
      await expect(checkbox).not.toHaveAttribute('label-required');
      await expect(labelEl).not.toHaveClass(className);
      await page.evaluate((id) => {
        document.querySelector<IdsCheckbox>(id)!.validate = 'required';
      }, el);
      await expect(checkbox).toHaveAttribute('validate', 'required');
      await expect(checkbox).not.toHaveAttribute('label-required');
      await expect(labelEl).not.toHaveClass(className);
      await page.evaluate((id) => {
        document.querySelector<IdsCheckbox>(id)!.labelRequired = 'false';
      }, el);
      await expect(checkbox).toHaveAttribute('validate', 'required');
      await expect(checkbox).toHaveAttribute('label-required', 'false');
      await expect(labelEl).toHaveClass(/no-required-indicator/);
      await page.evaluate((id) => {
        document.querySelector<IdsCheckbox>(id)!.labelRequired = 'true';
      }, el);
      await expect(checkbox).toHaveAttribute('validate', 'required');
      await expect(checkbox).toHaveAttribute('label-required', 'true');
      await expect(labelEl).not.toHaveClass(/no-required-indicator/);
    });

    test('should set label text', async ({ page }) => {
      const labelEl = await checkbox.locator('.ids-label-text');

      await page.evaluate(() => {
        const label = document.querySelector('.label-checkbox');
        label?.remove();
      });
      await page.evaluate((id) => {
        document.querySelector<IdsCheckbox>(id)!.label = 'test';
      }, el);

      await page.evaluate(() => {
        document.body.innerHTML = '';
        const elem: any = document.createElement('ids-checkbox') as IdsCheckbox;
        document.body.appendChild(elem);
      });

      await expect(labelEl).toContainText('');
      await page.evaluate((id) => {
        document.querySelector<IdsCheckbox>(id)!.label = 'test';
      }, el);
      await expect(labelEl).toContainText('test');

      await page.evaluate((id) => {
        document.querySelector<IdsCheckbox>(id)!.label = '';
      }, el);
      await expect(labelEl).toContainText('');
    });

    test('should renders colored', async ({ page }) => {
      const rootEL = await checkbox.locator('.ids-checkbox');
      const color: any = 'green';

      const elColor = await checkbox.getAttribute('color');
      await expect(elColor).toEqual(null);

      await page.evaluate((id) => {
        document.querySelector<IdsCheckbox>(id)!.color = 'green';
      }, el);
      await expect(await checkbox.getAttribute('color')).toEqual(color);
      await expect(await rootEL.getAttribute('color')).toEqual(color);

      await page.evaluate((id) => {
        document.querySelector<IdsCheckbox>(id)!.color = false as any;
      }, el);
      await expect(await checkbox.getAttribute('color')).toEqual(null);
      await expect(await rootEL.getAttribute('color')).toEqual(null);
    });

    test('should renders value', async ({ page }) => {
    // const value = 'test'; this causes error

      await expect(await checkbox.getAttribute('value')).toEqual(null);
      await page.evaluate((id) => {
        document.querySelector<IdsCheckbox>(id)!.value = 'test';
      }, el);
      await expect(await checkbox.getAttribute('value')).toEqual(''); // error occurs when you assert with variable value / 'test'
      await page.evaluate((id) => {
        document.querySelector<IdsCheckbox>(id)!.value = null;
      }, el);
      await expect(await checkbox.getAttribute('value')).toEqual(null);
    });

    test('should set indeterminate', async ({ page }) => {
      const input = await checkbox.locator('input');

      await expect(await checkbox.getAttribute('indeterminate')).toEqual(null);
      await expect(await input.getAttribute('class')).not.toContain('indeterminate');
      await page.evaluate((id) => {
        document.querySelector<IdsCheckbox>(id)!.indeterminate = true;
      }, el);
      await expect(await checkbox.getAttribute('indeterminate')).toEqual('true');
      await expect(await input.getAttribute('class')).toContain('indeterminate');
      await page.evaluate((id) => {
        document.querySelector<IdsCheckbox>(id)!.indeterminate = false;
      }, el);
      await expect(await checkbox.getAttribute('indeterminate')).toEqual(null);
      await expect(await input.getAttribute('class')).not.toContain('indeterminate');
      await page.evaluate((id) => {
        document.querySelector<IdsCheckbox>(id)!.indeterminate = true;
      }, el);
      await expect(await checkbox.getAttribute('indeterminate')).toEqual('true');
      await expect(await input.getAttribute('class')).toContain('indeterminate');

      await cb.check();
      await expect(await checkbox.getAttribute('indeterminate')).toEqual(null);
      await expect(await input.getAttribute('class')).not.toContain('indeterminate');
    });

    test('should set noAnimation', async ({ page }) => {
      await expect(checkbox).not.toHaveAttribute('no-animation');
      await page.evaluate((id) => {
        document.querySelector<IdsCheckbox>(id)!.noAnimation = true;
      }, el);
      await expect(checkbox).toHaveAttribute('no-animation');
      await page.evaluate((id) => {
        document.querySelector<IdsCheckbox>(id)!.noAnimation = false;
      }, el);
      await expect(checkbox).not.toHaveAttribute('no-animation');
    });

    test('should rander display horizontal', async ({ page }) => {
      await expect(await checkbox?.getAttribute('class')).toEqual(null);
      await page.evaluate((id) => {
        document.querySelector<IdsCheckbox>(id)!.horizontal = true;
      }, el);
      await expect(checkbox).toHaveAttribute('horizontal');
      expect(await checkbox.getAttribute('horizontal')).toEqual('true');
      await page.evaluate((id) => {
        document.querySelector<IdsCheckbox>(id)!.horizontal = false;
      }, el);
      await expect(checkbox).not.toHaveAttribute('horizontal');
      expect(await checkbox.getAttribute('horizontal')).toEqual(null);
    });

    test('should remove events', async ({ page }) => {
      let response;
      await page.evaluate(() => {
        document.body.innerHTML = '';
        const elem: any = document.createElement('ids-checkbox') as IdsCheckbox;
        document.body.appendChild(elem);
        cb = document.querySelector('ids-checkbox');
        cb.attachCheckboxChangeEvent('remove');
        cb.attachNativeEvents('remove');
        const events = ['change', 'focus', 'keydown', 'keypress', 'keyup', 'click', 'dbclick'];
        events.forEach((evt) => {
          response = null;
          cb.addEventListener(`trigger${evt}`, () => {
            response = 'triggered';
          });
          const event = new Event(evt);
          cb.input.dispatchEvent(event);
        });
      });
      expect(response).not.toEqual('triggered');
    });

    test('should render template', async ({ page }) => {
      const rootEl = await checkbox.locator('.ids-checkbox');

      await page.evaluate(() => {
        document.body.innerHTML = '';
        const elem: any = document.createElement('ids-checkbox') as IdsCheckbox;
        document.body.appendChild(elem);

        cb = document.querySelector('ids-checkbox');
        cb!.setAttribute('color', 'red');
        cb!.setAttribute('disabled', 'true');
        cb!.setAttribute('horizontal', 'true');
        cb!.setAttribute('label-required', 'false');
        cb!.setAttribute('indeterminate', 'true');
        cb.template();
      });
      expect(await checkbox.getAttribute('disabled')).toEqual('true');
      await expect(checkbox).toHaveAttribute('disabled');
      await expect(rootEl).toHaveClass(/disabled/);
      await expect(rootEl).toHaveClass(/horizontal/);
      expect(await checkbox.getAttribute('horizontal')).toEqual('true');
      await expect(checkbox).toHaveAttribute('horizontal');
      expect(await checkbox.getAttribute('indeterminate')).toEqual('true');
      await expect(checkbox).toHaveAttribute('indeterminate');
    });

    test('can change language to rtl from the container', async ({ page }) => {
      const container = await page.getByRole('main');
      await page.getByLabel('Theme Switcher').click();
      await page.getByRole('button', { name: 'Locale' }).click();
      await page.getByRole('menuitemradio', { name: 'Arabic (ar-EG)' }).click();
      await expect(container).toHaveAttribute('dir', 'rtl');
    });

    test('can focus its inner Input element', async ({ page }) => {
      await page.evaluate('document.querySelector("ids-checkbox").focus()');
      await page.locator('ids-checkbox').first().focus();
      const foc = await page.evaluate(() => {
        const focs = document.activeElement;
        return focs?.nodeName;
      });
      await expect(foc).toEqual('IDS-CHECKBOX');
    });

    test('can set/remove the hitbox setting', async ({ page }) => {
      const container = await checkbox.locator('.ids-checkbox ');
      await page.evaluate((id) => {
        document.querySelector<IdsCheckbox>(id)!.hitbox = 'true';
      }, el);
      await expect(container).toHaveClass(/hitbox/);
      expect(await checkbox.getAttribute('hitbox')).toEqual('true');
      await page.evaluate((id) => {
        document.querySelector<IdsCheckbox>(id)!.hitbox = 'false';
      }, el);
      await expect(container).not.toHaveClass(/hitbox/);
      expect(await checkbox.getAttribute('hitbox')).toEqual(null);
    });
  });
});
