import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { Locator, expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsCheckbox from '../../src/components/ids-checkbox/ids-checkbox';

test.describe('IdsCheckbox tests', () => {
  const url = '/ids-checkbox/example.html';
  let checkbox: Locator;
  let span: Locator;
  let element: string;

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
    checkbox = await page.locator('ids-checkbox').first();
    span = await checkbox.locator('span').first();
    element = 'ids-checkbox';
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

    test('should match the visual snapshot in percy (required wrapping)', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await page.goto('/ids-checkbox/required-state.html');
      await percySnapshot(page, 'ids-checkbox-required-light');
    });
  });

  test.describe('functionality tests', () => {
    test('can render a checked checkbox', async ({ page }) => {
      await expect(span.first()).not.toBeChecked();

      await span.first().check();
      await expect(checkbox.first()).toHaveAttribute('checked');

      await span.first().uncheck();
      await expect(span.first()).not.toBeChecked();
      await expect(checkbox.first()).not.toHaveAttribute('checked');

      await page.evaluate((id) => {
        (document.querySelector<IdsCheckbox>(id))!.setAttribute('checked', 'true');
      }, element);
      await expect(checkbox.first()).toHaveAttribute('checked');
      await expect(span.first()).toBeChecked();

      await page.evaluate((id) => {
        (document.querySelector<IdsCheckbox>(id))!.removeAttribute('checked');
      }, element);
      await expect(checkbox.first()).not.toHaveAttribute('checked');
      await expect(span.first()).not.toBeChecked();
    });

    test('handles checked correctly', async ({ page }) => {
      await page.evaluate((id) => {
        (document.querySelector<IdsCheckbox>(id))!.setAttribute('checked', 'true');
      }, element);
      await expect(checkbox.first()).toHaveAttribute('checked');

      await page.evaluate((id) => {
        (document.querySelector<IdsCheckbox>(id))!.setAttribute('checked', 'false');
      }, element);
      await expect(checkbox.first()).not.toHaveAttribute('checked');
    });

    test('can render as disabled', async ({ page }) => {
      const rootEl = await checkbox.locator('.ids-checkbox');
      const input = await checkbox.locator('input').first();

      await expect(span).not.toBeDisabled();
      await expect(checkbox).not.toHaveAttribute('disabled');
      await expect(input).not.toHaveAttribute('disabled');
      await expect(rootEl).not.toHaveClass(/disabled/);

      await page.evaluate((id) => {
        document.querySelector<IdsCheckbox>(id)!.disabled = true;
      }, element);

      await expect(checkbox).toHaveAttribute('disabled', 'true');
      await expect(rootEl).toHaveClass(/disabled/);

      await page.evaluate((id) => {
        document.querySelector<IdsCheckbox>(id)!.disabled = false;
      }, element);
      await expect(checkbox).not.toHaveAttribute('disabled');
      await expect(rootEl).not.toHaveClass(/disabled/);
    });

    test('can render a checkbox without a visible label', async ({ page }) => {
      const innerCheckbox = await page.getByLabel('My Checkbox');
      const textEl = await checkbox.locator('ids-text').first();
      await page.evaluate((id) => {
        document.querySelector<IdsCheckbox>(id)!.label = 'My Checkbox';
      }, element);
      await expect(checkbox).not.toHaveAttribute('label-state');
      await expect(textEl).toHaveText('My Checkbox');
      await expect(innerCheckbox).not.toHaveAttribute('aria-label');

      await page.evaluate((id) => {
        document.querySelector<IdsCheckbox>(id)!.labelState = 'hidden';
      }, element);

      await expect(checkbox).toHaveAttribute('label-state', 'hidden');
      await expect(textEl).toHaveText('');
      await expect(innerCheckbox).toHaveAttribute('aria-label', 'My Checkbox');

      // removeAttribute('label-state');
      await page.evaluate(() => {
        const checkBox = document.querySelector('ids-checkbox');
        checkBox!.removeAttribute('label-state');
      });
      await expect(checkbox).not.toHaveAttribute('label-state');
      await expect(textEl).toHaveText('My Checkbox');
      await expect(innerCheckbox).not.toHaveAttribute('aria-label');

      // setAttribute('label-state', 'hidden');
      await page.evaluate(() => {
        const checkBox = document.querySelector('ids-checkbox');
        checkBox!.setAttribute('label-state', 'hidden');
      });
      await expect(checkbox).toHaveAttribute('label-state', 'hidden');
      await expect(textEl).toHaveText('');
      await expect(innerCheckbox).toHaveAttribute('aria-label', 'My Checkbox');
    });

    test('can add/remove required error', async ({ page }) => {
      const labelEl = await checkbox.locator('.ids-label-text');
      const msgEL = await checkbox.locator('.validation-message');
      const validationmsg = await checkbox.locator('#null-error');

      // cb.validate = 'required';
      await expect(validationmsg).toBeHidden();
      await page.evaluate((id) => {
        document.querySelector<IdsCheckbox>(id)!.validate = 'required';
      }, element);
      await expect(checkbox).toHaveAttribute('validate', 'required');
      await expect(labelEl).toHaveClass(/required/);

      await checkbox.evaluate((checkboxEl: IdsCheckbox) => checkboxEl.checkValidation());
      await expect(msgEL).toBeVisible();
      await expect(msgEL).toHaveAttribute('validation-id', 'required');
      await span.check();
      await checkbox.evaluate((checkboxEl: IdsCheckbox) => checkboxEl.checkValidation());
      await expect(validationmsg).toBeHidden();
    });

    test('can set validation events', async ({ page }) => {
      await expect(checkbox).not.toHaveAttribute('validate');
      await expect(checkbox).not.toHaveAttribute('validation-events');
      await page.evaluate((id) => {
        document.querySelector<IdsCheckbox>(id)!.validate = 'required';
      }, element);
      await page.evaluate((id) => {
        document.querySelector<IdsCheckbox>(id)!.validationEvents = 'blur';
      }, element);
      await expect(checkbox).toHaveAttribute('validate', 'required');
      await expect(checkbox).toHaveAttribute('validation-events', 'blur');
      await page.evaluate((id) => {
        document.querySelector<IdsCheckbox>(id)!.validationEvents = null;
      }, element);
      await expect(checkbox).not.toHaveAttribute('validation-events');
      await expect(checkbox).toHaveAttribute('validate', 'required');

      await page.evaluate((id) => {
        document.querySelector<IdsCheckbox>(id)!.validate = null;
      }, element);
      await expect(checkbox).not.toHaveAttribute('validate');
      await expect(checkbox).not.toHaveAttribute('validation-events');
    });

    test('can set label required indicator', async ({ page }) => {
      const className = 'no-required-indicator';
      const labelEl = await checkbox.locator('.ids-label-text');

      await expect(checkbox).not.toHaveAttribute('validate');
      await expect(checkbox).not.toHaveAttribute('label-required');
      await expect(labelEl).not.toHaveClass(className);
      await page.evaluate((id) => {
        document.querySelector<IdsCheckbox>(id)!.validate = 'required';
      }, element);
      await expect(checkbox).toHaveAttribute('validate', 'required');
      await expect(checkbox).not.toHaveAttribute('label-required');
      await expect(labelEl).not.toHaveClass(className);
      await page.evaluate((id) => {
        document.querySelector<IdsCheckbox>(id)!.labelRequired = 'false';
      }, element);
      await expect(checkbox).toHaveAttribute('validate', 'required');
      await expect(checkbox).toHaveAttribute('label-required', 'false');
      await expect(labelEl).toHaveClass(/no-required-indicator/);
      await page.evaluate((id) => {
        document.querySelector<IdsCheckbox>(id)!.labelRequired = 'true';
      }, element);
      await expect(checkbox).toHaveAttribute('validate', 'required');
      await expect(checkbox).toHaveAttribute('label-required', 'true');
      await expect(labelEl).not.toHaveClass(/no-required-indicator/);
    });

    test('can set label text', async ({ page }) => {
      const labelEl = await checkbox.locator('.ids-label-text');

      await page.evaluate(() => {
        const label = document.querySelector('.label-checkbox');
        label?.remove();
      });
      await page.evaluate((id) => {
        document.querySelector<IdsCheckbox>(id)!.label = 'test';
      }, element);

      await page.evaluate(() => {
        document.body.innerHTML = '';
        const elem: any = document.createElement('ids-checkbox') as IdsCheckbox;
        document.body.appendChild(elem);
      });

      await expect(labelEl).toContainText('');
      await page.evaluate((id) => {
        document.querySelector<IdsCheckbox>(id)!.label = 'test';
      }, element);
      await expect(labelEl).toContainText('test');

      await page.evaluate((id) => {
        document.querySelector<IdsCheckbox>(id)!.label = '';
      }, element);
      await expect(labelEl).toContainText('');
    });

    test('can render color', async ({ page }) => {
      const rootEL = await checkbox.locator('.ids-checkbox');
      const color: any = 'green';

      await expect(checkbox).not.toHaveAttribute('color');

      await page.evaluate((id) => {
        document.querySelector<IdsCheckbox>(id)!.color = 'green';
      }, element);
      await expect(checkbox).toHaveAttribute('color', color);
      await expect(rootEL).toHaveAttribute('color', color);

      await page.evaluate((id) => {
        document.querySelector<IdsCheckbox>(id)!.color = false as any;
      }, element);
      await expect(checkbox).not.toHaveAttribute('color');
      await expect(rootEL).not.toHaveAttribute('color');
    });

    test('can render value', async ({ page }) => {
      const value = 'test';
      await expect(checkbox).not.toHaveAttribute('value');

      await page.evaluate((data) => {
        document.querySelector<IdsCheckbox>(data.element)!.value = data.value;
      }, { element, value });
      await expect(checkbox).toHaveAttribute('value', 'test');
      await page.evaluate((id) => {
        document.querySelector<IdsCheckbox>(id)!.value = null;
      }, element);
      await expect(checkbox).not.toHaveAttribute('value');
      const value1 = await page.evaluate((id) => {
        const checkbox1 = document.querySelector<IdsCheckbox>(id)!;
        checkbox1.removeAttribute('value');
        checkbox1.checked = true;
        return checkbox1.value;
      }, element);
      await expect(value1).toBe('on');
    });

    test('can set indeterminate', async ({ page }) => {
      const input = await checkbox.locator('input');
      await expect(checkbox).not.toHaveAttribute('indeterminate');

      await expect(input).not.toHaveClass(/indeterminate/);
      await page.evaluate((id) => {
        document.querySelector<IdsCheckbox>(id)!.indeterminate = true;
      }, element);
      await expect(checkbox).toHaveAttribute('indeterminate', 'true');
      await expect(input).toHaveClass(/indeterminate/);

      await page.evaluate((id) => {
        document.querySelector<IdsCheckbox>(id)!.indeterminate = false;
      }, element);
      await expect(checkbox).not.toHaveAttribute('indeterminate');
      await expect(input).not.toHaveClass(/indeterminate/);

      await page.evaluate((id) => {
        document.querySelector<IdsCheckbox>(id)!.indeterminate = true;
      }, element);
      await expect(checkbox).toHaveAttribute('indeterminate', 'true');
      await expect(input).toHaveClass(/indeterminate/);

      await span.check();
      await expect(checkbox).not.toHaveAttribute('indeterminate');
      await expect(input).not.toHaveClass(/indeterminate/);
    });

    test('can set noAnimation', async ({ page }) => {
      await expect(checkbox).not.toHaveAttribute('no-animation');
      await page.evaluate((id) => {
        document.querySelector<IdsCheckbox>(id)!.noAnimation = true;
      }, element);
      await expect(checkbox).toHaveAttribute('no-animation');
      await page.evaluate((id) => {
        document.querySelector<IdsCheckbox>(id)!.noAnimation = false;
      }, element);
      await expect(checkbox).not.toHaveAttribute('no-animation');
    });

    test('can render display horizontal', async ({ page }) => {
      await expect(checkbox).not.toHaveAttribute('class');

      await page.evaluate((id) => {
        document.querySelector<IdsCheckbox>(id)!.horizontal = true;
      }, element);
      await expect(checkbox).toHaveAttribute('horizontal', 'true');
      await page.evaluate((id) => {
        document.querySelector<IdsCheckbox>(id)!.horizontal = false;
      }, element);
      await expect(checkbox).not.toHaveAttribute('horizontal');
    });

    test('can remove events', async ({ page }) => {
      let response;
      await page.evaluate(() => {
        document.body.innerHTML = '';
        const elem: any = document.createElement('ids-checkbox') as IdsCheckbox;
        document.body.appendChild(elem);
        elem.attachCheckboxChangeEvent('remove');
        elem.attachNativeEvents('remove');
        const events = ['change', 'focus', 'keydown', 'keypress', 'keyup', 'click', 'dbclick'];
        events.forEach((evt) => {
          response = null;
          elem.addEventListener(`trigger${evt}`, () => {
            response = 'triggered';
          });
          const event = new Event(evt);
          elem.input.dispatchEvent(event);
        });
      });
      expect(response).not.toEqual('triggered');
    });

    test('should trigger click event once', async ({ eventsTest }) => {
      const handle = (await checkbox.elementHandle())!;
      await eventsTest.onEvent('ids-checkbox', 'click', handle);
      await checkbox.click();
      expect(await eventsTest.isEventTriggered('ids-checkbox', 'click')).toBeTruthy();
      expect(await eventsTest.getEventsCountByElement('ids-checkbox', 'click')).toEqual(1);
    });

    test('can render template', async ({ page }) => {
      const rootEl = await checkbox.locator('.ids-checkbox');

      await page.evaluate(() => {
        document.body.innerHTML = '';
        const elem: any = document.createElement('ids-checkbox') as IdsCheckbox;
        document.body.appendChild(elem);

        elem!.setAttribute('color', 'red');
        elem!.setAttribute('disabled', 'true');
        elem!.setAttribute('horizontal', 'true');
        elem!.setAttribute('label-required', 'false');
        elem!.setAttribute('indeterminate', 'true');
        elem.template();
      });
      await expect(checkbox).toHaveAttribute('disabled', 'true');
      await expect(rootEl).toHaveClass(/disabled/);
      await expect(rootEl).toHaveClass(/horizontal/);
      await expect(checkbox).toHaveAttribute('horizontal', 'true');
      await expect(checkbox).toHaveAttribute('indeterminate', 'true');
    });

    test('can change language to rtl from the container', async ({ page }) => {
      const container = await page.getByRole('main');
      await page.getByLabel('Theme Switcher').click();
      await page.getByRole('button', { name: 'Locale' }).click();
      await page.getByRole('menuitemradio', { name: 'Arabic (ar-EG)' }).click();
      await expect(container).toHaveAttribute('dir', 'rtl');
    });

    test('can focus its inner Input element', async () => {
      expect(await checkbox.evaluate((checkboxEl: IdsCheckbox) => {
        checkboxEl.focus();
        return document.activeElement?.nodeName;
      })).toEqual('IDS-CHECKBOX');
    });

    test('can set/remove the hitbox setting', async ({ page }) => {
      const container = await checkbox.locator('.ids-checkbox ');
      await page.evaluate((id) => {
        document.querySelector<IdsCheckbox>(id)!.hitbox = 'true';
      }, element);
      await expect(container).toHaveClass(/hitbox/);
      await expect(checkbox).toHaveAttribute('hitbox', 'true');
      await page.evaluate((id) => {
        document.querySelector<IdsCheckbox>(id)!.hitbox = 'false';
      }, element);
      await expect(container).not.toHaveClass(/hitbox/);
      await expect(checkbox).not.toHaveAttribute('hitbox', 'true');
    });
  });
});
