/**
 * @jest-environment jsdom
 */
import '../../src/components/ids-input/ids-input';

describe.skip('IdsInput Component', () => {
  let elem: any = null;

  beforeEach(async () => {
    const template = document.createElement('template');
    template.innerHTML = '<ids-input label="testing input"></ids-input>';
    elem = template.content.childNodes[0];
    document.body.appendChild(elem);
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    elem = null;
  });

  test('should add/remove required error', async () => {
    elem.validate = 'required';
    elem.template();

    expect(elem.getAttribute('validate')).toEqual('required');
    expect(elem.validate).toEqual('required');
    expect(elem.labelEl.classList).toContain('required');
    expect(elem.shadowRoot.querySelector('.validation-message')).toBeFalsy();
    expect(elem.validationMessagesCount).toEqual(0);
    elem.checkValidation();

    const msgEl = elem.shadowRoot.querySelector('.validation-message');
    expect(elem.input.getAttribute('aria-invalid')).toEqual('true');
    expect(elem.input.getAttribute('aria-describedby')).toEqual('ids-input-0-input-error');
    expect(msgEl).toBeTruthy();
    expect(msgEl.getAttribute('validation-id')).toEqual('required');
    expect(msgEl.getAttribute('id')).toEqual('ids-input-0-input-error');
    expect(elem.validationMessagesCount).toEqual(1);

    elem.input.value = 'test';
    elem.checkValidation();
    expect(elem.shadowRoot.querySelector('.validation-message')).toBeFalsy();
    expect(elem.getAttribute('aria-invalid')).toEqual(null);
    expect(elem.getAttribute('aria-describedby')).toEqual(null);
    expect(elem.validationMessagesCount).toEqual(0);
  });

  test('should add/remove required error on disabled', () => {
    elem.validate = 'required';
    elem.disabled = true;
    elem.template();
    document.body.appendChild(elem);

    elem.checkValidation();

    const msgEl = elem.shadowRoot.querySelector('.validation-message');
    expect(msgEl).toBeTruthy();
  });

  test('should add/remove manually message', () => {
    expect(elem.shadowRoot.querySelectorAll('.validation-message').length).toEqual(0);
    elem.addValidationMessage({
      message: 'Something is wrong do not continue',
      type: 'error',
      id: 'error'
    });

    expect(elem.shadowRoot.querySelectorAll('.validation-message').length).toEqual(1);
    elem.removeValidationMessage({ id: 'error' });

    expect(elem.shadowRoot.querySelectorAll('.validation-message').length).toEqual(0);
    elem.addValidationMessage([{
      message: 'Something is wrong do not continue',
      type: 'error',
      id: 'error'
    }, {
      message: 'Warning the value may be incorrect',
      type: 'alert',
      id: 'alert'
    }]);

    expect(elem.shadowRoot.querySelectorAll('.validation-message').length).toEqual(2);
    elem.removeValidationMessage([{ id: 'error' }, { id: 'alert' }]);

    expect(elem.shadowRoot.querySelectorAll('.validation-message').length).toEqual(0);
    elem.addValidationMessage([{
      message: 'Something is wrong do not continue',
      type: 'error',
      id: 'error-1'
    }, {
      message: 'Something else also wrong do not continue',
      type: 'error',
      id: 'error-2'
    }]);

    expect(elem.shadowRoot.querySelectorAll('.validation-message').length).toEqual(2);
    elem.removeValidationMessage({ type: 'error' });

    expect(elem.shadowRoot.querySelectorAll('.validation-message').length).toEqual(0);
    elem.addValidationMessage({
      message: 'Something is wrong do not continue',
      type: 'error'
    });

    expect(elem.shadowRoot.querySelectorAll('.validation-message').length).toEqual(0);
  });

  test('should add validation messages manually thru markup', async () => {
    document.body.innerHTML = '';
    elem = null;

    const template = document.createElement('template');
    template.innerHTML = `<ids-input
      label="testing input"
      value="Some text"
      validation-id="icon-custom-manually"
      validation-type="icon"
      validation-message="Something about your mail information"
      validation-icon="mail"
    ></ids-input>`;
    elem = template.content.childNodes[0];
    document.body.appendChild(elem);

    expect(elem.shadowRoot.querySelectorAll('.validation-message').length).toEqual(1);
    expect(elem.validationMessagesCount).toEqual(1);
    elem.removeValidationMessage({ id: 'icon-custom-manually' });

    expect(elem.shadowRoot.querySelectorAll('.validation-message').length).toEqual(0);
    expect(elem.validationMessagesCount).toEqual(0);
  });

  test('should skip if it already has an error', () => {
    elem.validate = 'required';
    elem.template();
    document.body.appendChild(elem);

    expect(elem.shadowRoot.querySelectorAll('.validation-message').length).toEqual(0);
    elem.checkValidation();
    elem.checkValidation();
    elem.checkValidation();

    expect(elem.shadowRoot.querySelectorAll('.validation-message').length).toEqual(1);
  });

  test('should not error on invalid types', () => {
    elem.validate = 'required';
    elem.template();
    document.body.appendChild(elem);

    expect(elem.shadowRoot.querySelectorAll('.validation-message').length).toEqual(0);
    elem.addValidationMessage({ type: 'xxx', id: 'xx', icon: '' });
    elem.addValidationMessage({ type: 'icon', id: 'xx', icon: '' });

    expect(elem.shadowRoot.querySelectorAll('.validation-message').length).toEqual(1);
  });

  test('should set validation events', () => {
    expect(elem.getAttribute('validate')).toEqual(null);
    expect(elem.getAttribute('validation-events')).toEqual(null);
    elem.validate = 'required';
    elem.validationEvents = 'blur';
    expect(elem.getAttribute('validate')).toEqual('required');
    expect(elem.getAttribute('validation-events')).toEqual('blur');
    elem.validationEvents = null;
    expect(elem.getAttribute('validate')).toEqual('required');
    expect(elem.getAttribute('validation-events')).toEqual(null);
    elem.validate = null;
    expect(elem.getAttribute('validate')).toEqual(null);
    expect(elem.getAttribute('validation-events')).toEqual(null);
  });

  test('should add/remove email error', () => {
    elem.validate = 'email';
    elem.template();
    document.body.appendChild(elem);

    expect(elem.getAttribute('validate')).toEqual('email');
    expect(elem.validate).toEqual('email');
    expect(elem.shadowRoot.querySelector('.validation-message')).toBeFalsy();
    elem.input.value = 'test';
    elem.checkValidation();
    const msgEl = elem.shadowRoot.querySelector('.validation-message');
    expect(msgEl).toBeTruthy();
    expect(msgEl.getAttribute('validation-id')).toEqual('email');

    // elem.input.focus();
    elem.input.dispatchEvent(new Event('focus'));
    elem.input.value = 'test@test.com';
    elem.input.dispatchEvent(new Event('blur'));
    // elem.input.blur();
    elem.checkValidation();
    expect(elem.shadowRoot.querySelector('.validation-message')).toBeFalsy();
  });

  test('should add/remove required and email error', () => {
    elem.validate = 'required email';
    elem.template();
    document.body.appendChild(elem);

    expect(elem.getAttribute('validate')).toEqual('required email');
    expect(elem.validate).toEqual('required email');
    expect(elem.shadowRoot.querySelector('.validation-message')).toBeFalsy();
    elem.input.value = '';
    elem.checkValidation();
    let msgEl = elem.shadowRoot.querySelector('.validation-message');
    expect(msgEl).toBeTruthy();
    expect(msgEl.getAttribute('validation-id')).toEqual('required');

    elem.input.value = 'test';
    elem.checkValidation();
    msgEl = elem.shadowRoot.querySelector('.validation-message');
    expect(msgEl).toBeTruthy();
    expect(msgEl.getAttribute('validation-id')).toEqual('email');

    elem.input.value = 'test@test.com';
    elem.checkValidation();
    expect(elem.shadowRoot.querySelector('.validation-message')).toBeFalsy();
  });

  test('should add input error message', () => {
    elem.addValidationMessage({});
    elem.addValidationMessage({ message: 'test', type: 'error', id: 'error' });
    const msgEl = elem.shadowRoot.querySelector('.validation-message');
    expect(msgEl).toBeTruthy();
    expect(msgEl.getAttribute('validation-id')).toEqual('error');
    expect(msgEl.textContent).toEqual('Error test');
  });

  test('should add input alert message', () => {
    elem.addValidationMessage({ message: 'test', type: 'alert', id: 'alert' });
    const msgEl = elem.shadowRoot.querySelector('.validation-message');
    expect(msgEl).toBeTruthy();
    expect(msgEl.getAttribute('validation-id')).toEqual('alert');
    expect(msgEl.textContent).toEqual('Alert test');
  });

  test('should add input success message', () => {
    elem.addValidationMessage({ message: 'test', type: 'success', id: 'success' });
    const msgEl = elem.shadowRoot.querySelector('.validation-message');
    expect(msgEl).toBeTruthy();
    expect(msgEl.getAttribute('validation-id')).toEqual('success');
    expect(msgEl.textContent).toEqual('Success test');
  });

  test('should add input info message', () => {
    elem.addValidationMessage({ message: 'test', type: 'info', id: 'info' });
    const msgEl = elem.shadowRoot.querySelector('.validation-message');
    expect(msgEl).toBeTruthy();
    expect(msgEl.getAttribute('validation-id')).toEqual('info');
    expect(msgEl.textContent).toEqual('Info test');
  });

  test('should add input default icon message', () => {
    elem.addValidationMessage({ message: 'test', type: 'icon', id: 'icon' });
    const msgEl = elem.shadowRoot.querySelector('.validation-message');
    expect(msgEl).toBeTruthy();
    expect(msgEl.getAttribute('validation-id')).toEqual('icon');
    expect(msgEl.textContent).toEqual('test');
  });

  test('should add input custom icon message', () => {
    elem.addValidationMessage({ message: 'test', type: 'icon', id: 'icon-custom', icon: 'mail' });// eslint-disable-line
    const msgEl = elem.shadowRoot.querySelector('.validation-message');
    expect(msgEl).toBeTruthy();
    expect(msgEl.getAttribute('validation-id')).toEqual('icon-custom');
    expect(msgEl.textContent).toEqual('test');
  });

  test('should remove disabled on message', () => {
    elem.addValidationMessage({
      message: 'test',
      type: 'icon',
      id: 'icon-custom',
      icon: 'mail'
    });

    const msgEl = elem.shadowRoot.querySelector('.validation-message');
    elem.disabled = true;

    expect(msgEl.classList.contains('disabled')).toEqual(true);
    elem.disabled = false;
    expect(msgEl.classList.contains('disabled')).toEqual(false);
  });

  test('should destroy validation', () => {
    elem.validate = 'required';
    elem.template();
    document.body.appendChild(elem);
    expect(elem.getAttribute('validate')).toEqual('required');
    expect(elem.validate).toEqual('required');
    expect(elem.labelEl.classList).toContain('required');

    elem.validate = null;
    elem.destroyValidation();
    expect(elem.getAttribute('validate')).toEqual(null);
    expect(elem.validate).not.toEqual('required');
    expect(elem.labelEl.classList).not.toContain('required');
  });

  test('should remove all the messages from input', () => {
    elem.validate = 'required';
    elem.template();

    expect(elem.getAttribute('validate')).toEqual('required');
    expect(elem.validate).toEqual('required');
    expect(elem.labelEl.classList).toContain('required');
    expect(elem.shadowRoot.querySelector('.validation-message')).toBeFalsy();
    elem.checkValidation();
    let msgEl = elem.shadowRoot.querySelector('.validation-message');
    expect(msgEl).toBeTruthy();
    expect(msgEl.getAttribute('validation-id')).toEqual('required');
    elem.removeAllValidationMessages();
    msgEl = elem.shadowRoot.querySelector('.validation-message');
    expect(msgEl).toBeFalsy();
  });

  test('should not error for input', () => {
    elem.input.remove();
    elem.checkValidation();
  });

  test('should add/remove custom validation rules', () => {
    // Custom Rule (uppercase)
    const myCustomRule1 = {
      check: (input: any) => {
        const val = input.value;
        return /^[A-Z]*$/.test(val);
      },
      message: 'Only uppercase letters allowed',
      type: 'error',
      id: 'my-custom-uppercase'
    };
    // Custom Rule (no-numbers)
    const myCustomRule2 = {
      check: (input: any) => {
        const val = input.value;
        return !(/[\d]+/.test(val));
      },
      message: 'No numbers allowed',
      type: 'error',
      id: 'no-numbers'
    };
    // Custom Rule (no-special-characters)
    const myCustomRule3 = {
      check: (input: any) => {
        const val = input.value;
        return !(/[!@#\\$%\\^\\&*\\)\\(+=._-]+/.test(val));
      },
      message: 'No special characters allowed',
      type: 'error',
      id: 'no-special-characters'
    };
    const id = {
      one: 'my-custom-uppercase',
      two: 'no-numbers',
      three: 'no-special-characters'
    };
    expect(elem.getAttribute('validate')).toEqual(null);
    expect(elem.validate).toEqual(null);
    expect(elem.shadowRoot.querySelectorAll('.validation-message').length).toEqual(0);
    elem.addValidationRule(myCustomRule1);
    expect(elem.getAttribute('validate')).toEqual(id.one);
    expect(elem.validate).toEqual(id.one);
    expect(elem.shadowRoot.querySelectorAll('.validation-message').length).toEqual(0);
    elem.input.value = 'test';
    elem.checkValidation();
    let msgEl = elem.shadowRoot.querySelectorAll('.validation-message');
    expect(msgEl.length).toEqual(1);
    expect(msgEl[0].getAttribute('validation-id')).toEqual(id.one);
    elem.removeValidationRule(id.one);
    expect(elem.getAttribute('validate')).toEqual(null);
    expect(elem.validate).toEqual(null);
    expect(elem.shadowRoot.querySelectorAll('.validation-message').length).toEqual(0);

    elem.addValidationRule([myCustomRule2, myCustomRule3]);
    expect(elem.getAttribute('validate')).toEqual(`${id.two} ${id.three}`);
    expect(elem.validate).toEqual(`${id.two} ${id.three}`);
    expect(elem.shadowRoot.querySelectorAll('.validation-message').length).toEqual(0);
    elem.input.value = '2@';
    elem.checkValidation();
    msgEl = elem.shadowRoot.querySelectorAll('.validation-message');
    expect(msgEl.length).toEqual(2);
    expect(msgEl[0].getAttribute('validation-id')).toEqual(id.two);
    expect(msgEl[1].getAttribute('validation-id')).toEqual(id.three);
    elem.removeValidationRule(id.two);
    msgEl = elem.shadowRoot.querySelectorAll('.validation-message');
    expect(msgEl.length).toEqual(1);
    expect(msgEl[0].getAttribute('validation-id')).toEqual(id.three);
    expect(elem.getAttribute('validate')).toEqual(id.three);
    expect(elem.validate).toEqual(id.three);
    elem.addValidationRule(myCustomRule2);
    elem.checkValidation();
    expect(elem.getAttribute('validate')).toEqual(`${id.three} ${id.two}`);
    expect(elem.validate).toEqual(`${id.three} ${id.two}`);
    msgEl = elem.shadowRoot.querySelectorAll('.validation-message');
    expect(msgEl.length).toEqual(2);
    expect(msgEl[0].getAttribute('validation-id')).toEqual(id.three);
    expect(msgEl[1].getAttribute('validation-id')).toEqual(id.two);
    elem.removeValidationRule([id.two, id.three]);
    expect(elem.getAttribute('validate')).toEqual(null);
    expect(elem.validate).toEqual(null);
    expect(elem.shadowRoot.querySelectorAll('.validation-message').length).toEqual(0);
  });
});
