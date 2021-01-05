/**
 * @jest-environment jsdom
 */
import IdsInput from '../../src/ids-input/ids-input';

let elem = null;

describe('IdsInput Component', () => {
  beforeEach(async () => {
    elem = new IdsInput();
    document.body.appendChild(elem);
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    elem = null;
  });

  it('should add/remove required error', () => {
    elem.validate = 'required';
    elem.template();
    document.body.appendChild(elem);

    expect(elem.getAttribute('validate')).toEqual('required');
    expect(elem.validate).toEqual('required');
    expect(elem.labelEl.classList).toContain('required');
    expect(elem.shadowRoot.querySelector('.validation-message')).toBeFalsy();
    elem.checkValidation();
    const msgEl = elem.shadowRoot.querySelector('.validation-message');
    expect(msgEl).toBeTruthy();
    expect(msgEl.getAttribute('validation-id')).toEqual('required');

    elem.input.value = 'test';
    elem.checkValidation();
    expect(elem.shadowRoot.querySelector('.validation-message')).toBeFalsy();
  });

  it('should add/remove email error', () => {
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

  it('should add/remove required and email error', () => {
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

  it('should add input error message', () => {
    elem.addMessage({});
    elem.addMessage({ message: 'test', type: 'error', id: 'error' });
    const msgEl = elem.shadowRoot.querySelector('.validation-message');
    expect(msgEl).toBeTruthy();
    expect(msgEl.getAttribute('validation-id')).toEqual('error');
    expect(msgEl.textContent).toEqual('Error test');
  });

  it('should add input alert message', () => {
    elem.addMessage({ message: 'test', type: 'alert', id: 'alert' });
    const msgEl = elem.shadowRoot.querySelector('.validation-message');
    expect(msgEl).toBeTruthy();
    expect(msgEl.getAttribute('validation-id')).toEqual('alert');
    expect(msgEl.textContent).toEqual('Alert test');
  });

  it('should add input success message', () => {
    elem.addMessage({ message: 'test', type: 'success', id: 'success' });
    const msgEl = elem.shadowRoot.querySelector('.validation-message');
    expect(msgEl).toBeTruthy();
    expect(msgEl.getAttribute('validation-id')).toEqual('success');
    expect(msgEl.textContent).toEqual('Success test');
  });

  it('should add input info message', () => {
    elem.addMessage({ message: 'test', type: 'info', id: 'info' });
    const msgEl = elem.shadowRoot.querySelector('.validation-message');
    expect(msgEl).toBeTruthy();
    expect(msgEl.getAttribute('validation-id')).toEqual('info');
    expect(msgEl.textContent).toEqual('Info test');
  });

  it('should add input default icon message', () => {
    elem.addMessage({ message: 'test', type: 'icon', id: 'icon' });
    const msgEl = elem.shadowRoot.querySelector('.validation-message');
    expect(msgEl).toBeTruthy();
    expect(msgEl.getAttribute('validation-id')).toEqual('icon');
    expect(msgEl.textContent).toEqual('test');
  });

  it('should add input custom icon message', () => {
    elem.addMessage({ message: 'test', type: 'icon', id: 'icon-custom', icon: 'mail' });// eslint-disable-line
    const msgEl = elem.shadowRoot.querySelector('.validation-message');
    expect(msgEl).toBeTruthy();
    expect(msgEl.getAttribute('validation-id')).toEqual('icon-custom');
    expect(msgEl.textContent).toEqual('test');
  });

  it('should remove disabled on message', () => {
    elem.addMessage({
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

  it('should destroy validation', () => {
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

  it('should remove all the messages from input', () => {
    elem.validate = 'required';
    elem.template();
    document.body.appendChild(elem);

    expect(elem.getAttribute('validate')).toEqual('required');
    expect(elem.validate).toEqual('required');
    expect(elem.labelEl.classList).toContain('required');
    expect(elem.shadowRoot.querySelector('.validation-message')).toBeFalsy();
    elem.checkValidation();
    let msgEl = elem.shadowRoot.querySelector('.validation-message');
    expect(msgEl).toBeTruthy();
    expect(msgEl.getAttribute('validation-id')).toEqual('required');
    elem.removeAllMessages();
    msgEl = elem.shadowRoot.querySelector('.validation-message');
    expect(msgEl).toBeFalsy();
  });

  it('should not error for input', () => {
    elem.input.remove();
    elem.input = null;
    elem.checkValidation();
  });
});
