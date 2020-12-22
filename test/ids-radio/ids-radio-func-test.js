/**
 * @jest-environment jsdom
 */
import IdsRadio from '../../src/ids-radio/ids-radio';

describe('IdsRadio Component', () => {
  let rb;

  beforeEach(async () => {
    const elem = new IdsRadio();
    document.body.appendChild(elem);
    rb = document.querySelector('ids-radio');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    const elem = new IdsRadio();
    document.body.appendChild(elem);
    elem.remove();
    expect(document.querySelectorAll('ids-radio').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('should renders checked', () => {
    rb.checked = 'true';
    expect(rb.getAttribute('checked')).toEqual('true');
    expect(rb.checked).toEqual('true');
  });

  it('should renders as disabled', () => {
    expect(rb.getAttribute('disabled')).toEqual(null);
    expect(rb.input.hasAttribute('disabled')).toBe(false);
    let rootEl = rb.shadowRoot.querySelector('.ids-radio');
    expect(rootEl.classList).not.toContain('disabled');
    rb.disabled = true;
    expect(rb.getAttribute('disabled')).toEqual('true');
    expect(rb.input.hasAttribute('disabled')).toBe(true);
    rootEl = rb.shadowRoot.querySelector('.ids-radio');
    expect(rootEl.classList).toContain('disabled');
    expect(rootEl.getAttribute('tabindex')).toEqual('-1');
    rb.disabled = false;
    expect(rb.getAttribute('disabled')).toEqual(null);
    expect(rb.input.hasAttribute('disabled')).toBe(false);
    rootEl = rb.shadowRoot.querySelector('.ids-radio');
    expect(rootEl.classList).not.toContain('disabled');
  });

  it('should renders as group disabled', () => {
    expect(rb.getAttribute('group-disabled')).toEqual(null);
    expect(rb.input.hasAttribute('disabled')).toBe(false);
    let rootEl = rb.shadowRoot.querySelector('.ids-radio');
    expect(rootEl.classList).not.toContain('disabled');
    rb.groupDisabled = true;
    expect(rb.getAttribute('group-disabled')).toEqual('true');
    expect(rb.input.hasAttribute('disabled')).toBe(true);
    rootEl = rb.shadowRoot.querySelector('.ids-radio');
    expect(rootEl.classList).toContain('disabled');
    expect(rootEl.getAttribute('tabindex')).toEqual('-1');
    rb.groupDisabled = false;
    expect(rb.getAttribute('group-disabled')).toEqual(null);
    expect(rb.input.hasAttribute('disabled')).toBe(false);
    rootEl = rb.shadowRoot.querySelector('.ids-radio');
    expect(rootEl.classList).not.toContain('disabled');
  });

  it('should renders as validation has-error', () => {
    expect(rb.getAttribute('validation-has-error')).toEqual(null);
    expect(rb.input.classList).not.toContain('error');
    expect(rb.validationHasError).toBe(null);
    rb.validationHasError = true;
    expect(rb.getAttribute('validation-has-error')).toEqual('true');
    expect(rb.input.classList).toContain('error');
    expect(rb.validationHasError).toBe('true');
    rb.validationHasError = false;
    expect(rb.getAttribute('validation-has-error')).toEqual(null);
    expect(rb.input.classList).not.toContain('error');
    expect(rb.validationHasError).toBe(null);
  });

  it('should set label text', () => {
    let label = rb.labelEl.querySelector('.label-text');
    label.remove();
    rb.label = 'test';

    document.body.innerHTML = '';
    const elem = new IdsRadio();
    document.body.appendChild(elem);
    rb = document.querySelector('ids-radio');
    label = rb.labelEl.querySelector('.label-text');
    expect(label.textContent.trim()).toBe('');
    rb.label = 'test';
    label = rb.labelEl.querySelector('.label-text');
    expect(label.textContent.trim()).toBe('test');
    rb.label = null;
    label = rb.labelEl.querySelector('.label-text');
    expect(label.textContent.trim()).toBe('');
  });

  it('should set label font size', () => {
    let label = rb.labelEl.querySelector('.label-text');
    label.remove();
    rb.labelFontSize = 'base';
    document.body.innerHTML = '';
    const elem = new IdsRadio();
    document.body.appendChild(elem);
    rb = document.querySelector('ids-radio');
    label = rb.labelEl.querySelector('.label-text');
    expect(label.getAttribute('font-size')).toBe(null);
    rb.labelFontSize = 'lg';
    label = rb.labelEl.querySelector('.label-text');
    expect(label.getAttribute('font-size')).toBe('lg');
    rb.labelFontSize = null;
    label = rb.labelEl.querySelector('.label-text');
    expect(label.getAttribute('font-size')).toBe(null);
  });

  it('should renders colored', () => {
    const color = 'emerald07';
    let rootEl = rb.shadowRoot.querySelector('.ids-radio');
    expect(rootEl.getAttribute('color')).toEqual(null);
    expect(rb.getAttribute('color')).toEqual(null);
    rb.color = color;
    rootEl = rb.shadowRoot.querySelector('.ids-radio');
    expect(rootEl.getAttribute('color')).toEqual(color);
    expect(rb.getAttribute('color')).toEqual(color);
    rb.color = false;
    rootEl = rb.shadowRoot.querySelector('.ids-radio');
    expect(rootEl.getAttribute('color')).toEqual(null);
    expect(rb.getAttribute('color')).toEqual(null);
    expect(rb.color).toEqual(null);
  });

  it('should renders value', () => {
    const value = 'test';
    expect(rb.getAttribute('value')).toEqual(null);
    rb.value = value;
    expect(rb.getAttribute('value')).toEqual(value);
    expect(rb.input.value).toEqual(value);
    rb.value = null;
    expect(rb.getAttribute('value')).toEqual(null);
  });

  it('should rander display horizontal', () => {
    let rootEl = rb.shadowRoot.querySelector('.ids-radio');
    expect(rootEl.classList).not.toContain('horizontal');
    expect(rb.getAttribute('horizontal')).toEqual(null);
    rb.horizontal = true;
    rootEl = rb.shadowRoot.querySelector('.ids-radio');
    expect(rootEl.classList).toContain('horizontal');
    expect(rb.getAttribute('horizontal')).toEqual('true');
    rb.horizontal = false;
    rootEl = rb.shadowRoot.querySelector('.ids-radio');
    expect(rootEl.classList).not.toContain('horizontal');
    expect(rb.getAttribute('horizontal')).toEqual(null);
    expect(rb.horizontal).toEqual(null);
  });

  it('should dispatch native events', () => {
    const events = ['change', 'focus', 'keydown', 'keypress', 'keyup', 'click', 'dbclick'];
    events.forEach((evt) => {
      let response = null;
      rb.addEventListener(`trigger${evt}`, () => {
        response = 'triggered';
      });
      const event = new Event(evt);
      rb.input.dispatchEvent(event);
      expect(response).toEqual('triggered');
    });
  });

  it('should remove events', () => {
    rb.input = null;
    document.body.innerHTML = '';
    const elem = new IdsRadio();
    document.body.appendChild(elem);
    rb = document.querySelector('ids-radio');

    rb.handleRadioChangeEvent('remove');
    rb.handleNativeEvents('remove');
    const events = ['change', 'focus', 'keydown', 'keypress', 'keyup', 'click', 'dbclick'];
    events.forEach((evt) => {
      let response = null;
      rb.addEventListener(`trigger${evt}`, () => {
        response = 'triggered';
      });
      const event = new Event(evt);
      rb.input.dispatchEvent(event);
      expect(response).not.toEqual('triggered');
    });
  });

  it('should renders template', () => {
    document.body.innerHTML = '';
    rb = document.createElement('ids-radio');
    rb.setAttribute('disabled', true);
    rb.setAttribute('horizontal', true);
    rb.setAttribute('checked', true);
    rb.setAttribute('label-font-size', 'lg');
    rb.template();
    expect(rb.getAttribute('disabled')).toEqual('true');
    expect(rb.input.hasAttribute('disabled')).toBe(true);
    const rootEl = rb.shadowRoot.querySelector('.ids-radio');
    expect(rootEl.classList).toContain('disabled');
    expect(rootEl.classList).toContain('horizontal');
    expect(rb.getAttribute('horizontal')).toEqual('true');
    expect(rb.getAttribute('checked')).toEqual('true');
    expect(rb.checked).toEqual('true');
  });
});
