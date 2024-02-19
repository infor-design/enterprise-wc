/**
 * @jest-environment jsdom
 */
import IdsUpload from '../../src/components/ids-upload/ids-upload';

jest.useFakeTimers();

describe('IdsUpload Component', () => {
  let upload: any;

  beforeEach(async () => {
    const elem: any = new IdsUpload();
    document.body.appendChild(elem);
    upload = document.querySelector('ids-upload');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  test('renders placeholder', () => {
    document.body.innerHTML = '';
    const elem: any = new IdsUpload();
    upload.placeholder = 'Placeholder Text';
    upload.template();
    document.body.appendChild(elem);
    upload.placeholder = 'Placeholder Text';
    expect(upload.getAttribute('placeholder')).toEqual('Placeholder Text');
    expect(upload.placeholder).toEqual('Placeholder Text');
    upload.placeholder = null;
    expect(upload.getAttribute('placeholder')).toEqual(null);
    expect(upload.placeholder).toEqual(null);
  });

  test('should handle events', () => {
    expect(upload.isFilePickerOpened).toEqual(false);
    upload.value = 'test';
    upload.isFilePickerOpened = true;
    let event = new Event('focus', { bubbles: true });
    window.dispatchEvent(event);
    window.dispatchEvent(event);
    event = new Event('filescancel', { bubbles: true });
    upload.fileInput.dispatchEvent(event);
    event = new Event('click', { bubbles: true });
    upload.trigger.dispatchEvent(event);
    expect(upload.value).toEqual('test');
    event = new KeyboardEvent('keydown', { code: 'Backspace' });
    upload.textInput.dispatchEvent(event);
    event = new Event('cleared', { bubbles: true });
    upload.textInput.dispatchEvent(event);
    event = new Event('change', { bubbles: true });
    upload.fileInput.dispatchEvent(event);
    expect(upload.value).toEqual(null);
    event = new KeyboardEvent('keydown', { code: 'Enter' });
    upload.textInput.dispatchEvent(event);
    event = new KeyboardEvent('keydown', { code: 'ArrowDown' });
    upload.textInput.dispatchEvent(event);
    expect(upload.isFilePickerOpened).toEqual(true);
  });

  test('should drag drop', () => {
    const zIndex = () => window.getComputedStyle(upload.fileInput).getPropertyValue('z-index');
    const createBubbledEvent = (type: any, attributes = {}) => {
      const event = new Event(type, { bubbles: true });
      Object.assign(event, attributes);
      return event;
    };
    upload.disabled = true;
    upload.handleTextInputDragDrop();
    upload.disabled = false;
    upload.handleTextInputDragDrop();
    expect(zIndex()).toEqual('');
    upload.textInput.dispatchEvent(
      createBubbledEvent('dragenter', { clientX: 0, clientY: 0 })
    );
    expect(zIndex()).toEqual('1');
    upload.textInput.dispatchEvent(
      createBubbledEvent('drop', { clientX: 0, clientY: 1 })
    );
    jest.advanceTimersByTime(2);
    expect(zIndex()).toEqual('');
  });

  test('should call template', () => {
    upload.accept = '.jpg';
    upload.dirtyTracker = 'true';
    upload.disabled = 'true';
    upload.noTextEllipsis = 'true';
    upload.label = 'test';
    upload.multiple = 'true';
    upload.readonly = 'true';
    upload.size = 'sm';
    upload.validate = 'required';
    upload.value = 'test-value';
    upload.colorVariant = 'alternate-formatter';
    upload.fieldHeight = 'lg';
    upload.labelState = 'hidden';
    upload.noMargins = true;
    expect(upload.fileInput.getAttribute('accept')).toEqual('.jpg');
    expect(upload.fileInput.getAttribute('multiple')).toEqual('multiple');
    expect(upload.textInput.getAttribute('dirty-tracker')).toEqual('true');
    expect(upload.textInput.getAttribute('disabled')).toEqual('true');
    expect(upload.textInput.getAttribute('text-ellipsis')).toEqual('true');
    expect(upload.textInput.getAttribute('label')).toEqual('test');
    expect(upload.textInput.getAttribute('readonly')).toBeTruthy();
    expect(upload.textInput.getAttribute('size')).toEqual('sm');
    expect(upload.textInput.getAttribute('validate')).toEqual('required');
    expect(upload.textInput.value).toEqual('test-value');
    expect(upload.textInput.colorVariant).toEqual('alternate-formatter');
    expect(upload.textInput.fieldHeight).toEqual('lg');
    expect(upload.textInput.labelState).toEqual('hidden');
    expect(upload.textInput.noMargins).toEqual(true);
    upload.compact = true;
    expect(upload.textInput.compact).toEqual(true);
  });

  test('should set hasAccess', () => {
    expect(upload.textInput.value).toEqual('');
    upload.value = 'test';
    expect(upload.textInput.value).toEqual('test');
    upload.clear();
    expect(upload.textInput.value).toEqual('');
    upload.value = 'test2';
    expect(upload.textInput.value).toEqual('test2');
    upload.disabled = 'true';
    upload.clear();
    expect(upload.textInput.value).toEqual('test2');
    expect(upload.isFilePickerOpened).toEqual(false);
    upload.open();
    expect(upload.isFilePickerOpened).toEqual(false);
    upload.disabled = null;
    upload.open();
    expect(upload.isFilePickerOpened).toEqual(true);
  });

  test('should disable and enable', () => {
    expect(upload.getAttribute('disabled')).toEqual(null);
    expect(upload.textInput.readonly).toBe(true);
    expect(upload.textInput.disabled).toBe(false);
    upload.disabled = true;
    expect(upload.getAttribute('disabled')).toBeTruthy();
    expect(upload.textInput.readonly).toBe(false);
    expect(upload.textInput.disabled).toBe(true);
    upload.disabled = false;
    expect(upload.getAttribute('disabled')).toEqual(null);
    expect(upload.textInput.readonly).toBe(false);
    expect(upload.textInput.disabled).toBe(false);
  });

  test('renders field as readonly', () => {
    expect(upload.getAttribute('readonly')).toEqual(null);
    expect(upload.textInput.readonlyBackground).toBeTruthy();
    upload.readonly = true;
    expect(upload.getAttribute('readonly')).toBeTruthy();
    expect(upload.textInput.readonlyBackground).toBeFalsy();
    upload.textInput.readonly = false;
    upload.readonly = false;
    expect(upload.textInput.readonly).toBe(true);
    expect(upload.getAttribute('readonly')).toEqual(null);
    expect(upload.textInput.readonlyBackground).toBeTruthy();
  });

  test('renders as limit types accept', () => {
    expect(upload.getAttribute('accept')).toEqual(null);
    expect(upload.fileInput.getAttribute('accept')).toEqual(null);
    upload.accept = '.jpg';
    expect(upload.getAttribute('accept')).toEqual('.jpg');
    expect(upload.fileInput.getAttribute('accept')).toEqual('.jpg');
    upload.accept = null;
    expect(upload.getAttribute('accept')).toEqual(null);
    expect(upload.fileInput.getAttribute('accept')).toEqual(null);
  });

  test('renders as multiple files', () => {
    expect(upload.getAttribute('multiple')).toEqual(null);
    expect(upload.fileInput.getAttribute('multiple')).toEqual(null);
    upload.multiple = true;
    expect(upload.getAttribute('multiple')).toEqual('true');
    expect(upload.fileInput.getAttribute('multiple')).toEqual('multiple');
    upload.multiple = null;
    expect(upload.getAttribute('multiple')).toEqual(null);
    expect(upload.fileInput.getAttribute('multiple')).toEqual(null);
  });

  test('should set text-ellipsis', () => {
    expect(upload.getAttribute('text-ellipsis')).toEqual(null);
    expect(upload.textEllipsis).toBe(true);
    expect(upload.textInput.textEllipsis).toBeTruthy();
    upload.textEllipsis = true;
    expect(upload.getAttribute('text-ellipsis')).toBeTruthy();
    expect(upload.textEllipsis).toBeTruthy();
    expect(upload.textInput.textEllipsis).toBe(true);
    upload.textEllipsis = false;
    expect(upload.getAttribute('text-ellipsis')).toEqual('false');
    expect(upload.textEllipsis).toBe(false);
    expect(upload.textInput.textEllipsis).toBe(false);
    upload.textEllipsis = null;
    expect(upload.getAttribute('text-ellipsis')).toEqual(null);
    expect(upload.textEllipsis).toBe(true);
    expect(upload.textInput.textEllipsis).toBeTruthy();
  });

  test('should render validate', () => {
    expect(upload.getAttribute('validate')).toEqual(null);
    expect(upload.textInput.validate).toBe(null);
    upload.validate = 'required';
    expect(upload.getAttribute('validate')).toEqual('required');
    expect(upload.textInput.validate).toBe('required');
    upload.validate = null;
    expect(upload.getAttribute('validate')).toEqual(null);
    expect(upload.textInput.validate).toBe(null);
  });

  test('should render validation-events', () => {
    expect(upload.getAttribute('validation-events')).toEqual(null);
    expect(upload.textInput.validationEvents).toBe('blur change');
    upload.validationEvents = 'blur';
    expect(upload.getAttribute('validation-events')).toEqual('blur');
    expect(upload.textInput.validationEvents).toBe('blur');
    upload.validationEvents = null;
    expect(upload.getAttribute('validation-events')).toEqual(null);
    expect(upload.textInput.validationEvents).toBe('blur change');
  });

  test('should render value', () => {
    expect(upload.getAttribute('value')).toEqual(null);
    expect(upload.textInput.value).toBe('');
    upload.value = 'test';
    expect(upload.getAttribute('value')).toEqual('test');
    expect(upload.textInput.value).toBe('test');
    upload.value = null;
    expect(upload.getAttribute('value')).toEqual(null);
    expect(upload.textInput.value).toBe('');
  });

  test('should render label', () => {
    expect(upload.getAttribute('label')).toEqual(null);
    expect(upload.textInput.label).toBe('');
    upload.label = 'test';
    expect(upload.getAttribute('label')).toEqual('test');
    expect(upload.textInput.label).toBe('test');
    upload.label = null;
    expect(upload.getAttribute('label')).toEqual(null);
    expect(upload.textInput.label).toBe('');
  });

  test('should set color variant', () => {
    expect(upload.getAttribute('color-variant')).toEqual(null);
    expect(upload.textInput.colorVariant).toBe(null);
    upload.colorVariant = 'alternate-formatter';
    expect(upload.getAttribute('color-variant')).toEqual('alternate-formatter');
    expect(upload.textInput.colorVariant).toBe('alternate-formatter');
  });

  test('should set label state', () => {
    expect(upload.getAttribute('label-state')).toEqual(null);
    expect(upload.textInput.labelState).toBe(null);
    upload.labelState = 'hidden';
    expect(upload.getAttribute('label-state')).toEqual('hidden');
    expect(upload.textInput.labelState).toBe('hidden');
    upload.labelState = null;
    expect(upload.getAttribute('label-state')).toEqual(null);
    expect(upload.textInput.labelState).toBe(null);
  });

  test('should set label required', () => {
    expect(upload.getAttribute('label-required')).toEqual(null);
    expect(upload.textInput.labelRequired).toBe(true);
    upload.labelRequired = 'false';
    expect(upload.getAttribute('label-required')).toEqual('false');
    expect(upload.textInput.labelRequired).toBe(false);
    upload.labelRequired = null;
    expect(upload.getAttribute('label-required')).toEqual('true');
    expect(upload.textInput.labelRequired).toBe(true);
  });

  test('should set no margins', () => {
    expect(upload.getAttribute('no-margins')).toEqual(null);
    expect(upload.textInput.noMargins).toBe(false);
    upload.noMargins = true;
    expect(upload.getAttribute('no-margins')).toEqual('true');
    expect(upload.textInput.noMargins).toBe(true);
    upload.noMargins = null;
    expect(upload.getAttribute('no-margins')).toEqual(null);
    expect(upload.textInput.noMargins).toBe(false);
  });

  test('should set tabbable', () => {
    expect(upload.getAttribute('tabbable')).toEqual(null);
    expect(upload.textInput.tabbable).toBe(false);
    upload.tabbable = true;
    expect(upload.getAttribute('tabbable')).toEqual('true');
    expect(upload.textInput.tabbable).toBe(true);
    upload.tabbable = null;
    expect(upload.getAttribute('tabbable')).toEqual(null);
    expect(upload.textInput.tabbable).toBe(false);
  });

  test('should set field-height and compact', () => {
    expect(upload.getAttribute('field-height')).toEqual(null);
    expect(upload.getAttribute('compact')).toEqual(null);
    expect(upload.textInput.fieldHeight).toBe('md');
    upload.fieldHeight = 'lg';
    expect(upload.getAttribute('field-height')).toEqual('lg');
    expect(upload.getAttribute('compact')).toEqual(null);
    expect(upload.textInput.fieldHeight).toBe('lg');
    upload.fieldHeight = null;
    upload.compact = true;
    expect(upload.getAttribute('field-height')).toEqual(null);
    expect(upload.getAttribute('compact')).toEqual('');
    expect(upload.textInput.fieldHeight).toBe('md');
    upload.compact = null;
    upload.onFieldHeightChange();
    expect(upload.getAttribute('field-height')).toEqual(null);
    expect(upload.getAttribute('compact')).toEqual(null);
    expect(upload.textInput.fieldHeight).toBe('md');
  });

  test('should render label filetype', () => {
    const labelDefault = ', Press Enter to Browse for files';
    expect(upload.getAttribute('label-filetype')).toEqual(null);
    let label = upload.shadowRoot.querySelector('.label-filetype');
    expect(label.textContent.trim()).toBe(labelDefault);
    upload.labelFiletype = 'test';
    expect(upload.getAttribute('label-filetype')).toEqual('test');
    label = upload.shadowRoot.querySelector('.label-filetype');
    expect(label.textContent.trim()).toBe('test');
    upload.labelFiletype = null;
    expect(upload.getAttribute('label-filetype')).toEqual(null);
    label = upload.shadowRoot.querySelector('.label-filetype');
    expect(label.textContent.trim()).toBe(labelDefault);
  });

  test('should render label trigger', () => {
    const labelDefault = 'trigger button for fileupload';
    expect(upload.getAttribute('trigger-label')).toEqual(null);
    let label = upload.shadowRoot.querySelector('.trigger-label');
    expect(label.textContent.trim()).toBe(labelDefault);
    upload.triggerLabel = 'test';
    expect(upload.getAttribute('trigger-label')).toEqual('test');
    label = upload.shadowRoot.querySelector('.trigger-label');
    expect(label.textContent.trim()).toBe('test');
    upload.triggerLabel = null;
    expect(upload.getAttribute('trigger-label')).toEqual(null);
    label = upload.shadowRoot.querySelector('.trigger-label');
    expect(label.textContent.trim()).toBe(labelDefault);
  });

  test('should setup dirty tracking', () => {
    expect(upload.getAttribute('dirty-tracker')).toEqual(null);
    expect(upload.textInput.getAttribute('dirty-tracker')).toEqual(null);
    expect(upload.textInput.dirtyTracker).toEqual(false);
    upload.dirtyTracker = true;
    expect(upload.getAttribute('dirty-tracker')).toEqual('true');
    expect(upload.textInput.getAttribute('dirty-tracker')).toEqual('true');
    expect(upload.textInput.dirtyTracker).toEqual(true);
    upload.dirtyTracker = false;
    expect(upload.getAttribute('dirty-tracker')).toEqual(null);
    expect(upload.textInput.getAttribute('dirty-tracker')).toEqual(null);
    expect(upload.textInput.dirtyTracker).toEqual(false);
  });

  test('should render upload sizes', () => {
    const sizes = ['xs', 'sm', 'mm', 'md', 'lg', 'full'];
    const checkSize = (size: string) => {
      upload.size = size;
      expect(upload.getAttribute('size')).toEqual(size);
      expect(upload.textInput.size).toEqual(size);
      sizes.filter((s) => s !== size).forEach((s) => {
        expect(upload.textInput.size).not.toEqual(s);
      });
    };
    expect(upload.getAttribute('size')).toEqual(null);
    sizes.forEach((s) => checkSize(s));
    expect(upload.getAttribute('size')).toEqual('full');
    upload.size = null;
    expect(upload.getAttribute('size')).toEqual(null);
  });
});
