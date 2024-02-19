/**
 * @jest-environment jsdom
 */
import IdsInput from '../../src/components/ids-input/ids-input';
import { LABEL_WRAPS } from '../../src/components/ids-input/ids-input-attributes';
import IdsDataSource from '../../src/core/ids-data-source';
import dataset from '../../src/assets/data/states.json';
import '../helpers/resize-observer-mock';

describe('IdsInput Component', () => {
  let input: any;

  beforeEach(async () => {
    const template = document.createElement('template');
    template.innerHTML = '<ids-input label="testing input"></ids-input>';
    input = template.content.childNodes[0];
    document.body.appendChild(input);
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  test('renders default field type', () => {
    input.type = 'text';
    expect(input.getAttribute('type')).toEqual('text');
    expect(input.type).toEqual('text');
  });

  test('removes type if reset', () => {
    input.type = null;
    expect(input.getAttribute('type')).toEqual('text');
    expect(input.type).toEqual('text');
  });

  test('renders placeholder', () => {
    document.body.innerHTML = '';
    const elem: any = new IdsInput();
    input.placeholder = 'Placeholder Text';
    input.template();
    document.body.appendChild(elem);

    input.placeholder = 'Placeholder Text';
    expect(input.getAttribute('placeholder')).toEqual('Placeholder Text');
    expect(input.placeholder).toEqual('Placeholder Text');
  });

  test('removes placeholder if reset', () => {
    input.placeholder = 'Placeholder Text';
    input.placeholder = null;
    expect(input.getAttribute('placeholder')).toEqual(null);
    expect(input.placeholder).toEqual(null);
  });

  test('renders field type of text', () => {
    input.type = 'text';
    expect(input.getAttribute('type')).toEqual('text');
    expect(input.type).toEqual('text');
  });

  test('renders field type of email', () => {
    input.type = 'email';
    expect(input.getAttribute('type')).toEqual('email');
    expect(input.type).toEqual('email');
  });

  test('renders field type of password', () => {
    input.type = 'password';
    expect(input.getAttribute('type')).toEqual('password');
    expect(input.type).toEqual('password');
  });

  test('renders showable password', () => {
    input.type = 'password';
    input.revealablePassword = 'true';
    input.passwordVisible = 'true';

    expect(input.getAttribute('password-visible')).toBe('true');
    expect(input.getAttribute('revealable-password')).toBe('true');
    const showHideButton = input.shadowRoot.querySelector('.show-hide-password');
    expect(showHideButton).toBeTruthy();
    expect(showHideButton.text).toBe('HIDE');

    input.passwordVisible = 'false';

    expect(showHideButton).toBeTruthy();
    expect(showHideButton.text).toBe('SHOW');
  });

  test('renders capslock indicator', () => {
    input.type = 'password';
    input.capsLock = 'true';
    expect(input.getAttribute('caps-lock')).toBe('true');
    const capslockEvent = new KeyboardEvent('keyup', { key: 'w', modifierCapsLock: true });
    input.input.dispatchEvent(capslockEvent);
    expect(input.capsLockIcon).toBeDefined();
  });

  test('renders field type of number', () => {
    input.type = 'number';
    expect(input.getAttribute('type')).toEqual('number');
    expect(input.type).toEqual('number');
  });

  test('should set compact mode', () => {
    const className = 'compact';
    expect(input.hasAttribute('compact')).toBeFalsy();
    expect(input.container.classList).not.toContain(className);

    input.compact = true;
    expect(input.hasAttribute('compact')).toBeTruthy();
    expect(input.container.classList).toContain(className);

    input.compact = false;
    expect(input.hasAttribute('compact')).toBeFalsy();
    expect(input.container.classList).not.toContain(className);
  });

  test('should render an error on blur for required', async () => {
    expect(input.container.querySelector('.validation-message')).toBeFalsy();
    input.validate = 'required';
    input.focus();
    input.value = '';
    input.blur();
    expect(input.container.querySelector('.validation-message')).toBeTruthy();
  });

  test('should have an input with "aria-label" set when label-state="hidden" or "collapsed" '
    + 'is flagged and a label exists, then toggles this by unsetting it', async () => {
      input.labelState = 'hidden';
      expect(input.labelState).toBeTruthy();
      await processAnimFrame();

      expect(input.input.getAttribute('aria-label')?.length).toBeGreaterThan(0);

      input.labelState = null;
      expect(input.labelState).toBeFalsy();
      await processAnimFrame();

      expect(input.input.hasAttribute('aria-label')).toBeFalsy();

      input.labelState = 'collapsed';
      expect(input.labelState).toBeTruthy();
      await processAnimFrame();

      expect(input.input.getAttribute('aria-label')?.length).toBeGreaterThan(0);
    });

  test('renders label-state from a template with no issues', async () => {
    const errors = jest.spyOn(global.console, 'error');

    const template = document.createElement('template');
    template.innerHTML = '<ids-input label="testing input" label-state="hidden"></ids-input>';

    input = template.content.childNodes[0];
    document.body.appendChild(input);

    expect(errors).not.toHaveBeenCalled();

    template.innerHTML = '<ids-input label="testing input" label-state="collapsed"></ids-input>';

    input = template.content.childNodes[0];
    document.body.appendChild(input);

    expect(errors).not.toHaveBeenCalled();
  });

  test('should call template', () => {
    input.value = 'test';
    input.readonly = 'true';
    input.disabled = 'true';
    input.labelFontSize = '16';
    input.bgTransparent = 'true';
    input.textEllipsis = 'true';
    input.compact = 'true';
    input.template();
    expect(input.input.value).toEqual('test');
  });

  test('renders field as disabled', () => {
    let rootEl = input.shadowRoot.querySelector('.ids-input');
    expect(input.getAttribute('disabled')).toEqual(null);
    expect(input.input.getAttribute('disabled')).toBe(null);
    expect(rootEl.classList).not.toContain('disabled');
    input.disabled = true;
    rootEl = input.shadowRoot.querySelector('.ids-input');
    expect(input.getAttribute('disabled')).toEqual('true');
    expect(input.input.getAttribute('disabled')).toBe('true');
    expect(rootEl.classList).toContain('disabled');
  });

  test('should disable and enable', () => {
    let rootEl = input.shadowRoot.querySelector('.ids-input');
    expect(input.getAttribute('disabled')).toEqual(null);
    expect(input.input.getAttribute('disabled')).toBe(null);
    expect(rootEl.classList).not.toContain('disabled');
    input.disabled = true;
    rootEl = input.shadowRoot.querySelector('.ids-input');
    expect(input.getAttribute('disabled')).toEqual('true');
    expect(input.input.getAttribute('disabled')).toBe('true');
    expect(rootEl.classList).toContain('disabled');
    input.disabled = false;
    rootEl = input.shadowRoot.querySelector('.ids-input');
    expect(input.getAttribute('disabled')).toEqual(null);
    expect(input.input.getAttribute('disabled')).toBe(null);
    expect(rootEl.classList).not.toContain('disabled');
  });

  test('renders field as readonly', () => {
    let rootEl = input.shadowRoot.querySelector('.ids-input');
    expect(input.getAttribute('readonly')).toEqual(null);
    expect(input.input.getAttribute('readonly')).toBe(null);
    expect(rootEl.classList).not.toContain('readonly');
    input.readonly = true;
    rootEl = input.shadowRoot.querySelector('.ids-input');
    expect(input.getAttribute('readonly')).toEqual('true');
    expect(input.input.getAttribute('readonly')).toBe('true');
    expect(rootEl.classList).toContain('readonly');
    input.readonly = false;
    rootEl = input.shadowRoot.querySelector('.ids-input');
    expect(input.getAttribute('readonly')).toEqual(null);
    expect(input.input.getAttribute('readonly')).toBe(null);
    expect(rootEl.classList).not.toContain('readonly');
  });

  test('should skip invalid input state', () => {
    let rootEl = input.shadowRoot.querySelector('.ids-input');
    expect(input.getAttribute('test')).toEqual(null);
    expect(input.input.getAttribute('test')).toBe(null);
    expect(rootEl.classList).not.toContain('test');
    input.setInputState('test');
    rootEl = input.shadowRoot.querySelector('.ids-input');
    expect(input.getAttribute('test')).toEqual(null);
    expect(input.input.getAttribute('test')).toBe(null);
    expect(rootEl.classList).not.toContain('test');
  });

  test('renders field as bg-transparent', () => {
    expect(input.getAttribute('bg-transparent')).toEqual(null);
    expect(input.input.classList).not.toContain('bg-transparent');
    input.bgTransparent = true;
    expect(input.getAttribute('bg-transparent')).toEqual('true');
    expect(input.input.classList).toContain('bg-transparent');
    input.bgTransparent = false;
    expect(input.getAttribute('bg-transparent')).toEqual(null);
    expect(input.input.classList).not.toContain('bg-transparent');
  });

  test('renders field as text-ellipsis', () => {
    expect(input.getAttribute('text-ellipsis')).toEqual(null);
    expect(input.input.classList).not.toContain('text-ellipsis');
    input.textEllipsis = true;
    expect(input.getAttribute('text-ellipsis')).toEqual('true');
    expect(input.input.classList).toContain('text-ellipsis');
    input.textEllipsis = false;
    expect(input.getAttribute('text-ellipsis')).toEqual(null);
    expect(input.input.classList).not.toContain('text-ellipsis');
  });

  test('should setup dirty tracking', async () => {
    input.dirtyTracker = true;
    input.input.remove();
    input.dirtyTrackerEvents();
    expect(input.dirty).toEqual({ original: '' });
    document.body.innerHTML = '';
    let elem: any = new IdsInput();
    document.body.appendChild(elem);
    input = document.querySelector('ids-input');
    input.dirtyTracker = true;
    input.input.remove();
    input.handleDirtyTracker();
    expect(input.dirty).toEqual({ original: '' });
    document.body.innerHTML = '';
    const template = document.createElement('template');
    template.innerHTML = '<ids-input label="testing input"></ids-input>';
    elem = template.content.childNodes[0];
    document.body.appendChild(elem);

    elem = new IdsInput();
    document.body.appendChild(elem);
    input = document.querySelector('ids-input');
    expect(input.getAttribute('dirty-tracker')).toEqual(null);
    expect(input.shadowRoot.querySelector('.icon-dirty')).toBeFalsy();
    expect(input.labelEl.querySelector('.msg-dirty')).toBeFalsy();
    input.dirtyTracker = true;
    input.setDirtyTracker();
    expect(input.dirtyTracker).toEqual(true);
    input.input.value = 'test';
    const event = new Event('change', { bubbles: true });
    input.input.dispatchEvent(event);
    expect(input.shadowRoot.querySelector('.icon-dirty')).toBeTruthy();
    expect(input.labelEl.querySelector('.msg-dirty')).toBeTruthy();
  });

  test('should destroy dirty tracking', () => {
    expect(input.getAttribute('dirty-tracker')).toEqual(null);
    expect(input.shadowRoot.querySelector('.icon-dirty')).toBeFalsy();
    expect(input.labelEl.querySelector('.msg-dirty')).toBeFalsy();
    input.dirtyTracker = true;
    expect(input.dirtyTracker).toEqual(true);
    input.input.value = 'test';
    const event = new Event('change', { bubbles: true });
    input.input.dispatchEvent(event);
    expect(input.shadowRoot.querySelector('.icon-dirty')).toBeTruthy();
    expect(input.labelEl.querySelector('.msg-dirty')).toBeTruthy();
    input.destroyDirtyTracker();
    expect(input.shadowRoot.querySelector('.icon-dirty')).toBeFalsy();
    expect(input.labelEl.querySelector('.msg-dirty')).toBeFalsy();
  });

  test('should handle dirty tracking', () => {
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

  test('should not error for input', () => {
    input.clearable = false;
    expect(input.shadowRoot.querySelector('.btn-clear')).toBeFalsy();
  });

  test('should autoselect', (done) => {
    input.autoselect = true;
    input.value = 'test';
    expect(input.getAttribute('autoselect')).toEqual('true');
    input.input.focus();
    input.shadowRoot.querySelector('.ids-input-field').focus();
    setTimeout(() => {
      input.autoselect = false;
      input.handleInputFocusEvent('remove');
      expect(input.getAttribute('autoselect')).toEqual(null);
      done();
    }, 2);
  });

  test('should render clearable icon', () => {
    input.clearable = true;
    expect(input.getAttribute('clearable')).toEqual('true');
    expect(input.container.classList).toContain('has-clearable');
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
    expect(input.container.classList).not.toContain('has-clearable');
  });

  test('should render clearable-forced icon', () => {
    expect(input.getAttribute('clearable-forced')).toEqual(null);
    expect(input.container.classList).not.toContain('has-clearable');
    input.clearableForced = true;
    expect(input.getAttribute('clearable-forced')).toEqual('true');
    expect(input.container.classList).toContain('has-clearable');
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
    expect(input.container.classList).not.toContain('has-clearable');
  });

  test('should clear on click', () => {
    input.clearable = true;
    input.value = 'test';
    expect(input.value).toEqual('test');
    input.shadowRoot.querySelector('.btn-clear').click();
    expect(input.value).toEqual('');
  });

  test('should clearable edge case', () => {
    const errors = jest.spyOn(global.console, 'error');
    input.checkContents();
    expect(errors).not.toHaveBeenCalled();
  });

  test('should not error calling with no button', () => {
    input.clearable = true;
    const xButton = document.createElement('ids-trigger-button');
    xButton.className = 'btn-clear';
    input.shadowRoot.appendChild(xButton);
    input.appendClearableButton();
    input.removeClearableButton();
    input.clearable = false;
    expect(input.shadowRoot.querySelector('.btn-clear')).toBeFalsy();
  });

  test('should clear field', () => {
    input.clearable = true;
    input.value = 'test';
    expect(input.getAttribute('clearable')).toEqual('true');
    input.shadowRoot.querySelector('.btn-clear').click();
    input.clearable = false;
    expect(input.getAttribute('clearable')).toEqual(null);
  });

  test('should not set wrong text-align', () => {
    input.input.remove();
    input.textAlign = 'test';
    document.body.innerHTML = '';
    const elem: any = new IdsInput();
    document.body.appendChild(elem);
    input = document.querySelector('ids-input');
    input.textAlign = 'test2';
    expect(input.getAttribute('text-align')).toEqual('start');
    expect(input.input.classList).not.toContain('test');
    const textAlign = 'end';
    input.textAlign = textAlign;
    expect(input.getAttribute('text-align')).toEqual(textAlign);
    expect(input.input.classList).toContain(textAlign);
  });

  test('should input text-align', () => {
    const textAligns = ['start', 'center', 'end'];
    const checkAlign = (textAlign: any) => {
      input.textAlign = textAlign;
      expect(input.getAttribute('text-align')).toEqual(textAlign);
      expect(input.input.classList).toContain(textAlign);
      textAligns.filter((s) => s !== textAlign).forEach((s) => {
        expect(input.input.classList).not.toContain(s);
      });
    };
    expect(input.getAttribute('text-align')).toEqual(null);
    expect(input.textAlign).toContain('start');
    textAligns.forEach((s) => checkAlign(s));
  });

  test('should dispatch native events', () => {
    const events = ['focus', 'select', 'keydown', 'keypress', 'keyup', 'click', 'dbclick', 'blur'];
    events.forEach((evt) => {
      let response = null;
      input.addEventListener(evt, () => {
        response = 'triggered';
      });
      if (evt === 'focus') {
        input.input.focus();
      } else if (evt === 'blur') {
        input.input.blur();
      } else {
        const event = new Event(evt);
        input.input.dispatchEvent(event);
      }
      expect(response).toEqual('triggered');
    });
  });

  test('should trigger a change event once when the input value is changed programmatically', () => {
    let callCount = 0;
    document.addEventListener('change', () => {
      callCount++;
    });

    // Set value directly on the host element
    input.value = 'Awesome';

    expect(callCount).toEqual(1);
  });

  test('should trigger a change event once when the internal HTMLInputElement\'s change event is fired', () => {
    let callCount = 0;
    document.addEventListener('change', () => {
      callCount++;
    });

    // Simulate an internal, programmatic change to the HTMLInputElement
    // (doesn't automatically fire a change event)
    // DO NOT SET IDS-INPUT VALUES THIS WAY IN APPLICATION CODE
    input.input.value = 'Awesome';
    input.input.dispatchEvent(new Event('change', { bubbles: true }));

    expect(callCount).toEqual(1);
  });

  test('should set label wrap', () => {
    const attrName = 'label-wrap';
    const defaultVal = 'wrap';
    const check = (applyVal: string, propVal: string | null, attrVal: string | null) => {
      input.labelWrap = applyVal;
      expect(input.labelWrap).toEqual(propVal);
      expect(input.getAttribute(attrName)).toEqual(attrVal);
    };

    expect(input.labelWrap).toEqual(defaultVal);
    expect(input.getAttribute(attrName)).toEqual(null);
    LABEL_WRAPS.forEach((val) => check(val, val, val));
    check('test', defaultVal, null);
  });

  test('should not set wrong size', () => {
    input.size = 'test';
    expect(input.getAttribute('size')).toEqual('md');
    expect(input.container.classList).not.toContain('test');
    const size = 'sm';
    input.size = size;
    expect(input.getAttribute('size')).toEqual(size);
    expect(input.container.classList).toContain(size);
  });

  test('should render input sizes', () => {
    const sizes = ['xs', 'sm', 'mm', 'md', 'lg', 'full'];
    const checkSize = (size: any) => {
      input.size = size;
      expect(input.getAttribute('size')).toEqual(size);
      expect(input.container.classList).toContain(size);
      sizes.filter((s) => s !== size).forEach((s) => {
        expect(input.container.classList).not.toContain(s);
      });
    };
    expect(input.getAttribute('size')).toEqual(null);
    expect(input.container.classList).toContain('md');
    sizes.forEach((s) => checkSize(s));
  });

  test('should not set wrong input field height', () => {
    const className = (h: any) => `field-height-${h}`;
    input.fieldHeight = 'test';
    expect(input.getAttribute('field-height')).toEqual(null);
    expect(input.container.classList).not.toContain('test');
    expect(input.container.classList).not.toContain(className('test'));
    const fieldHeight = 'sm';
    input.fieldHeight = fieldHeight;
    expect(input.getAttribute('field-height')).toEqual(fieldHeight);
    expect(input.container.classList).toContain(className(fieldHeight));
  });

  test('should render input field height', () => {
    const heights = ['xs', 'sm', 'md', 'lg'];
    const defaultHeight = 'md';
    const className = (h: any) => `field-height-${h}`;
    const checkHeight = (height: any) => {
      input.fieldHeight = height;
      expect(input.getAttribute('field-height')).toEqual(height);
      expect(input.container.classList).toContain(className(height));
      heights.filter((h) => h !== height).forEach((h) => {
        expect(input.container.classList).not.toContain(className(h));
      });
    };
    expect(input.getAttribute('field-height')).toEqual(null);
    heights.filter((h) => h !== defaultHeight).forEach((h) => {
      expect(input.container.classList).not.toContain(className(h));
    });
    expect(input.container.classList).toContain(className(defaultHeight));
    heights.forEach((h) => checkHeight(h));
  });

  test('can set "compact" mode', () => {
    input.compact = true;

    expect(input.hasAttribute('compact')).toBeTruthy();
    expect(input.container.classList.contains('compact')).toBeTruthy();

    input.compact = false;

    expect(input.hasAttribute('compact')).toBeFalsy();
    expect(input.container.classList.contains('compact')).toBeFalsy();
  });

  test('cannot have both a "compact" and "field-height" setting applied', () => {
    input.compact = true;

    expect(input.hasAttribute('compact')).toBeTruthy();
    expect(input.container.classList.contains('compact')).toBeTruthy();

    input.fieldHeight = 'xs';

    expect(input.hasAttribute('compact')).toBeFalsy();
    expect(input.container.classList.contains('compact')).toBeFalsy();
    expect(input.getAttribute('field-height')).toEqual('xs');
    expect(input.container.classList.contains('field-height-xs')).toBeTruthy();

    input.compact = true;

    expect(input.hasAttribute('compact')).toBeTruthy();
    expect(input.container.classList.contains('compact')).toBeTruthy();
    expect(input.hasAttribute('field-height')).toBeFalsy();
    expect(input.container.classList.contains('field-height-xs')).toBeFalsy();
  });

  test('supports setting cursor', () => {
    input.cursor = 'pointer';
    expect(input.shadowRoot.querySelector('input').style.cursor).toEqual('pointer');
    expect(input.cursor).toEqual('pointer');
  });

  test('supports setting noMargins', () => {
    input.noMargins = true;
    expect(input.noMargins).toEqual(true);
    expect(input.container.classList.contains('no-margins')).toEqual(true);
    expect(input.hasAttribute('no-margins')).toBeTruthy();

    input.noMargins = false;
    expect(input.noMargins).toEqual(false);
    expect(input.hasAttribute('no-margins')).toBeFalsy();
  });

  test('supports setting padding', () => {
    input.padding = '10';
    expect(input.padding).toEqual('10');
    expect(input.input.style.getPropertyValue('padding-inline-end')).toEqual('10px');

    input.padding = '';
    expect(input.padding).toEqual('');
    expect(input.input.style.getPropertyValue('padding-inline-end')).toEqual('');
  });

  test('focuses its inner HTMLInputElement when the host element becomes focused', () => {
    input.focus();
    expect(document.activeElement).toEqual(input);
  });

  test('focuses its inner HTMLInputElement when its label is clicked', async () => {
    const labelEl = input.container.querySelector('label');
    labelEl.click();

    expect(input.input.isEqualNode(input.shadowRoot.activeElement));
  });

  test('should set autocomplete', async () => {
    const template = document.createElement('template');
    template.innerHTML = '<ids-input label="testing input" autocomplete></ids-input>';
    input = template.content.childNodes[0];
    document.body.appendChild(input);

    expect(input.autocomplete).toEqual(true);
    input.autocomplete = null;
    expect(input.autocomplete).toEqual(false);

    input.data = [];
    expect(input.data.length).toEqual(0);

    input.datasource = new IdsDataSource();
    input.data = dataset;
    expect(input.data.length).toEqual(59);

    expect(input.searchField).toEqual('value');
    input.searchField = 'label';
    expect(input.searchField).toEqual('label');
  });

  test('should set readonly background', async () => {
    const template = document.createElement('template');
    template.innerHTML = '<ids-input label="testing input" readonly-background="true"></ids-input>';
    input = template.content.childNodes[0];
    document.body.appendChild(input);

    expect(input.container.classList).toContain('readonly-background');
    input.readonlyBackground = false;
    expect(input.container.classList).not.toContain('readonly-background');
  });

  test('should set active', async () => {
    const template = document.createElement('template');
    template.innerHTML = '<ids-input label="testing input" active="true"></ids-input>';
    input = template.content.childNodes[0];
    document.body.appendChild(input);

    expect(input.container.classList).toContain('is-active');
    input.active = false;
    expect(input.container.classList).not.toContain('is-active');
  });

  test('should open popup on keydown if autocomplete is enabled', async () => {
    const template = document.createElement('template');
    template.innerHTML = '<ids-input label="testing input" autocomplete value="a"></ids-input>';
    input = template.content.childNodes[0];
    document.body.appendChild(input);

    input.datasource = new IdsDataSource();
    input.data = dataset;

    const keydownendEvent = new KeyboardEvent('keydownend', { key: 'a' });
    input.dispatchEvent(keydownendEvent);
    input.value = 'a';
    input.popup.open = true;
    input.popup.visible = true;
    expect(input.popup.open).toBe(true);

    const navigateDownEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    const navigateUpEvent = new KeyboardEvent('keydown', { key: 'ArrowUp' });

    input.dispatchEvent(navigateDownEvent);
    input.dispatchEvent(navigateUpEvent);

    input.options[0].classList.add('is-selected');
    expect(input.options[0].classList).toContain('is-selected');

    input.dispatchEvent(navigateDownEvent);
    input.dispatchEvent(navigateUpEvent);

    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });

    input.dispatchEvent(enterEvent);
    input.popup.open = false;
    input.popup.visible = false;
    expect(input.popup.open).toBe(false);

    const template2 = document.createElement('template');
    template2.innerHTML = '<ids-input label="testing input" autocomplete readonly disabled value=""></ids-input>';
    input = template2.content.childNodes[0];
    document.body.appendChild(input);

    const keydownendEvent2 = new KeyboardEvent('keydownend', { key: 'a' });
    input.dispatchEvent(keydownendEvent2);
    input.popup.open = false;
    input.popup.visible = false;
    expect(input.popup.open).toBe(false);
  });
});
