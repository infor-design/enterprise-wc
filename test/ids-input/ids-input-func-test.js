/**
 * @jest-environment jsdom
 */
import IdsInput from '../../src/ids-input/ids-input';
import { IdsClearableMixin } from '../../src/ids-base/ids-clearable-mixin';

describe('IdsInput Component', () => {
  let input;

  beforeEach(async () => {
    const elem = new IdsInput();
    document.body.appendChild(elem);
    input = document.querySelector('ids-input');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    const elem = new IdsInput();
    document.body.appendChild(elem);
    elem.remove();
    expect(document.querySelectorAll('ids-input').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders correctly', () => {
    input.type = 'text';
    expect(input.outerHTML).toMatchSnapshot();
  });

  it('renders default field type', () => {
    input.type = 'text';
    expect(input.getAttribute('type')).toEqual('text');
    expect(input.type).toEqual('text');
  });

  it('removes type if reset', () => {
    input.type = null;
    expect(input.getAttribute('type')).toEqual('text');
    expect(input.type).toEqual('text');
  });

  it('renders placeholder', () => {
    document.body.innerHTML = '';
    const elem = new IdsInput();
    input.placeholder = 'Placeholder Text';
    input.template();
    document.body.appendChild(elem);

    input.placeholder = 'Placeholder Text';
    expect(input.getAttribute('placeholder')).toEqual('Placeholder Text');
    expect(input.placeholder).toEqual('Placeholder Text');
  });

  it('removes placeholder if reset', () => {
    input.placeholder = 'Placeholder Text';
    input.placeholder = null;
    expect(input.getAttribute('placeholder')).toEqual(null);
    expect(input.placeholder).toEqual(null);
  });

  it('renders field type of text', () => {
    input.type = 'text';
    expect(input.getAttribute('type')).toEqual('text');
    expect(input.type).toEqual('text');
  });

  it('renders field type of email', () => {
    input.type = 'email';
    expect(input.getAttribute('type')).toEqual('email');
    expect(input.type).toEqual('email');
  });

  it('renders field type of password', () => {
    input.type = 'password';
    expect(input.getAttribute('type')).toEqual('password');
    expect(input.type).toEqual('password');
  });

  it('renders field type of number', () => {
    input.type = 'number';
    expect(input.getAttribute('type')).toEqual('number');
    expect(input.type).toEqual('number');
  });

  it('should set label text', () => {
    let label = input.labelEl.querySelector('ids-text');
    label.remove();
    input.label = 'test';

    document.body.innerHTML = '';
    const elem = new IdsInput();
    document.body.appendChild(elem);
    input = document.querySelector('ids-input');
    label = input.labelEl.querySelector('ids-text');
    expect(input.labelEl.textContent.trim()).toBe('');
    input.label = 'test';
    expect(input.labelEl.textContent.trim()).toBe('test');
    input.label = null;
    expect(input.labelEl.textContent.trim()).toBe('');
  });

  it('should set label required indicator', () => {
    const className = 'no-required-indicator';
    expect(input.getAttribute('validate')).toEqual(null);
    expect(input.getAttribute('label-required')).toEqual(null);
    expect(input.labelEl.classList).not.toContain(className);
    input.validate = 'required';
    expect(input.getAttribute('validate')).toEqual('required');
    expect(input.getAttribute('label-required')).toEqual(null);
    expect(input.labelEl.classList).not.toContain(className);
    input.labelRequired = false;
    expect(input.getAttribute('validate')).toEqual('required');
    expect(input.getAttribute('label-required')).toEqual(null);
    expect(input.labelEl.classList).toContain(className);
    expect(input.labelRequired).toEqual(null);
    input.labelRequired = true;
    expect(input.getAttribute('validate')).toEqual('required');
    expect(input.getAttribute('label-required')).toEqual('true');
    expect(input.labelEl.classList).not.toContain(className);
    expect(input.labelRequired).toEqual('true');
  });

  it('should set value', () => {
    input.input.remove();
    input.value = '';
    document.body.innerHTML = '';
    const elem = new IdsInput();
    document.body.appendChild(elem);
    input = document.querySelector('ids-input');
    expect(input.input.value).toEqual('');
    input.value = 'test';
    expect(input.input.value).toEqual('test');
    input.value = null;
    expect(input.input.value).toEqual('');
  });

  it('should call template', () => {
    input.value = 'test';
    input.readonly = 'true';
    input.disabled = 'true';
    input.labelFontSize = 'lg';
    input.bgTransparent = 'true';
    input.textEllipsis = 'true';
    input.template();
    expect(input.input.value).toEqual('test');
  });

  it('renders field as disabled', () => {
    expect(input.getAttribute('disabled')).toEqual(null);
    expect(input.input.getAttribute('disabled')).toBe(null);
    expect(input.labelEl.classList).not.toContain('disabled');
    input.disabled = true;
    expect(input.getAttribute('disabled')).toEqual('true');
    expect(input.input.getAttribute('disabled')).toBe('true');
    expect(input.labelEl.classList).toContain('disabled');
  });

  it('should disable and enable', () => {
    expect(input.getAttribute('disabled')).toEqual(null);
    expect(input.input.getAttribute('disabled')).toBe(null);
    expect(input.labelEl.classList).not.toContain('disabled');
    input.disabled = true;
    expect(input.getAttribute('disabled')).toEqual('true');
    expect(input.input.getAttribute('disabled')).toBe('true');
    expect(input.labelEl.classList).toContain('disabled');
    input.disabled = false;
    expect(input.getAttribute('disabled')).toEqual(null);
    expect(input.input.getAttribute('disabled')).toBe(null);
    expect(input.labelEl.classList).not.toContain('disabled');
  });

  it('renders field as readonly', () => {
    expect(input.getAttribute('readonly')).toEqual(null);
    expect(input.input.getAttribute('readonly')).toBe(null);
    expect(input.labelEl.classList).not.toContain('readonly');
    input.readonly = true;
    expect(input.getAttribute('readonly')).toEqual('true');
    expect(input.input.getAttribute('readonly')).toBe('true');
    expect(input.labelEl.classList).toContain('readonly');
    input.readonly = false;
    expect(input.getAttribute('readonly')).toEqual(null);
    expect(input.input.getAttribute('readonly')).toBe(null);
    expect(input.labelEl.classList).not.toContain('readonly');
  });

  it('should skip invalid input state', () => {
    expect(input.getAttribute('test')).toEqual(null);
    expect(input.input.getAttribute('test')).toBe(null);
    expect(input.labelEl.classList).not.toContain('test');
    input.setInputState('test');
    expect(input.getAttribute('test')).toEqual(null);
    expect(input.input.getAttribute('test')).toBe(null);
    expect(input.labelEl.classList).not.toContain('test');
  });

  it('renders field as bg-transparent', () => {
    expect(input.getAttribute('bg-transparent')).toEqual(null);
    expect(input.input.classList).not.toContain('bg-transparent');
    input.bgTransparent = true;
    expect(input.getAttribute('bg-transparent')).toEqual('true');
    expect(input.input.classList).toContain('bg-transparent');
    input.bgTransparent = false;
    expect(input.getAttribute('bg-transparent')).toEqual(null);
    expect(input.input.classList).not.toContain('bg-transparent');
  });

  it('renders field as text-ellipsis', () => {
    expect(input.getAttribute('text-ellipsis')).toEqual(null);
    expect(input.input.classList).not.toContain('text-ellipsis');
    input.textEllipsis = true;
    expect(input.getAttribute('text-ellipsis')).toEqual('true');
    expect(input.input.classList).toContain('text-ellipsis');
    input.textEllipsis = false;
    expect(input.getAttribute('text-ellipsis')).toEqual(null);
    expect(input.input.classList).not.toContain('text-ellipsis');
  });

  it('should setup dirty tracking', () => {
    input.dirtyTracker = true;
    input.input.remove();
    input.input = null;
    input.dirtyTrackerEvents();
    expect(input.dirty).toEqual({ original: '' });
    document.body.innerHTML = '';
    let elem = new IdsInput();
    document.body.appendChild(elem);
    input = document.querySelector('ids-input');
    input.dirtyTracker = true;
    input.input.remove();
    input.input = null;
    input.handleDirtyTracker();
    expect(input.dirty).toEqual({ original: '' });
    document.body.innerHTML = '';
    elem = new IdsInput();
    document.body.appendChild(elem);
    input = document.querySelector('ids-input');
    expect(input.getAttribute('dirty-tracker')).toEqual(null);
    expect(input.shadowRoot.querySelector('.icon-dirty')).toBeFalsy();
    expect(input.labelEl.querySelector('.msg-dirty')).toBeFalsy();
    input.dirtyTracker = true;
    input.setDirtyTracker();
    expect(input.dirtyTracker).toEqual('true');
    input.input.value = 'test';
    const event = new Event('change', { bubbles: true });
    input.input.dispatchEvent(event);
    expect(input.shadowRoot.querySelector('.icon-dirty')).toBeTruthy();
    expect(input.labelEl.querySelector('.msg-dirty')).toBeTruthy();
  });

  it('should destroy dirty tracking', () => {
    expect(input.getAttribute('dirty-tracker')).toEqual(null);
    expect(input.shadowRoot.querySelector('.icon-dirty')).toBeFalsy();
    expect(input.labelEl.querySelector('.msg-dirty')).toBeFalsy();
    input.dirtyTracker = true;
    expect(input.dirtyTracker).toEqual('true');
    input.input.value = 'test';
    const event = new Event('change', { bubbles: true });
    input.input.dispatchEvent(event);
    expect(input.shadowRoot.querySelector('.icon-dirty')).toBeTruthy();
    expect(input.labelEl.querySelector('.msg-dirty')).toBeTruthy();
    input.destroyDirtyTracker();
    expect(input.shadowRoot.querySelector('.icon-dirty')).toBeFalsy();
    expect(input.labelEl.querySelector('.msg-dirty')).toBeFalsy();
  });

  it('should dirty tracking', () => {
    expect(input.getAttribute('dirty-tracker')).toEqual(null);
    expect(input.shadowRoot.querySelector('.icon-dirty')).toBeFalsy();
    expect(input.labelEl.querySelector('.msg-dirty')).toBeFalsy();
    input.dirtyTracker = true;
    expect(input.getAttribute('dirty-tracker')).toEqual('true');
    expect(input.shadowRoot.querySelector('.icon-dirty')).toBeFalsy();
    expect(input.labelEl.querySelector('.msg-dirty')).toBeFalsy();
    input.input.value = 'test';
    input.setDirtyTracker(input.input.value);
    expect(input.getAttribute('dirty-tracker')).toEqual('true');
    expect(input.shadowRoot.querySelector('.icon-dirty')).toBeTruthy();
    expect(input.labelEl.querySelector('.msg-dirty')).toBeTruthy();
    input.input.value = '';
    input.setDirtyTracker(input.input.value);
    expect(input.getAttribute('dirty-tracker')).toEqual('true');
    expect(input.shadowRoot.querySelector('.icon-dirty')).toBeFalsy();
    expect(input.labelEl.querySelector('.msg-dirty')).toBeFalsy();
    input.dirtyTracker = false;
    expect(input.getAttribute('dirty-tracker')).toEqual(null);
    expect(input.shadowRoot.querySelector('.icon-dirty')).toBeFalsy();
    expect(input.labelEl.querySelector('.msg-dirty')).toBeFalsy();
    input.dirtyTracker = true;
    input.input.value = 'test2';
    input.setDirtyTracker(input.input.value);
    expect(input.getAttribute('dirty-tracker')).toEqual('true');
    expect(input.shadowRoot.querySelector('.icon-dirty')).toBeTruthy();
    expect(input.labelEl.querySelector('.msg-dirty')).toBeTruthy();
    input.dirtyTracker = false;
    expect(input.getAttribute('dirty-tracker')).toEqual(null);
    expect(input.shadowRoot.querySelector('.icon-dirty')).toBeFalsy();
    expect(input.labelEl.querySelector('.msg-dirty')).toBeFalsy();
  });

  it('should not error for input', () => {
    input.input.remove();
    input.input = null;
    input.handleInputFocusEvent();
    input.handleInputChangeEvent();
    input.clearable = true;
  });

  it('should autoselect', () => {
    input.autoselect = true;
    input.value = 'test';
    expect(input.getAttribute('autoselect')).toEqual('true');
    input.input.focus();
    input.shadowRoot.querySelector('.ids-input-field').focus();
    input.autoselect = false;
    expect(input.getAttribute('autoselect')).toEqual(null);
  });

  it('should render clearable icon', () => {
    input.clearable = true;
    expect(input.getAttribute('clearable')).toEqual('true');
    expect(input.input.classList).toContain('has-clearable');
    expect(input.shadowRoot.querySelector('.btn-clear').classList).toContain('is-empty');
    input.input.focus();
    input.value = 'test';
    input.checkContents();
    const xButton = input.shadowRoot.querySelector('.btn-clear');
    expect(xButton.classList).not.toContain('is-empty');
    xButton.click();
    expect(input.value).toEqual('');
    input.clearable = false;
    expect(input.getAttribute('clearable')).toEqual(null);
    expect(input.input.classList).not.toContain('has-clearable');
  });

  it('should render clearable-forced icon', () => {
    expect(input.getAttribute('clearable-forced')).toEqual(null);
    expect(input.input.classList).not.toContain('has-clearable');
    input.clearableForced = true;
    expect(input.getAttribute('clearable-forced')).toEqual('true');
    expect(input.input.classList).toContain('has-clearable');
    expect(input.shadowRoot.querySelector('.btn-clear').classList).toContain('is-empty');
    input.input.focus();
    input.value = 'test';
    input.checkContents();
    let xButton = input.shadowRoot.querySelector('.btn-clear');
    expect(xButton.classList).not.toContain('is-empty');
    input.input.blur();
    input.input.focus();
    input.value = 'test2';
    input.checkContents();
    xButton = input.shadowRoot.querySelector('.btn-clear');
    xButton.click();
    expect(input.value).toEqual('');
    input.clearableForced = false;
    expect(input.getAttribute('clearable-forced')).toEqual(null);
    expect(input.input.classList).not.toContain('has-clearable');
  });

  it('should clear on click', () => {
    input.clearable = true;
    input.value = 'test';
    expect(input.value).toEqual('test');
    input.shadowRoot.querySelector('.btn-clear').click();
    expect(input.value).toEqual('');
  });

  it('should clearable edge case', () => {
    const errors = jest.spyOn(global.console, 'error');
    input.checkContents();
    expect(errors).not.toHaveBeenCalled();
  });

  it('should not error calling with no button', () => {
    input.clearable = true;
    input.clearable = false;
    input.handleClearBtnKeydown();
    expect(input.shadowRoot.querySelector('.btn-clear')).toBeFalsy();
  });

  it('should renders triggerfield', () => {
    input.triggerfield = true;
    input.value = 'test';
    expect(input.getAttribute('triggerfield')).toEqual('true');
    expect(input.input.classList).toContain('has-triggerfield');
    input.triggerfield = false;
    expect(input.getAttribute('triggerfield')).toEqual(null);
    expect(input.input.classList).not.toContain('has-triggerfield');
  });

  it('should clear field', () => {
    input.clearable = true;
    input.value = 'test';
    expect(input.getAttribute('clearable')).toEqual('true');
    input.shadowRoot.querySelector('.btn-clear').click();
    input.clearable = false;
    expect(input.getAttribute('clearable')).toEqual(null);
  });

  it('should not set wrong text-align', () => {
    input.input.remove();
    input.input = null;
    input.textAlign = 'test';
    document.body.innerHTML = '';
    const elem = new IdsInput();
    document.body.appendChild(elem);
    input = document.querySelector('ids-input');
    input.textAlign = 'test2';
    expect(input.getAttribute('text-align')).toEqual('left');
    expect(input.input.classList).not.toContain('test');
    const textAlign = 'right';
    input.textAlign = textAlign;
    expect(input.getAttribute('text-align')).toEqual(textAlign);
    expect(input.input.classList).toContain(textAlign);
  });

  it('should input text-align', () => {
    const textAligns = ['left', 'center', 'right'];
    const checkAlign = (textAlign) => {
      input.textAlign = textAlign;
      expect(input.getAttribute('text-align')).toEqual(textAlign);
      expect(input.input.classList).toContain(textAlign);
      textAligns.filter((s) => s !== textAlign).forEach((s) => {
        expect(input.input.classList).not.toContain(s);
      });
    };
    expect(input.getAttribute('text-align')).toEqual(null);
    expect(input.textAlign).toContain('left');
    textAligns.forEach((s) => checkAlign(s));
  });

  it('should dispatch native events', () => {
    const events = ['change', 'focus', 'select', 'keydown', 'keypress', 'keyup', 'click', 'dbclick'];
    events.forEach((evt) => {
      let response = null;
      input.addEventListener(evt, () => {
        response = 'triggered';
      });
      const event = new Event(evt);
      input.input.dispatchEvent(event);
      expect(response).toEqual('triggered');
    });
  });

  it('should not set wrong size', () => {
    input.size = 'test';
    expect(input.getAttribute('size')).toEqual('md');
    expect(input.input.classList).not.toContain('test');
    const size = 'sm';
    input.size = size;
    expect(input.getAttribute('size')).toEqual(size);
    expect(input.input.classList).toContain(size);
  });

  it('should rendr input sizes', () => {
    const sizes = ['xs', 'sm', 'mm', 'md', 'lg', 'full'];
    const checkSize = (size) => {
      input.size = size;
      expect(input.getAttribute('size')).toEqual(size);
      expect(input.input.classList).toContain(size);
      sizes.filter((s) => s !== size).forEach((s) => {
        expect(input.input.classList).not.toContain(s);
      });
    };
    expect(input.getAttribute('size')).toEqual(null);
    expect(input.input.classList).toContain('md');
    sizes.forEach((s) => checkSize(s));
  });
});
