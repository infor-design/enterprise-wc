import { expect } from '@playwright/test';
import percySnapshot from '@percy/playwright';
import { test } from '../base-fixture';

import IdsInput from '../../src/components/ids-input/ids-input';

test.describe('IdsInput validation tests', () => {
  let url = '/ids-input/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test('should add/remove required error', async ({ page }) => {
    const input = await page.locator('ids-input').first();
    await input.evaluate((elem: IdsInput) => {
      elem.validate = 'required';
      elem.template();
    });
    expect(await input.getAttribute('validate')).toEqual('required');
    expect(await input.evaluate((elem: IdsInput) => elem.validate)).toEqual('required');
    expect(await input.evaluate(
      (elem: IdsInput) => elem.labelEl?.classList?.contains('required')
    )).toBeTruthy();
    expect(await input.evaluate(
      (elem: IdsInput) => elem.container?.querySelector('.validation-message')
    )).toBeNull();
    expect(await input.evaluate((elem: IdsInput) => elem.validationMessagesCount)).toEqual(0);
    await input.evaluate((elem: IdsInput) => {
      elem.checkValidation();
    });
    expect(await input.evaluate((elem: IdsInput) => elem.input?.getAttribute('aria-invalid'))).toEqual('true');
    expect(await input.evaluate((elem: IdsInput) => elem.input?.getAttribute('aria-describedby'))).toEqual('test-input-internal-error');
    const results = await input.evaluate((elem: IdsInput) => {
      const msgEl = elem.container?.querySelector('.validation-message');

      return {
        msgEl,
        validationId: msgEl?.getAttribute('validation-id'),
        id: msgEl?.getAttribute('id'),
        count: elem.validationMessagesCount
      };
    });

    expect(results.msgEl).toBeDefined();
    expect(results.validationId).toEqual('required');
    expect(results.id).toEqual('test-input-internal-error');
    expect(results.count).toEqual(1);

    await input.evaluate((elem: IdsInput) => {
      elem.input!.value = 'test';
      elem.checkValidation();
    });
    expect(await input.evaluate(
      (elem: IdsInput) => elem.container?.querySelector('.validation-message')
    )).toBeNull();
    expect(await input.evaluate((elem: IdsInput) => elem.validationMessagesCount)).toEqual(0);
    expect(await input.evaluate((elem: IdsInput) => elem.input?.getAttribute('aria-invalid'))).toBeNull();
    expect(await input.evaluate((elem: IdsInput) => elem.input?.getAttribute('aria-describedby'))).toBeNull();

    // should add/remove required error on disabled
    await input.evaluate((elem: IdsInput) => {
      elem.input!.value = '';
      elem.disabled = true;
      elem.template();
      elem.checkValidation();
    });

    expect(await input.evaluate(
      (elem: IdsInput) => elem.container?.querySelector('.validation-message')
    )).not.toBeNull();
  });

  test.describe('snapshot tests', () => {
    url = '/ids-input/validation-message.html';
    test.beforeEach(async ({ page }) => {
      await page.goto(url);
    });
    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-input-validation-light');
    });
  });

  test('should add/remove manually message', async ({ page }) => {
    const input = await page.locator('ids-input').first();
    await input.evaluate((elem: IdsInput) => {
      elem.addValidationMessage({
        message: 'Something is wrong do not continue',
        type: 'error',
        id: 'error'
      });
    });
    expect(await input.evaluate((elem: IdsInput) => elem.validationMessagesCount)).toEqual(1);
    expect(await input.evaluate(
      (elem: IdsInput) => elem.container?.querySelectorAll('.validation-message').length
    )).toEqual(1);
    await input.evaluate((elem: IdsInput) => {
      elem.removeValidationMessage({ id: 'error' });
    });
    expect(await input.evaluate(
      (elem: IdsInput) => elem.container?.querySelectorAll('.validation-message').length
    )).toEqual(0);
    await input.evaluate((elem: IdsInput) => {
      elem.addValidationMessage([{
        message: 'Something is wrong do not continue',
        type: 'error',
        id: 'error'
      }, {
        message: 'Warning the value may be incorrect',
        type: 'alert',
        id: 'alert'
      }]);
    });
    expect(await input.evaluate(
      (elem: IdsInput) => elem.container?.querySelectorAll('.validation-message').length
    )).toEqual(2);
    await input.evaluate((elem: IdsInput) => {
      elem.removeValidationMessage([{ id: 'error' }, { id: 'alert' }]);
    });
    expect(await input.evaluate(
      (elem: IdsInput) => elem.container?.querySelectorAll('.validation-message').length
    )).toEqual(0);
    await input.evaluate((elem: IdsInput) => {
      elem.addValidationMessage([{
        message: 'Something is wrong do not continue',
        type: 'error',
        id: 'error-1'
      }, {
        message: 'Something else also wrong do not continue',
        type: 'error',
        id: 'error-2'
      }]);
    });
    expect(await input.evaluate(
      (elem: IdsInput) => elem.container?.querySelectorAll('.validation-message').length
    )).toEqual(2);
    await input.evaluate((elem: any) => {
      elem.removeValidationMessage({ type: 'error' });
    });
    expect(await input.evaluate(
      (elem: IdsInput) => elem.container?.querySelectorAll('.validation-message').length
    )).toEqual(0);
    await input.evaluate((elem: any) => {
      elem.addValidationMessage({
        message: 'Something is wrong do not continue',
        type: 'error'
      });
    });
    expect(await input.evaluate(
      (elem: IdsInput) => elem.container?.querySelectorAll('.validation-message').length
    )).toEqual(0);
  });

  test('should add validation messages manually thru markup', async ({ page }) => {
    await page.evaluate(() => {
      const template = document.createElement('template');
      template.innerHTML = `<ids-input
        id="e2e-markup-message"
        label="testing input"
        value="Some text"
        validation-id="icon-custom-manually"
        validation-type="icon"
        validation-message="Something about your mail information"
        validation-icon="mail"
      ></ids-input>`;
      const elem = template.content.childNodes[0];
      document.body.appendChild(elem);
    });
    const input = await page.locator('#e2e-markup-message').first();
    expect(await input.evaluate(
      (elem: IdsInput) => elem.container?.querySelectorAll('.validation-message').length
    )).toEqual(1);
    expect(await input.evaluate((elem: IdsInput) => elem.validationMessagesCount)).toEqual(1);
    await input.evaluate((elem: IdsInput) => {
      elem.removeValidationMessage({ id: 'icon-custom-manually' });
    });
    expect(await input.evaluate(
      (elem: IdsInput) => elem.container?.querySelectorAll('.validation-message').length
    )).toEqual(0);
    expect(await input.evaluate((elem: IdsInput) => elem.validationMessagesCount)).toEqual(0);
  });

  test('should skip if it already has an error', async ({ page }) => {
    const input = await page.locator('ids-input').first();
    await input.evaluate((elem: IdsInput) => {
      elem.validate = 'required';
      elem.template();
    });
    expect(await input.evaluate(
      (elem: IdsInput) => elem.container?.querySelectorAll('.validation-message').length
    )).toEqual(0);
    await input.evaluate((elem: IdsInput) => {
      elem.checkValidation();
      elem.checkValidation();
      elem.checkValidation();
    });
    expect(await input.evaluate(
      (elem: IdsInput) => elem.container?.querySelectorAll('.validation-message').length
    )).toEqual(1);
  });

  test('should not error on invalid types', async ({ page }) => {
    const input = await page.locator('ids-input').first();
    expect(await input.evaluate(
      (elem: IdsInput) => elem.container?.querySelectorAll('.validation-message').length
    )).toEqual(0);
    await input.evaluate((elem: IdsInput) => {
      elem.addValidationMessage({ type: 'xxx', id: 'xx', icon: '' });
      elem.addValidationMessage({ type: 'icon', id: 'xx', icon: '' });
    });
    expect(await input.evaluate(
      (elem: IdsInput) => elem.container?.querySelectorAll('.validation-message').length
    )).toEqual(1);
  });

  test('should set validation events', async ({ page }) => {
    const input = await page.locator('ids-input').first();
    expect(await input.getAttribute('validate')).toBeNull();
    expect(await input.getAttribute('validation-events')).toBeNull();
    await input.evaluate((elem: IdsInput) => {
      elem.validate = 'required';
      elem.validationEvents = 'blur';
    });
    expect(await input.getAttribute('validate')).toEqual('required');
    expect(await input.getAttribute('validation-events')).toEqual('blur');
    await input.evaluate((elem: IdsInput) => {
      elem.validationEvents = null;
    });
    expect(await input.getAttribute('validate')).toEqual('required');
    expect(await input.getAttribute('validation-events')).toBeNull();
    await input.evaluate((elem: IdsInput) => {
      elem.validate = null;
    });
    expect(await input.getAttribute('validate')).toBeNull();
    expect(await input.getAttribute('validation-events')).toBeNull();
  });

  test('should add/remove email error', async ({ page }) => {
    const input = await page.locator('ids-input').first();
    await input.evaluate((elem: IdsInput) => {
      elem.validate = 'email';
      elem.template();
    });
    expect(await input.getAttribute('validate')).toEqual('email');
    expect(await input.evaluate((elem: IdsInput) => elem.validate)).toEqual('email');
    expect(await input.evaluate(
      (elem: IdsInput) => elem.container?.querySelector('.validation-message')
    )).toBeNull();
    expect(await input.evaluate((elem: IdsInput) => elem.validationMessagesCount)).toEqual(0);
    await input.evaluate((elem: IdsInput) => {
      elem.input!.value = 'test';
      elem.checkValidation();
    });
    expect(await input.evaluate(
      (elem: IdsInput) => elem.container?.querySelectorAll('.validation-message').length
    )).toEqual(1);
    const results = await input.evaluate((elem: IdsInput) => {
      const msgEl = elem.container?.querySelector('.validation-message');

      return {
        msgEl,
        validationId: msgEl?.getAttribute('validation-id'),
        id: msgEl?.getAttribute('id'),
        count: elem.validationMessagesCount
      };
    });

    expect(results.msgEl).toBeDefined();
    expect(results.validationId).toEqual('email');
    expect(results.id).toEqual('test-input-internal-error');
    expect(results.count).toEqual(1);

    await input.evaluate((elem: IdsInput) => {
      elem.input!.focus();
    });
    await page.keyboard.type('test@test.com');
    await page.keyboard.press('Tab');
    expect(await input.evaluate((elem: IdsInput) => elem.validationMessagesCount)).toEqual(0);
    expect(await input.evaluate(
      (elem: IdsInput) => elem.container?.querySelector('.validation-message')
    )).toBeNull();
  });

  test('should add/remove required and email error', async ({ page }) => {
    const input = await page.locator('ids-input').first();
    await input.evaluate((elem: IdsInput) => {
      elem.validate = 'required email';
      elem.template();
    });
    expect(await input.getAttribute('validate')).toEqual('required email');
    expect(await input.evaluate((elem: IdsInput) => elem.validate)).toEqual('required email');
    expect(await input.evaluate(
      (elem: IdsInput) => elem.container?.querySelector('.validation-message')
    )).toBeNull();
    expect(await input.evaluate((elem: IdsInput) => elem.validationMessagesCount)).toEqual(0);
    await input.evaluate((elem: IdsInput) => {
      elem.input!.value = '';
      elem.checkValidation();
    });
    expect(await input.evaluate((elem: IdsInput) => elem.validationMessagesCount)).toEqual(1);
    expect(await input.evaluate(
      (elem: IdsInput) => elem.container?.querySelector('.validation-message')?.getAttribute('validation-id')
    )).toBe('required');
    await input.evaluate((elem: IdsInput) => {
      elem.input!.value = 'test';
      elem.checkValidation();
    });
    expect(await input.evaluate((elem: IdsInput) => elem.validationMessagesCount)).toEqual(1);
    expect(await input.evaluate(
      (elem: IdsInput) => elem.container?.querySelector('.validation-message')?.getAttribute('validation-id')
    )).toBe('email');
    await input.evaluate((elem: IdsInput) => {
      elem.input!.value = 'test@test.com';
      elem.checkValidation();
    });
    expect(await input.evaluate((elem: IdsInput) => elem.validationMessagesCount)).toEqual(0);
    expect(await input.evaluate(
      (elem: IdsInput) => elem.container?.querySelector('.validation-message')
    )).toBeNull();
  });

  test('should handle validation messages', async ({ page }) => {
    const input = await page.locator('ids-input').first();
    const getResults = async () => {
      const results = await input.evaluate((elem: IdsInput) => {
        const msgEl = elem.container?.querySelector('.validation-message');

        return {
          msgEl,
          validationId: msgEl?.getAttribute('validation-id'),
          id: msgEl?.getAttribute('id'),
          textContent: msgEl?.textContent,
          count: elem.validationMessagesCount
        };
      });

      return results;
    };
    // should add input error message
    await input.evaluate((elem: any) => {
      elem.removeAllValidationMessages();
      elem.addValidationMessage({ message: 'test', type: 'error', id: 'error' });
    });
    let results = await getResults();
    expect(results.msgEl).toBeDefined();
    expect(results.validationId).toEqual('error');
    expect(results.id).toEqual('input-validation-error-internal-error');
    expect(results.count).toEqual(1);
    expect(results.textContent).toEqual('Error test');
    // should add input alert message
    await input.evaluate((elem: IdsInput) => {
      elem.removeAllValidationMessages();
      elem.addValidationMessage({ message: 'test', type: 'alert', id: 'alert' });
    });
    results = await getResults();
    expect(results.msgEl).toBeDefined();
    expect(results.validationId).toEqual('alert');
    expect(results.id).toEqual('input-validation-error-internal-alert');
    expect(results.count).toEqual(1);
    expect(results.textContent).toEqual('Alert test');
    // should add input success message
    await input.evaluate((elem: IdsInput) => {
      elem.removeAllValidationMessages();
      elem.addValidationMessage({ message: 'test', type: 'success', id: 'success' });
    });
    results = await getResults();
    expect(results.msgEl).toBeDefined();
    expect(results.validationId).toEqual('success');
    expect(results.id).toEqual('input-validation-error-internal-success');
    expect(results.count).toEqual(1);
    expect(results.textContent).toEqual('Success test');
    // should add input info message
    await input.evaluate((elem: IdsInput) => {
      elem.removeAllValidationMessages();
      elem.addValidationMessage({ message: 'test', type: 'info', id: 'info' });
    });
    results = await getResults();
    expect(results.msgEl).toBeDefined();
    expect(results.validationId).toEqual('info');
    expect(results.id).toEqual('input-validation-error-internal-info');
    expect(results.count).toEqual(1);
    expect(results.textContent).toEqual('Info test');
    // should add input default icon message
    await input.evaluate((elem: IdsInput) => {
      elem.removeAllValidationMessages();
      elem.addValidationMessage({ message: 'test', type: 'icon', id: 'icon' });
    });
    results = await getResults();
    expect(results.msgEl).toBeDefined();
    expect(results.validationId).toEqual('icon');
    expect(results.id).toEqual('input-validation-error-internal-icon');
    expect(results.count).toEqual(1);
    expect(results.textContent).toEqual('test');
    // should add input custom icon message
    await input.evaluate((elem: IdsInput) => {
      elem.removeAllValidationMessages();
      elem.addValidationMessage({
        message: 'test', type: 'icon', id: 'icon-custom', icon: 'mail'
      });
    });
    results = await getResults();
    expect(results.msgEl).toBeDefined();
    expect(results.validationId).toEqual('icon-custom');
    expect(results.id).toEqual('input-validation-error-internal-icon');
    expect(results.count).toEqual(1);
    expect(results.textContent).toEqual('test');
  });

  test('should remove disabled on message', async ({ page }) => {
    const input = await page.locator('ids-input').first();
    await input.evaluate((elem: IdsInput) => {
      elem.addValidationMessage({
        message: 'test',
        type: 'icon',
        id: 'icon-custom',
        icon: 'mail'
      });
      elem.disabled = true;
    });
    expect(await input.evaluate(
      (elem: IdsInput) => elem.container?.querySelector('.validation-message')?.classList.contains('disabled')
    )).toBeTruthy();
    await input.evaluate((elem: IdsInput) => {
      elem.disabled = false;
    });
    expect(await input.evaluate(
      (elem: IdsInput) => elem.container?.querySelector('.validation-message')?.classList.contains('disabled')
    )).toBeFalsy();
  });

  test('should destroy validation', async ({ page }) => {
    const input = await page.locator('ids-input').first();
    await input.evaluate((elem: IdsInput) => {
      elem.validate = 'required';
      elem.template();
    });
    expect(await input.getAttribute('validate')).toEqual('required');
    expect(await input.evaluate((elem: IdsInput) => elem.validate)).toEqual('required');
    expect(await input.evaluate(
      (elem: IdsInput) => elem.labelEl?.classList?.contains('required')
    )).toBeTruthy();
    await input.evaluate((elem: IdsInput) => {
      elem.validate = null;
      elem.destroyValidation();
    });
    expect(await input.getAttribute('validate')).toBeNull();
    expect(await input.evaluate((elem: IdsInput) => elem.validate)).toBeNull();
    expect(await input.evaluate(
      (elem: IdsInput) => elem.labelEl?.classList?.contains('required')
    )).toBeFalsy();
  });

  test('should remove all the messages from input', async ({ page }) => {
    const input = await page.locator('ids-input').first();
    await input.evaluate((elem: IdsInput) => {
      elem.validate = 'required';
      elem.template();
    });
    expect(await input.getAttribute('validate')).toEqual('required');
    expect(await input.evaluate((elem: IdsInput) => elem.validate)).toEqual('required');
    expect(await input.evaluate(
      (elem: IdsInput) => elem.labelEl?.classList?.contains('required')
    )).toBeTruthy();
    await input.evaluate((elem: IdsInput) => {
      elem.checkValidation();
    });
    expect(await input.evaluate(
      (elem: IdsInput) => elem.container?.querySelector('.validation-message')?.getAttribute('validation-id')
    )).toBe('required');
    await input.evaluate((elem: IdsInput) => {
      elem.removeAllValidationMessages();
    });
    expect(await input.evaluate(
      (elem: IdsInput) => elem.container?.querySelector('.validation-message')
    )).toBeNull();
  });

  test('should not error if no input', async ({ page }) => {
    const input = await page.locator('ids-input').first();
    let hasConsoleError = false;
    page.on('console', (message) => {
      if (message.type() === 'error') {
        hasConsoleError = true;
      }
    });
    await input.evaluate((elem: IdsInput) => {
      elem.input?.remove();
      elem.checkValidation();
    });
    expect(hasConsoleError).toBeFalsy();
  });

  test('should add/remove custom validation rules', async ({ page }) => {
    const input = await page.locator('ids-input').first();
    const id = {
      one: 'my-custom-uppercase',
      two: 'no-numbers',
      three: 'no-special-characters'
    };
    expect(await input.getAttribute('validate')).toBeNull();
    expect(await input.evaluate((elem: IdsInput) => elem.validate)).toBeNull();
    expect(await input.evaluate(
      (elem: IdsInput) => elem.container?.querySelectorAll('.validation-message').length
    )).toEqual(0);
    // Custom Rule (uppercase)
    await input.evaluate((elem: IdsInput) => {
      // Custom Rule (uppercase)
      const myCustomRule1 = {
        check: (el: any) => {
          const val = el.value;
          return /^[A-Z]*$/.test(val);
        },
        message: 'Only uppercase letters allowed',
        type: 'error',
        id: 'my-custom-uppercase'
      };
      elem.addValidationRule(myCustomRule1);
    });
    expect(await input.getAttribute('validate')).toEqual(id.one);
    expect(await input.evaluate((elem: IdsInput) => elem.validate)).toEqual(id.one);
    expect(await input.evaluate(
      (elem: IdsInput) => elem.container?.querySelectorAll('.validation-message').length
    )).toEqual(0);
    await input.evaluate((elem: IdsInput) => {
      elem.input!.value = 'test';
      elem.checkValidation();
    });
    expect(await input.evaluate(
      (elem: IdsInput) => elem.container?.querySelectorAll('.validation-message').length
    )).toEqual(1);
    expect(await input.evaluate(
      (elem: IdsInput) => elem.container?.querySelector('.validation-message')?.getAttribute('validation-id')
    )).toEqual(id.one);
    await input.evaluate((elem: IdsInput, arg) => {
      elem.removeValidationRule(arg.one);
    }, id);
    expect(await input.getAttribute('validate')).toBeNull();
    expect(await input.evaluate((elem: IdsInput) => elem.validate)).toBeNull();
    expect(await input.evaluate(
      (elem: IdsInput) => elem.container?.querySelectorAll('.validation-message').length
    )).toEqual(0);

    await input.evaluate((elem: IdsInput) => {
      // Custom Rule (no-numbers)
      const myCustomRule2 = {
        check: (el: any) => {
          const val = el.value;
          return !(/[\d]+/.test(val));
        },
        message: 'No numbers allowed',
        type: 'error',
        id: 'no-numbers'
      };
      // Custom Rule (no-special-characters)
      const myCustomRule3 = {
        check: (el: any) => {
          const val = el.value;
          return !(/[!@#\\$%\\^\\&*\\)\\(+=._-]+/.test(val));
        },
        message: 'No special characters allowed',
        type: 'error',
        id: 'no-special-characters'
      };
      elem.addValidationRule([myCustomRule2, myCustomRule3]);
    });
    expect(await input.getAttribute('validate')).toEqual(`${id.two} ${id.three}`);
    expect(await input.evaluate((elem: IdsInput) => elem.validate)).toEqual(`${id.two} ${id.three}`);
    expect(await input.evaluate(
      (elem: IdsInput) => elem.container?.querySelectorAll('.validation-message').length
    )).toEqual(0);
    await input.evaluate((elem: IdsInput) => {
      elem.input!.value = '2@';
      elem.checkValidation();
    });
    expect(await input.evaluate(
      (elem: IdsInput) => elem.container?.querySelectorAll('.validation-message').length
    )).toEqual(2);
    expect(await input.evaluate(
      (elem: IdsInput) => elem.container?.querySelectorAll('.validation-message')[0]?.getAttribute('validation-id')
    )).toEqual(id.two);
    expect(await input.evaluate(
      (elem: IdsInput) => elem.container?.querySelectorAll('.validation-message')[1]?.getAttribute('validation-id')
    )).toEqual(id.three);
    await input.evaluate((elem: IdsInput, arg) => {
      elem.removeValidationRule(arg.two);
    }, id);
    expect(await input.getAttribute('validate')).toEqual(id.three);
    expect(await input.evaluate((elem: IdsInput) => elem.validate)).toEqual(id.three);
    expect(await input.evaluate(
      (elem: IdsInput) => elem.container?.querySelectorAll('.validation-message').length
    )).toEqual(1);
    expect(await input.evaluate(
      (elem: IdsInput) => elem.container?.querySelector('.validation-message')?.getAttribute('validation-id')
    )).toEqual(id.three);
    await input.evaluate((elem: IdsInput) => {
      // Custom Rule (no-numbers)
      const myCustomRule2 = {
        check: (el: any) => {
          const val = el.value;
          return !(/[\d]+/.test(val));
        },
        message: 'No numbers allowed',
        type: 'error',
        id: 'no-numbers'
      };
      elem.addValidationRule(myCustomRule2);
      elem.checkValidation();
    });
    expect(await input.getAttribute('validate')).toEqual(`${id.three} ${id.two}`);
    expect(await input.evaluate((elem: IdsInput) => elem.validate)).toEqual(`${id.three} ${id.two}`);
    expect(await input.evaluate(
      (elem: IdsInput) => elem.container?.querySelectorAll('.validation-message').length
    )).toEqual(2);
    expect(await input.evaluate(
      (elem: IdsInput) => elem.container?.querySelectorAll('.validation-message')[0]?.getAttribute('validation-id')
    )).toEqual(id.three);
    expect(await input.evaluate(
      (elem: IdsInput) => elem.container?.querySelectorAll('.validation-message')[1]?.getAttribute('validation-id')
    )).toEqual(id.two);
    await input.evaluate((elem: IdsInput, arg) => {
      elem.removeValidationRule([arg.two, arg.three]);
    }, id);
    expect(await input.getAttribute('validate')).toBeNull();
    expect(await input.evaluate((elem: IdsInput) => elem.validate)).toBeNull();
    expect(await input.evaluate(
      (elem: IdsInput) => elem.container?.querySelectorAll('.validation-message').length
    )).toEqual(0);
  });
});
