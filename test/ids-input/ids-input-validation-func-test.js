/**
 * @jest-environment jsdom
 */
import IdsInput from '../../src/components/ids-input/ids-input';

let elem = null;

const processAnimFrame = () => new Promise((resolve) => {
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(resolve);
  });
});

describe('IdsInput Component', () => {
  beforeEach(async () => {
    const template = document.createElement('template');
    template.innerHTML = '<ids-input label="testing input"></ids-input>';
    elem = template.content.childNodes[0];
    document.body.appendChild(elem);
    await processAnimFrame();
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    elem = null;
  });

  it('should add/remove required error', async () => {
    elem.validate = 'required';
    elem.template();
    await processAnimFrame();

    expect(elem.getAttribute('validate')).toEqual('required');
    expect(elem.validate).toEqual('required');
    expect(elem.labelEl.classList).toContain('required');
    expect(elem.shadowRoot.querySelector('.validation-message')).toBeFalsy();
    elem.checkValidation();

    const msgEl = elem.shadowRoot.querySelector('.validation-message');
    expect(elem.input.getAttribute('aria-invalid')).toEqual('true');
    expect(elem.input.getAttribute('aria-describedby')).toEqual('ids-input-1-input-error');
    expect(msgEl).toBeTruthy();
    expect(msgEl.getAttribute('validation-id')).toEqual('required');
    expect(msgEl.getAttribute('id')).toEqual('ids-input-1-input-error');

    elem.input.value = 'test';
    elem.checkValidation();
    expect(elem.shadowRoot.querySelector('.validation-message')).toBeFalsy();
    expect(elem.getAttribute('aria-invalid')).toEqual(null);
    expect(elem.getAttribute('aria-describedby')).toEqual(null);
  });

  it('should add/remove required error on disabled', () => {
    elem.validate = 'required';
    elem.disabled = true;
    elem.template();
    document.body.appendChild(elem);

    elem.checkValidation();

    const msgEl = elem.shadowRoot.querySelector('.validation-message');
    expect(msgEl).toBeTruthy();
  });

  it('should add/remove manually message', () => {
    expect(elem.shadowRoot.querySelectorAll('.validation-message').length).toEqual(0);
    elem.addMessage({
      message: 'Something is wrong do not continue',
      type: 'error',
      id: 'error'
    });

    expect(elem.shadowRoot.querySelectorAll('.validation-message').length).toEqual(1);
    elem.removeMessage({ id: 'error' });

    expect(elem.shadowRoot.querySelectorAll('.validation-message').length).toEqual(0);
  });

  it('should skip if it already has an error', () => {
    elem.validate = 'required';
    elem.template();
    document.body.appendChild(elem);

    expect(elem.shadowRoot.querySelectorAll('.validation-message').length).toEqual(0);
    elem.checkValidation();
    elem.checkValidation();
    elem.checkValidation();

    expect(elem.shadowRoot.querySelectorAll('.validation-message').length).toEqual(1);
  });

  it('should not error on invalid types', () => {
    elem.validate = 'required';
    elem.template();
    document.body.appendChild(elem);

    expect(elem.shadowRoot.querySelectorAll('.validation-message').length).toEqual(0);
    elem.addMessage({ type: 'xxx', id: 'xx', icon: '' });
    elem.addMessage({ type: 'icon', id: 'xx', icon: '' });

    expect(elem.shadowRoot.querySelectorAll('.validation-message').length).toEqual(1);
  });

  it('should set validation events', () => {
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
    elem.checkValidation();
  });
});
