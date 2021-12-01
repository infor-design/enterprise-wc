/**
 * @jest-environment jsdom
 */
import IdsCheckbox from '../../src/components/ids-checkbox/ids-checkbox';
import IdsContainer from '../../src/components/ids-container/ids-container';

describe('IdsCheckbox Component', () => {
  let cb;
  let container;

  beforeEach(async () => {
    container = new IdsContainer();
    const elem = new IdsCheckbox();
    container.appendChild(elem);
    document.body.appendChild(container);
    cb = document.querySelector('ids-checkbox');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    const elem = new IdsCheckbox();
    document.body.appendChild(elem);
    elem.remove();
    expect(document.querySelectorAll('ids-checkbox').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('should renders checked', () => {
    cb.checked = 'true';
    expect(cb.getAttribute('checked')).toEqual('true');
    expect(cb.checked).toEqual('true');
  });

  it('should dirty tracking', () => {
    expect(cb.getAttribute('dirty-tracker')).toEqual(null);
    expect(cb.shadowRoot.querySelector('.icon-dirty')).toBeFalsy();
    expect(cb.labelEl.querySelector('.msg-dirty')).toBeFalsy();
    cb.dirtyTracker = true;
    expect(cb.getAttribute('dirty-tracker')).toEqual('true');
    expect(cb.shadowRoot.querySelector('.icon-dirty')).toBeFalsy();
    expect(cb.labelEl.querySelector('.msg-dirty')).toBeFalsy();
    cb.checked = true;
    let val = cb.valMethod(cb.input);
    cb.setDirtyTracker(val);
    expect(cb.getAttribute('dirty-tracker')).toEqual('true');
    expect(cb.shadowRoot.querySelector('.icon-dirty')).toBeTruthy();
    expect(cb.labelEl.querySelector('.msg-dirty')).toBeTruthy();
    cb.checked = false;
    val = cb.valMethod(cb.input);
    cb.setDirtyTracker(val);
    expect(cb.getAttribute('dirty-tracker')).toEqual('true');
    expect(cb.shadowRoot.querySelector('.icon-dirty')).toBeFalsy();
    expect(cb.labelEl.querySelector('.msg-dirty')).toBeFalsy();
    cb.dirtyTracker = false;
    expect(cb.getAttribute('dirty-tracker')).toEqual(null);
    expect(cb.shadowRoot.querySelector('.icon-dirty')).toBeFalsy();
    expect(cb.labelEl.querySelector('.msg-dirty')).toBeFalsy();
  });

  it('should renders as disabled', () => {
    expect(cb.getAttribute('disabled')).toEqual(null);
    expect(cb.input.hasAttribute('disabled')).toBe(false);
    let rootEl = cb.shadowRoot.querySelector('.ids-checkbox');
    expect(rootEl.classList).not.toContain('disabled');
    cb.disabled = true;
    expect(cb.getAttribute('disabled')).toEqual('true');
    expect(cb.input.hasAttribute('disabled')).toBe(true);
    rootEl = cb.shadowRoot.querySelector('.ids-checkbox');
    expect(rootEl.classList).toContain('disabled');
    cb.disabled = false;
    expect(cb.getAttribute('disabled')).toEqual(null);
    expect(cb.input.hasAttribute('disabled')).toBe(false);
    rootEl = cb.shadowRoot.querySelector('.ids-checkbox');
    expect(rootEl.classList).not.toContain('disabled');
  });

  it('should renders as label audible', () => {
    expect(cb.getAttribute('label-audible')).toEqual(null);
    let textEl = cb.shadowRoot.querySelector('ids-text');
    expect(textEl.getAttribute('audible')).toEqual(null);

    cb.labelAudible = 'true';
    expect(cb.getAttribute('label-audible')).toEqual('true');
    textEl = cb.shadowRoot.querySelector('ids-text');
    expect(textEl.getAttribute('audible')).toEqual('true');

    cb.labelAudible = 'false';
    expect(cb.getAttribute('label-audible')).toEqual('false');
    textEl = cb.shadowRoot.querySelector('ids-text');
    expect(textEl.getAttribute('audible')).toEqual(null);
  });

  it('should add/remove required error', () => {
    cb.validate = 'required';
    expect(cb.getAttribute('validate')).toEqual('required');
    expect(cb.validate).toEqual('required');
    expect(cb.labelEl.classList).toContain('required');
    expect(cb.shadowRoot.querySelector('.validation-message')).toBeFalsy();
    cb.checkValidation();
    const msgEl = cb.shadowRoot.querySelector('.validation-message');
    expect(msgEl).toBeTruthy();
    expect(msgEl.getAttribute('validation-id')).toEqual('required');
    cb.checked = true;
    cb.checkValidation();
    expect(cb.shadowRoot.querySelector('.validation-message')).toBeFalsy();
  });

  it('should set validation events', () => {
    expect(cb.getAttribute('validate')).toEqual(null);
    expect(cb.getAttribute('validation-events')).toEqual(null);
    cb.validate = 'required';
    cb.validationEvents = 'blur';
    expect(cb.getAttribute('validate')).toEqual('required');
    expect(cb.getAttribute('validation-events')).toEqual('blur');
    cb.validationEvents = null;
    expect(cb.getAttribute('validate')).toEqual('required');
    expect(cb.getAttribute('validation-events')).toEqual(null);
    cb.validate = null;
    expect(cb.getAttribute('validate')).toEqual(null);
    expect(cb.getAttribute('validation-events')).toEqual(null);
  });

  it('should set label required indicator', () => {
    const className = 'no-required-indicator';
    expect(cb.getAttribute('validate')).toEqual(null);
    expect(cb.getAttribute('label-required')).toEqual(null);
    expect(cb.labelEl.classList).not.toContain(className);
    cb.validate = 'required';
    expect(cb.getAttribute('validate')).toEqual('required');
    expect(cb.getAttribute('label-required')).toEqual(null);
    expect(cb.labelEl.classList).not.toContain(className);
    cb.labelRequired = false;
    expect(cb.getAttribute('validate')).toEqual('required');
    expect(cb.getAttribute('label-required')).toEqual(null);
    expect(cb.labelEl.classList).toContain(className);
    expect(cb.labelRequired).toEqual(null);
    cb.labelRequired = true;
    expect(cb.getAttribute('validate')).toEqual('required');
    expect(cb.getAttribute('label-required')).toEqual('true');
    expect(cb.labelEl.classList).not.toContain(className);
    expect(cb.labelRequired).toEqual('true');
  });

  it('should set label text', () => {
    let label = cb.labelEl.querySelector('.label-checkbox');
    label.remove();
    cb.label = 'test';
    cb.radioCheckbox = false;
    document.body.innerHTML = '';
    const elem = new IdsCheckbox();
    document.body.appendChild(elem);
    cb = document.querySelector('ids-checkbox');
    label = cb.labelEl.querySelector('.label-checkbox');
    expect(label.textContent.trim()).toBe('');
    cb.label = 'test';
    label = cb.labelEl.querySelector('.label-checkbox');
    expect(label.textContent.trim()).toBe('test');
    cb.label = null;
    label = cb.labelEl.querySelector('.label-checkbox');
    expect(label.textContent.trim()).toBe('');
  });

  it('should renders colored', () => {
    const color = 'emerald07';
    let rootEl = cb.shadowRoot.querySelector('.ids-checkbox');
    expect(rootEl.getAttribute('color')).toEqual(null);
    expect(cb.getAttribute('color')).toEqual(null);
    cb.color = color;
    rootEl = cb.shadowRoot.querySelector('.ids-checkbox');
    expect(rootEl.getAttribute('color')).toEqual(color);
    expect(cb.getAttribute('color')).toEqual(color);
    cb.color = false;
    rootEl = cb.shadowRoot.querySelector('.ids-checkbox');
    expect(rootEl.getAttribute('color')).toEqual(null);
    expect(cb.getAttribute('color')).toEqual(null);
    expect(cb.color).toEqual(null);
  });

  it('should renders value', () => {
    const value = 'test';
    expect(cb.getAttribute('value')).toEqual(null);
    cb.value = value;
    expect(cb.getAttribute('value')).toEqual(value);
    expect(cb.input.value).toEqual(value);
    cb.value = null;
    expect(cb.getAttribute('value')).toEqual(null);
  });

  it('should set indeterminate', () => {
    expect(cb.getAttribute('indeterminate')).toEqual(null);
    expect(cb.input.classList).not.toContain('indeterminate');
    cb.indeterminate = true;
    expect(cb.getAttribute('indeterminate')).toEqual('true');
    expect(cb.input.classList).toContain('indeterminate');
    cb.indeterminate = false;
    expect(cb.getAttribute('indeterminate')).toEqual(null);
    expect(cb.input.classList).not.toContain('indeterminate');
    cb.indeterminate = true;
    expect(cb.getAttribute('indeterminate')).toEqual('true');
    expect(cb.input.classList).toContain('indeterminate');
    cb.input.click();
    expect(cb.getAttribute('indeterminate')).toEqual(null);
    expect(cb.input.classList).not.toContain('indeterminate');
  });

  it('should rander display horizontal', () => {
    let rootEl = cb.shadowRoot.querySelector('.ids-checkbox');
    expect(rootEl.classList).not.toContain('horizontal');
    expect(cb.getAttribute('horizontal')).toEqual(null);
    cb.horizontal = true;
    rootEl = cb.shadowRoot.querySelector('.ids-checkbox');
    expect(rootEl.classList).toContain('horizontal');
    expect(cb.getAttribute('horizontal')).toEqual('true');
    cb.horizontal = false;
    rootEl = cb.shadowRoot.querySelector('.ids-checkbox');
    expect(rootEl.classList).not.toContain('horizontal');
    expect(cb.getAttribute('horizontal')).toEqual(null);
    expect(cb.horizontal).toEqual(null);
  });

  it('should dispatch native events', () => {
    const events = ['change', 'focus', 'keydown', 'keypress', 'keyup', 'click', 'dbclick'];
    events.forEach((evt) => {
      let response = null;
      cb.addEventListener(evt, () => {
        response = 'triggered';
      });
      const event = new Event(evt);
      cb.input.dispatchEvent(event);
      expect(response).toEqual('triggered');
    });
  });

  it('should remove events', () => {
    cb.input = null;
    document.body.innerHTML = '';
    const elem = new IdsCheckbox();
    document.body.appendChild(elem);
    cb = document.querySelector('ids-checkbox');

    cb.attachCheckboxChangeEvent('remove');
    cb.attachNativeEvents('remove');
    const events = ['change', 'focus', 'keydown', 'keypress', 'keyup', 'click', 'dbclick'];
    events.forEach((evt) => {
      let response = null;
      cb.addEventListener(`trigger${evt}`, () => {
        response = 'triggered';
      });
      const event = new Event(evt);
      cb.input.dispatchEvent(event);
      expect(response).not.toEqual('triggered');
    });
  });

  it('should renders template', () => {
    document.body.innerHTML = '';
    cb = new IdsCheckbox();
    cb.setAttribute('color', 'ruby07');
    cb.setAttribute('disabled', 'true');
    cb.setAttribute('horizontal', 'true');
    cb.setAttribute('checked', 'true');
    cb.setAttribute('label-required', 'false');
    cb.setAttribute('indeterminate', 'true');
    cb.template();
    expect(cb.getAttribute('disabled')).toEqual('true');
    const rootEl = cb.shadowRoot.querySelector('.ids-checkbox');
    expect(rootEl.classList).toContain('disabled');
    expect(rootEl.classList).toContain('horizontal');
    expect(cb.getAttribute('horizontal')).toEqual('true');
    expect(cb.getAttribute('checked')).toEqual('true');
    expect(cb.checked).toEqual('true');
    expect(cb.getAttribute('indeterminate')).toEqual('true');
  });

  it('can change language from the container', () => {
    container.language = 'en';
    expect(cb.getAttribute('language')).toEqual('en');
  });

  it('can focus its inner Input element', () => {
    cb.focus();
    expect(document.activeElement).toEqual(cb);
  });

  it('can set/remove the hitbox setting', () => {
    cb.hitbox = true;
    expect(cb.container.classList.contains('hitbox')).toBeTruthy();
    expect(cb.hitbox).toEqual('true');
    cb.hitbox = false;
    expect(cb.container.classList.contains('hitbox')).toBeFalsy();
    expect(cb.hitbox).toEqual(null);
  });
});
