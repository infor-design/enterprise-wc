/**
 * @jest-environment jsdom
 */
import IdsTextarea from '../../src/components/ids-textarea/ids-textarea';
import IdsEventsMixin from '../../src/mixins/ids-events-mixin/ids-events-mixin';

describe('IdsTextarea Component', () => {
  let textarea;

  beforeEach(async () => {
    const elem = new IdsTextarea();
    document.body.appendChild(elem);
    textarea = document.querySelector('ids-textarea');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    const elem = new IdsTextarea();
    document.body.appendChild(elem);
    elem.remove();
    expect(document.querySelectorAll('ids-textarea').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders placeholder', () => {
    textarea.placeholder = 'Placeholder Text';
    expect(textarea.getAttribute('placeholder')).toEqual('Placeholder Text');
    expect(textarea.placeholder).toEqual('Placeholder Text');
    textarea.placeholder = null;
    expect(textarea.getAttribute('placeholder')).toEqual(null);
    expect(textarea.placeholder).toEqual(null);
  });

  it('should set label text', () => {
    expect(textarea.labelEl.textContent.trim()).toBe('');
    textarea.label = 'test';
    expect(textarea.labelEl.textContent.trim()).toBe('test');
    textarea.label = null;
    expect(textarea.labelEl.textContent.trim()).toBe('');
  });

  it('should set label required indicator', () => {
    const className = 'no-required-indicator';
    expect(textarea.getAttribute('validate')).toEqual(null);
    expect(textarea.getAttribute('label-required')).toEqual(null);
    expect(textarea.labelEl.classList).not.toContain(className);
    textarea.validate = 'required';
    expect(textarea.getAttribute('validate')).toEqual('required');
    expect(textarea.getAttribute('label-required')).toEqual(null);
    expect(textarea.labelEl.classList).not.toContain(className);
    textarea.labelRequired = false;
    expect(textarea.getAttribute('validate')).toEqual('required');
    expect(textarea.getAttribute('label-required')).toEqual(null);
    expect(textarea.labelEl.classList).toContain(className);
    expect(textarea.labelRequired).toEqual(null);
    textarea.labelRequired = true;
    expect(textarea.getAttribute('validate')).toEqual('required');
    expect(textarea.getAttribute('label-required')).toEqual('true');
    expect(textarea.labelEl.classList).not.toContain(className);
    expect(textarea.labelRequired).toEqual('true');
  });

  it('should set validation events', () => {
    expect(textarea.getAttribute('validate')).toEqual(null);
    expect(textarea.getAttribute('validation-events')).toEqual(null);
    textarea.validate = 'required';
    textarea.validationEvents = 'blur';
    expect(textarea.getAttribute('validate')).toEqual('required');
    expect(textarea.getAttribute('validation-events')).toEqual('blur');
    textarea.validationEvents = null;
    expect(textarea.getAttribute('validate')).toEqual('required');
    expect(textarea.getAttribute('validation-events')).toEqual(null);
    textarea.validate = null;
    expect(textarea.getAttribute('validate')).toEqual(null);
    expect(textarea.getAttribute('validation-events')).toEqual(null);
  });

  it('should set value', () => {
    textarea.value = '';
    expect(textarea.input.value).toEqual('');
    textarea.value = 'test';
    expect(textarea.input.value).toEqual('test');
    textarea.value = null;
    expect(textarea.input.value).toEqual('');
  });

  it('should call template', () => {
    textarea.value = 'test';
    textarea.rows = '15';
    textarea.maxlength = '90';
    textarea.characterCounter = 'true';
    textarea.readonly = 'true';
    textarea.disabled = 'true';
    textarea.printable = 'false';
    textarea.placeholder = 'test';
    textarea.resizable = 'true';
    textarea.size = 'sm';
    textarea.template();
    expect(textarea.input.value).toEqual('test');
  });

  it('renders field as disabled', () => {
    expect(textarea.getAttribute('disabled')).toEqual(null);
    expect(textarea.input.getAttribute('disabled')).toBe(null);
    expect(textarea.container.classList).not.toContain('disabled');
    textarea.validate = 'required';
    textarea.checkValidation();
    textarea.disabled = true;
    expect(textarea.getAttribute('disabled')).toEqual('true');
    expect(textarea.input.getAttribute('disabled')).toBe('true');
    expect(textarea.container.classList).toContain('disabled');
  });

  it('should disable and enable', () => {
    expect(textarea.getAttribute('disabled')).toEqual(null);
    expect(textarea.input.getAttribute('disabled')).toBe(null);
    expect(textarea.container.classList).not.toContain('disabled');
    textarea.disabled = true;
    expect(textarea.getAttribute('disabled')).toEqual('true');
    expect(textarea.input.getAttribute('disabled')).toBe('true');
    expect(textarea.container.classList).toContain('disabled');
    textarea.disabled = false;
    expect(textarea.getAttribute('disabled')).toEqual(null);
    expect(textarea.input.getAttribute('disabled')).toBe(null);
    expect(textarea.container.classList).not.toContain('disabled');
  });

  it('renders field as readonly', () => {
    expect(textarea.getAttribute('readonly')).toEqual(null);
    expect(textarea.input.getAttribute('readonly')).toBe(null);
    expect(textarea.container.classList).not.toContain('readonly');
    textarea.validate = 'required';
    textarea.checkValidation();
    textarea.readonly = true;
    expect(textarea.getAttribute('readonly')).toEqual('true');
    expect(textarea.input.getAttribute('readonly')).toBe('true');
    expect(textarea.container.classList).toContain('readonly');
    textarea.readonly = false;
    expect(textarea.getAttribute('readonly')).toEqual(null);
    expect(textarea.input.getAttribute('readonly')).toBe(null);
    expect(textarea.container.classList).not.toContain('readonly');
  });

  it('renders rows to field', () => {
    expect(textarea.getAttribute('rows')).toEqual(null);
    expect(textarea.input.getAttribute('rows')).toBe(null);
    textarea.rows = '15';
    expect(textarea.getAttribute('rows')).toEqual('15');
    expect(textarea.input.getAttribute('rows')).toBe('15');
    textarea.rows = null;
    expect(textarea.getAttribute('rows')).toEqual(null);
    expect(textarea.input.getAttribute('rows')).toBe(null);
  });

  it('renders autogrow to field', () => {
    textarea.autogrow = true;
    expect(textarea.getAttribute('autogrow')).toEqual('true');

    textarea.autogrow = false;
    expect(textarea.getAttribute('autogrow')).toEqual(null);
  });

  it('set autogrow to field', () => {
    textarea.autogrow = true;
    expect(textarea.getAttribute('autogrow')).toEqual('true');
    textarea.autogrowMaxHeight = 200;
    Object.defineProperty(HTMLElement.prototype, 'scrollHeight', { configurable: true, value: 250 });
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { configurable: true, value: 200 });
    textarea.setAutogrow();
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { configurable: true, value: 270 });
    textarea.setAutogrow();
    textarea.adjustHeight(200, 200);
    textarea.adjustHeight(270, 200);
    textarea.autogrow = false;
    expect(textarea.getAttribute('autogrow')).toEqual(null);
  });

  it('should set value with slotchange', (done) => {
    textarea.textContent = 'test';
    expect(textarea.textContent).toEqual('test');
    setTimeout(() => {
      expect(textarea.value).toEqual('test');
      done();
    }, 1);
  });

  it('renders autogrow and max height to field', () => {
    expect(textarea.getAttribute('autogrow-max-height')).toEqual(null);
    textarea.autogrowMaxHeight = true;
    textarea.autogrow = true;
    expect(textarea.getAttribute('autogrow-max-height')).toEqual('true');
    textarea.autogrowMaxHeight = false;
    expect(textarea.getAttribute('autogrow-max-height')).toEqual(null);
  });

  it('renders clearable to field', () => {
    expect(textarea.getAttribute('clearable')).toEqual(null);
    expect(textarea.input.classList).not.toContain('has-clearable');
    textarea.clearable = true;
    expect(textarea.getAttribute('clearable')).toEqual('true');
    expect(textarea.container.classList).toContain('has-clearable');
    textarea.clearable = false;
    expect(textarea.getAttribute('clearable')).toEqual(null);
    expect(textarea.container.classList).not.toContain('has-clearable');
  });

  it('renders resizable to field', () => {
    expect(textarea.getAttribute('resizable')).toEqual(null);
    expect(textarea.input.classList).not.toContain('resizable');
    textarea.resizable = true;
    expect(textarea.getAttribute('resizable')).toEqual('true');
    expect(textarea.input.classList).toContain('resizable');
    textarea.resizable = false;
    expect(textarea.getAttribute('resizable')).toEqual(null);
    expect(textarea.input.classList).not.toContain('resizable');
  });

  it('renders printable to field', () => {
    expect(textarea.getAttribute('printable')).toEqual(null);
    expect(textarea.shadowRoot.querySelector('.textarea-print')).toBeTruthy();
    textarea.printable = 'true';
    expect(textarea.getAttribute('printable')).toEqual('true');
    expect(textarea.shadowRoot.querySelector('.textarea-print')).toBeTruthy();
    textarea.printable = 'false';
    expect(textarea.getAttribute('printable')).toEqual('false');
    expect(textarea.shadowRoot.querySelector('.textarea-print')).toBeFalsy();
    textarea.value = 'test';
    textarea.printable = null;
    expect(textarea.getAttribute('printable')).toEqual(null);
    expect(textarea.shadowRoot.querySelector('.textarea-print')).toBeTruthy();
  });

  it('renders maxlength to field', () => {
    expect(textarea.getAttribute('maxlength')).toEqual(null);
    expect(textarea.input.getAttribute('maxlength')).toBe(null);
    textarea.maxlength = '90';
    expect(textarea.getAttribute('maxlength')).toEqual('90');
    expect(textarea.input.getAttribute('maxlength')).toBe('90');
    textarea.maxlength = null;
    expect(textarea.getAttribute('maxlength')).toEqual(null);
    expect(textarea.input.getAttribute('maxlength')).toBe(null);
  });

  it('renders character counter to field', () => {
    expect(textarea.getAttribute('character-counter')).toEqual(null);
    expect(textarea.shadowRoot.querySelector('.textarea-character-counter')).toBeFalsy();
    textarea.maxlength = '90';
    expect(textarea.getAttribute('character-counter')).toEqual(null);
    expect(textarea.shadowRoot.querySelector('.textarea-character-counter')).toBeTruthy();
    expect(textarea.isSafari).toEqual(false);
    textarea.isSafari = 'true';
    textarea.characterCounter = 'true';
    expect(textarea.getAttribute('character-counter')).toEqual('true');
    expect(textarea.shadowRoot.querySelector('.textarea-character-counter')).toBeTruthy();
    textarea.characterCounter = 'false';
    expect(textarea.getAttribute('character-counter')).toEqual(null);
    expect(textarea.shadowRoot.querySelector('.textarea-character-counter')).toBeFalsy();
    textarea.characterCounter = null;
    expect(textarea.getAttribute('character-counter')).toEqual(null);
    expect(textarea.shadowRoot.querySelector('.textarea-character-counter')).toBeTruthy();
  });

  it('renders char-max-text as default to field', () => {
    const valueMax = '012345678901234567890';
    const valueAlmostEmpty = '012345678901234';
    const maxlength = 20;
    const defaultText = {
      charMaxText: `Character count maximum of`,
      charRemainingText: `Characters left ${maxlength}`,
      almostEmptyText: `Characters left ${maxlength - valueAlmostEmpty.length}`
    };
    expect(textarea.charMaxText).toBe(defaultText.charMaxText);
    expect(textarea.getAttribute('char-max-text')).toEqual(null);
    let counter = textarea.shadowRoot.querySelector('.textarea-character-counter');
    expect(counter).toBeFalsy();

    textarea.maxlength = maxlength;
    expect(textarea.charMaxText).toBe(defaultText.charMaxText);
    expect(textarea.getAttribute('char-max-text')).toEqual(null);
    counter = textarea.shadowRoot.querySelector('.textarea-character-counter');
    expect(counter).toBeTruthy();
    expect(counter.textContent).toEqual(defaultText.charRemainingText);
    expect(counter.classList).not.toContain('almost-empty');
    textarea.value = valueAlmostEmpty;
    expect(textarea.charMaxText).toBe(defaultText.charMaxText);
    expect(textarea.getAttribute('char-max-text')).toEqual(null);
    counter = textarea.shadowRoot.querySelector('.textarea-character-counter');
    expect(counter.textContent).toEqual(defaultText.almostEmptyText);
    expect(counter.classList).toContain('almost-empty');
    textarea.value = valueMax;
    counter = textarea.shadowRoot.querySelector('.textarea-character-counter');
    expect(counter.textContent).toEqual(`${defaultText.charMaxText} ${maxlength}`);
    expect(counter.classList).not.toContain('almost-empty');
  });

  it('renders char-max-text as custom to field', () => {
    const valueMax = '01234567890123456789';
    const maxlength = '20';
    const defaultText = {
      charMaxText: `Character count maximum of`,
      charRemainingText: `Characters left ${maxlength}`
    };
    defaultText.charMaxTextVal = `${defaultText.charMaxText} ${maxlength}`;
    defaultText.charRemainingTextVal = defaultText.charRemainingText.replace('{0}', maxlength);

    const customText = {
      charMaxText: 'This text cannot exceed {0} characters.',
      charRemainingText: 'You can type {0} more characters.'
    };
    customText.charMaxTextVal = customText.charMaxText.replace('{0}', maxlength);
    customText.charRemainingTextVal = customText.charRemainingText.replace('{0}', maxlength);

    textarea.charMaxText = customText.charMaxText;
    textarea.charRemainingText = customText.charRemainingText;

    expect(textarea.charMaxText).toBe(customText.charMaxText);
    expect(textarea.getAttribute('char-max-text')).toEqual(customText.charMaxText);
    let counter = textarea.shadowRoot.querySelector('.textarea-character-counter');
    expect(counter).toBeFalsy();

    textarea.maxlength = maxlength;
    expect(textarea.charMaxText).toBe(customText.charMaxText);
    expect(textarea.getAttribute('char-max-text')).toEqual(customText.charMaxText);
    counter = textarea.shadowRoot.querySelector('.textarea-character-counter');
    expect(counter).toBeTruthy();
    expect(counter.textContent).toEqual(customText.charRemainingTextVal);
    textarea.value = valueMax;
    counter = textarea.shadowRoot.querySelector('.textarea-character-counter');
    expect(counter.textContent).toEqual(customText.charMaxTextVal);

    textarea.charMaxText = null;
    textarea.charRemainingText = null;
    textarea.value = '';
    expect(textarea.charMaxText).toBe(defaultText.charMaxText);
    expect(textarea.getAttribute('char-max-text')).toEqual(null);
    counter = textarea.shadowRoot.querySelector('.textarea-character-counter');
    expect(counter.textContent).toEqual(defaultText.charRemainingTextVal);
  });

  it('should skip invalid textarea state', () => {
    expect(textarea.getAttribute('test')).toEqual(null);
    expect(textarea.input.getAttribute('test')).toBe(null);
    expect(textarea.container.classList).not.toContain('test');
    textarea.setTextareaState('test');
    expect(textarea.getAttribute('test')).toEqual(null);
    expect(textarea.input.getAttribute('test')).toBe(null);
    expect(textarea.container.classList).not.toContain('test');
  });

  it('should count line breaks', () => {
    expect(textarea.countLinebreaks('test\n-\nabc')).toEqual(2);
    expect(textarea.countLinebreaks('test-abc')).toEqual(0);
  });

  it('should setup browser', () => {
    Object.defineProperty(window.navigator, 'userAgent', ((value) => ({
      get() { return value; },
      set(v) { value = v; } // eslint-disable-line
    }))(window.navigator.userAgent));

    expect(textarea.isSafari).toEqual(false);
    global.navigator.userAgent = 'Safari';
    expect(global.navigator.userAgent).toBe('Safari');
    textarea.setBrowser();
    expect(textarea.isSafari).toEqual(true);

    global.navigator.userAgent = 'Chrome';
    expect(global.navigator.userAgent).toBe('Chrome');
    textarea.setBrowser();
    expect(textarea.isSafari).toEqual(false);

    global.navigator.userAgent = 'Android';
    expect(global.navigator.userAgent).toBe('Android');
    textarea.setBrowser();
    expect(textarea.isSafari).toEqual(false);

    Object.defineProperty(window.navigator, 'vendor', ((value) => ({
      get() { return value; },
      set(v) { value = v; } // eslint-disable-line
    }))(window.navigator.vendor));
    global.navigator.userAgent = null;
    global.navigator.vendor = 'Safari';
    expect(global.navigator.vendor).toBe('Safari');
    textarea.setBrowser();
    expect(textarea.isSafari).toEqual(true);

    Object.defineProperty(window, 'opera', ((value) => ({
      get() { return value; },
      set(v) { value = v; } // eslint-disable-line
    }))(window.opera));
    global.navigator.userAgent = null;
    global.navigator.vendor = null;
    global.opera = 'Safari';
    expect(global.opera).toBe('Safari');
    textarea.setBrowser();
    expect(textarea.isSafari).toEqual(true);
  });

  it('should destroy dirty tracking', () => {
    expect(textarea.getAttribute('dirty-tracker')).toEqual(null);
    expect(textarea.shadowRoot.querySelector('.icon-dirty')).toBeFalsy();
    expect(textarea.labelEl.querySelector('.msg-dirty')).toBeFalsy();
    textarea.dirtyTracker = true;
    expect(textarea.dirtyTracker).toEqual('true');
    textarea.input.value = 'test';
    const event = new Event('change', { bubbles: true });
    textarea.input.dispatchEvent(event);
    expect(textarea.shadowRoot.querySelector('.icon-dirty')).toBeTruthy();
    expect(textarea.labelEl.querySelector('.msg-dirty')).toBeTruthy();
    textarea.destroyDirtyTracker();
    expect(textarea.shadowRoot.querySelector('.icon-dirty')).toBeFalsy();
    expect(textarea.labelEl.querySelector('.msg-dirty')).toBeFalsy();
  });

  it('can have dirty tracking', () => {
    expect(textarea.getAttribute('dirty-tracker')).toEqual(null);
    expect(textarea.shadowRoot.querySelector('.icon-dirty')).toBeFalsy();
    expect(textarea.labelEl.querySelector('.msg-dirty')).toBeFalsy();
    textarea.dirtyTracker = true;
    expect(textarea.getAttribute('dirty-tracker')).toEqual('true');
    expect(textarea.shadowRoot.querySelector('.icon-dirty')).toBeFalsy();
    expect(textarea.labelEl.querySelector('.msg-dirty')).toBeFalsy();
    textarea.input.value = 'test';
    textarea.setDirtyTracker(textarea.input.value);
    expect(textarea.getAttribute('dirty-tracker')).toEqual('true');
    expect(textarea.shadowRoot.querySelector('.icon-dirty')).toBeTruthy();
    expect(textarea.labelEl.querySelector('.msg-dirty')).toBeTruthy();
    textarea.input.value = '';
    textarea.setDirtyTracker(textarea.input.value);
    expect(textarea.getAttribute('dirty-tracker')).toEqual('true');
    expect(textarea.shadowRoot.querySelector('.icon-dirty')).toBeFalsy();
    expect(textarea.labelEl.querySelector('.msg-dirty')).toBeFalsy();
    textarea.dirtyTracker = false;
    expect(textarea.getAttribute('dirty-tracker')).toEqual(null);
    expect(textarea.shadowRoot.querySelector('.icon-dirty')).toBeFalsy();
    expect(textarea.labelEl.querySelector('.msg-dirty')).toBeFalsy();
    textarea.dirtyTracker = true;
    textarea.input.value = 'test2';
    textarea.setDirtyTracker(textarea.input.value);
    expect(textarea.getAttribute('dirty-tracker')).toEqual('true');
    expect(textarea.shadowRoot.querySelector('.icon-dirty')).toBeTruthy();
    expect(textarea.labelEl.querySelector('.msg-dirty')).toBeTruthy();
    textarea.dirtyTracker = false;
    expect(textarea.getAttribute('dirty-tracker')).toEqual(null);
    expect(textarea.shadowRoot.querySelector('.icon-dirty')).toBeFalsy();
    expect(textarea.labelEl.querySelector('.msg-dirty')).toBeFalsy();
  });

  it('should autoselect', (done) => {
    textarea.autoselect = true;
    textarea.value = 'test';
    expect(textarea.getAttribute('autoselect')).toEqual('true');
    textarea.input.focus();
    setTimeout(() => {
      textarea.autoselect = false;
      expect(textarea.getAttribute('autoselect')).toEqual(null);
      done();
    }, 2);
  });

  it('should not set wrong text-align', () => {
    textarea.textAlign = 'test';
    expect(textarea.getAttribute('text-align')).toEqual('left');
    expect(textarea.input.classList).not.toContain('test');

    const textAlign = 'right';
    textarea.textAlign = textAlign;
    expect(textarea.getAttribute('text-align')).toEqual(textAlign);
    expect(textarea.input.classList).toContain(textAlign);
  });

  it('should textarea text-align', () => {
    const textAligns = ['left', 'center', 'right'];
    const checkAlign = (textAlign) => {
      textarea.textAlign = textAlign;
      expect(textarea.getAttribute('text-align')).toEqual(textAlign);
      expect(textarea.input.classList).toContain(textAlign);
      textAligns.filter((s) => s !== textAlign).forEach((s) => {
        expect(textarea.input.classList).not.toContain(s);
      });
    };
    expect(textarea.getAttribute('text-align')).toEqual(null);
    expect(textarea.textAlign).toContain('left');
    textAligns.forEach((s) => checkAlign(s));
  });

  it('should dispatch native events', () => {
    const events = ['change', 'input', 'propertychange', 'focus', 'select'];
    events.forEach((evt) => {
      let response = null;
      textarea.addEventListener(evt, () => {
        response = 'triggered';
      });
      const event = new Event(evt);
      textarea.input.dispatchEvent(event);
      expect(response).toEqual('triggered');
    });
  });

  it('should not set wrong size', () => {
    textarea.size = 'test';
    expect(textarea.getAttribute('size')).toEqual('md');
    expect(textarea.input.classList).not.toContain('test');
    const size = 'sm';
    textarea.size = size;
    expect(textarea.getAttribute('size')).toEqual(size);
    expect(textarea.shadowRoot.querySelector('.field-container').classList).toContain(size);
  });

  it('should rendr textarea sizes', () => {
    const sizes = ['sm', 'md', 'lg', 'full'];
    const checkSize = (size) => {
      textarea.size = size;
      expect(textarea.getAttribute('size')).toEqual(size);
      expect(textarea.shadowRoot.querySelector('.field-container').classList).toContain(size);
      sizes.filter((s) => s !== size).forEach((s) => {
        expect(textarea.shadowRoot.querySelector('.field-container').classList).not.toContain(s);
      });
    };
    expect(textarea.getAttribute('size')).toEqual(null);
    expect(textarea.shadowRoot.querySelector('.field-container').classList).toContain('md');
    sizes.forEach((s) => checkSize(s));
  });
});
