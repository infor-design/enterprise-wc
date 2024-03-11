describe('IdsTextarea Component', () => {
  let textarea: any;

  test('renders rows to field', () => {
    expect(textarea.getAttribute('rows')).toEqual(null);
    expect(textarea.input.getAttribute('rows')).toBe(null);
    textarea.rows = '15';
    expect(textarea.getAttribute('rows')).toEqual('15');
    expect(textarea.input.getAttribute('rows')).toBe('15');
    textarea.rows = null;
    expect(textarea.getAttribute('rows')).toEqual(null);
    expect(textarea.input.getAttribute('rows')).toBe(null);
  });

  test('renders autogrow to field', () => {
    textarea.autogrow = true;
    expect(textarea.getAttribute('autogrow')).toEqual('true');

    textarea.autogrow = false;
    expect(textarea.getAttribute('autogrow')).toEqual(null);
  });

  test('set autogrow to field', () => {
    textarea.autogrow = true;
    expect(textarea.getAttribute('autogrow')).toEqual('true');
    textarea.maxHeight = 200;
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

  test('set min/max height', () => {
    textarea.maxHeight = 500;
    expect(textarea.container.classList.contains('has-max-height')).toBeTruthy();
    expect(textarea.input.style.maxHeight).toEqual('500px');
    textarea.minHeight = 200;
    expect(textarea.container.classList.contains('has-min-height')).toBeTruthy();
    expect(textarea.input.style.minHeight).toEqual('200px');
  });

  test('set min/max width', () => {
    textarea.maxWidth = 500;
    expect(textarea.container.classList.contains('has-max-width')).toBeTruthy();
    expect(textarea.input.style.maxWidth).toEqual('500px');
    textarea.minWidth = 200;
    expect(textarea.container.classList.contains('has-min-width')).toBeTruthy();
    expect(textarea.input.style.minWidth).toEqual('200px');
  });

  test('should set value with slotchange', (done) => {
    textarea.textContent = 'test';
    expect(textarea.textContent).toEqual('test');
    setTimeout(() => {
      expect(textarea.value).toEqual('test');
      done();
    }, 1);
  });

  test('renders autogrow and max height to field', () => {
    expect(textarea.getAttribute('max-height')).toEqual(null);
    textarea.maxHeight = true;
    textarea.autogrow = true;
    expect(textarea.getAttribute('max-height')).toEqual('true');
    textarea.maxHeight = false;
    expect(textarea.getAttribute('max-height')).toEqual(null);
  });

  test('renders clearable to field', () => {
    expect(textarea.getAttribute('clearable')).toEqual(null);
    expect(textarea.input.classList).not.toContain('has-clearable');
    textarea.clearable = true;
    expect(textarea.getAttribute('clearable')).toEqual('true');
    expect(textarea.container.classList).toContain('has-clearable');
    textarea.clearable = false;
    expect(textarea.getAttribute('clearable')).toEqual(null);
    expect(textarea.container.classList).not.toContain('has-clearable');
  });

  test('renders resizable to field', () => {
    expect(textarea.getAttribute('resizable')).toEqual(null);
    expect(textarea.container.classList).not.toContain('resizable');
    textarea.resizable = true;
    expect(textarea.getAttribute('resizable')).toEqual('true');
    expect(textarea.container.classList).toContain('resizable');
    textarea.resizable = 'x';
    expect(textarea.getAttribute('resizable')).toEqual('x');
    expect(textarea.container.classList).toContain('resizable-x');
    textarea.resizable = 'y';
    expect(textarea.getAttribute('resizable')).toEqual('y');
    expect(textarea.container.classList).toContain('resizable-y');
    textarea.resizable = 'both';
    expect(textarea.getAttribute('resizable')).toEqual('both');
    expect(textarea.container.classList).toContain('resizable');
    textarea.resizable = false;
    expect(textarea.getAttribute('resizable')).toEqual(null);
    expect(textarea.container.classList).not.toContain('resizable');
  });

  test('renders printable to field', () => {
    expect(textarea.getAttribute('printable')).toEqual(null);
    expect(textarea.shadowRoot.querySelector('.textarea-print')).toBeTruthy();
    textarea.printable = 'true';
    expect(textarea.getAttribute('printable')).toEqual('true');
    expect(textarea.shadowRoot.querySelector('.textarea-print')).toBeTruthy();
    textarea.printable = 'false';
    expect(textarea.getAttribute('printable')).toEqual(null);
    expect(textarea.shadowRoot.querySelector('.textarea-print')).toBeFalsy();
    textarea.value = 'test';
    textarea.printable = null;
    expect(textarea.getAttribute('printable')).toEqual(null);
    expect(textarea.shadowRoot.querySelector('.textarea-print')).toBeTruthy();
  });

  test('renders maxlength to field', () => {
    expect(textarea.getAttribute('maxlength')).toEqual(null);
    expect(textarea.input.getAttribute('maxlength')).toBe(null);
    textarea.maxlength = '90';
    expect(textarea.getAttribute('maxlength')).toEqual('90');
    expect(textarea.input.getAttribute('maxlength')).toBe('90');
    textarea.maxlength = null;
    expect(textarea.getAttribute('maxlength')).toEqual(null);
    expect(textarea.input.getAttribute('maxlength')).toBe(null);
  });

  test('renders character counter to field', () => {
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
    textarea.maxlength = null;
    textarea.characterCounter = 'false';
    expect(textarea.getAttribute('character-counter')).toEqual('false');
    expect(textarea.shadowRoot.querySelector('.textarea-character-counter')).toBeFalsy();
    textarea.maxlength = '90';
    textarea.characterCounter = null;
    expect(textarea.getAttribute('character-counter')).toEqual(null);
    expect(textarea.shadowRoot.querySelector('.textarea-character-counter')).toBeTruthy();
  });

  test('renders char-max-text as default to field', () => {
    const valueMax = '012345678901234567890';
    const valueAlmostEmpty = '012345678901234';
    const maxlength = 20;
    const defaultText = {
      charMaxText: `Character count maximum of {0}`,
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
    expect(counter.textContent).toEqual('Character count maximum of 20');
    expect(counter.classList).not.toContain('almost-empty');
  });

  test('renders char-max-text as custom to field', () => {
    const valueMax = '01234567890123456789';
    const maxlength = '20';
    const defaultText: any = {
      charMaxText: `Character count maximum of {0}`,
      charRemainingText: `Characters left ${maxlength}`
    };
    defaultText.charMaxTextVal = `${defaultText.charMaxText} ${maxlength}`;
    defaultText.charRemainingTextVal = defaultText.charRemainingText.replace('{0}', maxlength);

    const customText: any = {
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

  test('should skip invalid textarea state', () => {
    expect(textarea.getAttribute('test')).toEqual(null);
    expect(textarea.input.getAttribute('test')).toBe(null);
    expect(textarea.container.classList).not.toContain('test');
    textarea.setTextareaState('test');
    expect(textarea.getAttribute('test')).toEqual(null);
    expect(textarea.input.getAttribute('test')).toBe(null);
    expect(textarea.container.classList).not.toContain('test');
  });

  test('should count line breaks', () => {
    expect(textarea.countLinebreaks('test\n-\nabc')).toEqual(2);
    expect(textarea.countLinebreaks('test-abc')).toEqual(0);
  });

  test('should setup browser', () => {
    Object.defineProperty(window.navigator, 'userAgent', ((value) => ({
      get() { return value; },
      set(v) { value = v; } // eslint-disable-line
    }))(window.navigator.userAgent));

    expect(textarea.isSafari).toEqual(false);
    (global.navigator as any).userAgent = 'Safari';
    expect(global.navigator.userAgent).toBe('Safari');
    textarea.setBrowser();
    expect(textarea.isSafari).toEqual(true);

    (global.navigator as any).userAgent = 'Chrome';
    expect(global.navigator.userAgent).toBe('Chrome');
    textarea.setBrowser();
    expect(textarea.isSafari).toEqual(false);

    (global.navigator as any).userAgent = 'Android';
    expect(global.navigator.userAgent).toBe('Android');
    textarea.setBrowser();
    expect(textarea.isSafari).toEqual(false);

    Object.defineProperty(window.navigator, 'vendor', ((value) => ({
      get() { return value; },
      set(v) { value = v; } // eslint-disable-line
    }))(window.navigator.vendor));
    (global.navigator as any).userAgent = null;
    (global.navigator as any).vendor = 'Safari';
    expect(global.navigator.vendor).toBe('Safari');
    textarea.setBrowser();
    expect(textarea.isSafari).toEqual(true);

    Object.defineProperty(window, 'opera', ((value) => ({
      get() { return value; },
      set(v) { value = v; } // eslint-disable-line
    }))((window as any).opera));
    (global.navigator as any).userAgent = null;
    (global.navigator as any).vendor = null;
    (global as any).opera = 'Safari';
    expect((global as any).opera).toBe('Safari');
    textarea.setBrowser();
    expect(textarea.isSafari).toEqual(true);
  });

  test('should destroy dirty tracking', () => {
    expect(textarea.getAttribute('dirty-tracker')).toEqual(null);
    expect(textarea.shadowRoot.querySelector('.icon-dirty')).toBeFalsy();
    expect(textarea.labelEl.querySelector('.msg-dirty')).toBeFalsy();
    textarea.dirtyTracker = true;
    expect(textarea.dirtyTracker).toEqual(true);
    textarea.input.value = 'test';
    const event = new Event('change', { bubbles: true });
    textarea.input.dispatchEvent(event);
    expect(textarea.shadowRoot.querySelector('.icon-dirty')).toBeTruthy();
    expect(textarea.labelEl.querySelector('.msg-dirty')).toBeTruthy();
    textarea.destroyDirtyTracker();
    expect(textarea.shadowRoot.querySelector('.icon-dirty')).toBeFalsy();
    expect(textarea.labelEl.querySelector('.msg-dirty')).toBeFalsy();
  });

  test('can have dirty tracking', () => {
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

  test('should autoselect', (done) => {
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

  test('should not set wrong text-align', () => {
    textarea.textAlign = 'test';
    expect(textarea.getAttribute('text-align')).toEqual('left');
    expect(textarea.input.classList).not.toContain('test');

    const textAlign = 'right';
    textarea.textAlign = textAlign;
    expect(textarea.getAttribute('text-align')).toEqual(textAlign);
    expect(textarea.input.classList).toContain(textAlign);
  });

  test('should textarea text-align', () => {
    const textAligns: string[] = ['left', 'center', 'right'];
    const checkAlign = (textAlign: string) => {
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

  test('should dispatch native events', () => {
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

  test('should not set wrong size', () => {
    textarea.size = 'test';
    expect(textarea.getAttribute('size')).toEqual('md');
    expect(textarea.input.classList).not.toContain('test');
    const size = 'sm';
    textarea.size = size;
    expect(textarea.getAttribute('size')).toEqual(size);
    expect(textarea.shadowRoot.querySelector('.field-container').classList).toContain(size);
  });

  test('should rendr textarea sizes', () => {
    const sizes = ['sm', 'md', 'lg', 'full'];
    const checkSize = (size: string) => {
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
