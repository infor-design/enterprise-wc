/**
 * @jest-environment jsdom
 */
import IdsInput from '../../src/components/ids-input/ids-input';
import IdsClearableMixin from '../../src/mixins/ids-clearable-mixin/ids-clearable-mixin';
import processAnimFrame from '../helpers/process-anim-frame';

describe('IdsInput Component', () => {
  let input;

  beforeEach(async () => {
    const template = document.createElement('template');
    template.innerHTML = '<ids-input label="testing input"></ids-input>';
    input = template.content.childNodes[0];
    document.body.appendChild(input);
    await processAnimFrame();
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
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

  it('renders showable password', () => {
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

  it('renders capslock indicator', () => {
    input.type = 'password';
    input.capsLock = 'true';
    expect(input.getAttribute('caps-lock')).toBe('true');
    const capslockEvent = new KeyboardEvent('keyup', { key: 'w', modifierCapsLock: true });
    input.input.dispatchEvent(capslockEvent);
    expect(input.capsLockIcon).toBeDefined();
  });

  it('renders field type of number', () => {
    input.type = 'number';
    expect(input.getAttribute('type')).toEqual('number');
    expect(input.type).toEqual('number');
  });

  it('should set compact mode', () => {
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

  it('should set label text', () => {
    input.label = 'test';

    document.body.innerHTML = '';

    const template = document.createElement('template');
    template.innerHTML = '<ids-input label="Hello World"></ids-input>';
    const elem = template.content.childNodes[0];
    document.body.appendChild(elem);
    input = document.querySelector('ids-input');
    expect(input.labelEl.textContent.trim()).toBe('Hello World');
    input.label = 'test2';
    expect(input.labelEl.textContent.trim()).toBe('test2');
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
    expect(input.getAttribute('label-required')).toEqual('false');
    expect(input.labelEl.classList).toContain(className);
    expect(input.labelRequired).toEqual(false);
    input.labelRequired = true;
    expect(input.getAttribute('validate')).toEqual('required');
    expect(input.getAttribute('label-required')).toEqual('true');
    expect(input.labelEl.classList).not.toContain(className);
    expect(input.labelRequired).toEqual(true);
  });

  it('should render an error on blur for required', async () => {
    expect(input.container.querySelector('.validation-message')).toBeFalsy();
    input.validate = 'required';
    input.focus();
    input.value = '';
    input.blur();
    await processAnimFrame();
    expect(input.container.querySelector('.validation-message')).toBeTruthy();
  });

  it('should have an input with "aria-label" set when label-state="hidden" or "collapsed" '
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

  it('renders label-state from a template with no issues', async () => {
    const errors = jest.spyOn(global.console, 'error');

    const template = document.createElement('template');
    template.innerHTML = '<ids-input label="testing input" label-state="hidden"></ids-input>';

    input = template.content.childNodes[0];
    document.body.appendChild(input);
    await processAnimFrame();

    expect(errors).not.toHaveBeenCalled();

    template.innerHTML = '<ids-input label="testing input" label-state="collapsed"></ids-input>';

    input = template.content.childNodes[0];
    document.body.appendChild(input);
    await processAnimFrame();

    expect(errors).not.toHaveBeenCalled();
  });

  it('should set value', () => {
    expect(input.value).toEqual('');
    input.value = 'test';
    expect(input.value).toEqual('test');
    input.value = null;
    expect(input.value).toEqual('');
  });

  it('should call template', () => {
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

  it('renders field as disabled', () => {
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

  it('should disable and enable', () => {
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

  it('renders field as readonly', () => {
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

  it('should skip invalid input state', () => {
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

  it('should setup dirty tracking', async () => {
    input.dirtyTracker = true;
    input.input.remove();
    input.dirtyTrackerEvents();
    expect(input.dirty).toEqual({ original: '' });
    document.body.innerHTML = '';
    let elem = new IdsInput();
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
    await processAnimFrame();

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
    input.clearable = false;
    expect(input.shadowRoot.querySelector('.btn-clear')).toBeFalsy();
  });

  it('should autoselect', (done) => {
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

  it('should render clearable icon', () => {
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

  it('should render clearable-forced icon', () => {
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
    const xButton = document.createElement('ids-trigger-button');
    xButton.className = 'btn-clear';
    input.shadowRoot.appendChild(xButton);
    input.appendClearableButton();
    input.removeClearableButton();
    input.clearable = false;
    expect(input.shadowRoot.querySelector('.btn-clear')).toBeFalsy();
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
    const events = ['change', 'focus', 'select', 'keydown', 'keypress', 'click', 'dbclick'];
    events.forEach((evt) => {
      let response = null;
      input.addEventListener(evt, () => {
        response = 'triggered';
      });
      if (evt === 'focus') {
        input.input.focus();
      } else {
        const event = new Event(evt);
        input.input.dispatchEvent(event);
      }
      expect(response).toEqual('triggered');
    });
  });

  it('should not set wrong size', () => {
    input.size = 'test';
    expect(input.getAttribute('size')).toEqual('md');
    expect(input.container.classList).not.toContain('test');
    const size = 'sm';
    input.size = size;
    expect(input.getAttribute('size')).toEqual(size);
    expect(input.container.classList).toContain(size);
  });

  it('should render input sizes', () => {
    const sizes = ['xs', 'sm', 'mm', 'md', 'lg', 'full'];
    const checkSize = (size) => {
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

  it('should not set wrong input field height', () => {
    const className = (h) => `field-height-${h}`;
    input.fieldHeight = 'test';
    expect(input.getAttribute('field-height')).toEqual(null);
    expect(input.container.classList).not.toContain('test');
    expect(input.container.classList).not.toContain(className('test'));
    const fieldHeight = 'sm';
    input.fieldHeight = fieldHeight;
    expect(input.getAttribute('field-height')).toEqual(fieldHeight);
    expect(input.container.classList).toContain(className(fieldHeight));
  });

  it('should render input field height', () => {
    const heights = ['xs', 'sm', 'md', 'lg'];
    const defaultHeight = 'md';
    const className = (h) => `field-height-${h}`;
    const checkHeight = (height) => {
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

  it('can set "compact" mode', () => {
    input.compact = true;

    expect(input.hasAttribute('compact')).toBeTruthy();
    expect(input.container.classList.contains('compact')).toBeTruthy();

    input.compact = false;

    expect(input.hasAttribute('compact')).toBeFalsy();
    expect(input.container.classList.contains('compact')).toBeFalsy();
  });

  it('cannot have both a "compact" and "field-height" setting applied', () => {
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

  it('supports setting mode', () => {
    input.mode = 'dark';
    expect(input.container.getAttribute('mode')).toEqual('dark');
  });

  it('supports setting version', () => {
    input.version = 'classic';
    expect(input.container.getAttribute('version')).toEqual('classic');
  });

  it('supports setting cursor', () => {
    input.cursor = 'pointer';
    expect(input.shadowRoot.querySelector('input').style.cursor).toEqual('pointer');
    expect(input.cursor).toEqual('pointer');
  });

  it('supports setting noMargins', () => {
    input.noMargins = true;
    expect(input.noMargins).toEqual(true);
    expect(input.container.classList.contains('no-margins')).toEqual(true);
    expect(input.hasAttribute('no-margins')).toBeTruthy();

    input.noMargins = false;
    expect(input.noMargins).toEqual(false);
    expect(input.hasAttribute('no-margins')).toBeFalsy();
  });

  it('focuses its inner HTMLInputElement when the host element becomes focused', () => {
    input.focus();
    expect(document.activeElement).toEqual(input);
  });

  it('focuses its inner HTMLInputElement when its label is clicked', async () => {
    const labelEl = input.container.querySelector('label');
    labelEl.click();
    await processAnimFrame();

    expect(input.input.isEqualNode(input.shadowRoot.activeElement));
  });
});
