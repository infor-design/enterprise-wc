/**
 * @jest-environment jsdom
 */
import IdsUpload from '../../src/components/ids-upload/ids-upload';

jest.useFakeTimers();

describe('IdsUpload Component', () => {
  let upload;

  beforeEach(async () => {
    const elem = new IdsUpload();
    document.body.appendChild(elem);
    upload = document.querySelector('ids-upload');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    const elem = new IdsUpload();
    document.body.appendChild(elem);
    elem.remove();
    expect(document.querySelectorAll('ids-upload').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders placeholder', () => {
    document.body.innerHTML = '';
    const elem = new IdsUpload();
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

  it('should handle events', () => {
    expect(upload.isFilePickerOpened).toEqual(undefined);
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

  it('should drag drop', () => {
    const zIndex = () => window.getComputedStyle(upload.fileInput).getPropertyValue('z-index');
    const createBubbledEvent = (type, attributes = {}) => {
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

  it('should call template', () => {
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
    upload.template();
    expect(upload.fileInput.getAttribute('accept')).toEqual('.jpg');
    expect(upload.fileInput.getAttribute('multiple')).toEqual('multiple');
    expect(upload.textInput.getAttribute('dirty-tracker')).toEqual('true');
    expect(upload.textInput.getAttribute('disabled')).toEqual('true');
    expect(upload.textInput.getAttribute('text-ellipsis')).toEqual(null);
    expect(upload.textInput.getAttribute('label')).toEqual('test');
    expect(upload.textInput.getAttribute('readonly')).toEqual(null);
    expect(upload.textInput.getAttribute('size')).toEqual('sm');
    expect(upload.textInput.getAttribute('validate')).toEqual('required');
    expect(upload.textInput.value).toEqual('test-value');
  });

  it('should set hasAccess', () => {
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
    expect(upload.isFilePickerOpened).toEqual(undefined);
    upload.open();
    expect(upload.isFilePickerOpened).toEqual(undefined);
    upload.disabled = null;
    upload.open();
    expect(upload.isFilePickerOpened).toEqual(true);
  });

  it('should disable and enable', () => {
    expect(upload.getAttribute('disabled')).toEqual(null);
    expect(upload.textInput.readonly).toBe('true');
    expect(upload.textInput.disabled).toBe(null);
    upload.disabled = true;
    expect(upload.getAttribute('disabled')).toEqual('true');
    expect(upload.textInput.readonly).toBe(null);
    expect(upload.textInput.disabled).toBe('true');
    upload.disabled = false;
    expect(upload.getAttribute('disabled')).toEqual(null);
    expect(upload.textInput.readonly).toBe('true');
    expect(upload.textInput.disabled).toBe(null);
  });

  it('renders field as readonly', () => {
    expect(upload.getAttribute('readonly')).toEqual(null);
    expect(upload.textInput.bgTransparent).toBe('true');
    upload.readonly = true;
    expect(upload.getAttribute('readonly')).toEqual('true');
    expect(upload.textInput.bgTransparent).toBe(null);
    upload.readonly = false;
    expect(upload.getAttribute('readonly')).toEqual(null);
    expect(upload.textInput.bgTransparent).toBe('true');
  });

  it('renders as limit types accept', () => {
    expect(upload.getAttribute('accept')).toEqual(null);
    expect(upload.fileInput.getAttribute('accept')).toEqual(null);
    upload.accept = '.jpg';
    expect(upload.getAttribute('accept')).toEqual('.jpg');
    expect(upload.fileInput.getAttribute('accept')).toEqual('.jpg');
    upload.accept = null;
    expect(upload.getAttribute('accept')).toEqual(null);
    expect(upload.fileInput.getAttribute('accept')).toEqual(null);
  });

  it('renders as multiple files', () => {
    expect(upload.getAttribute('multiple')).toEqual(null);
    expect(upload.fileInput.getAttribute('multiple')).toEqual(null);
    upload.multiple = true;
    expect(upload.getAttribute('multiple')).toEqual('true');
    expect(upload.fileInput.getAttribute('multiple')).toEqual('multiple');
    upload.multiple = null;
    expect(upload.getAttribute('multiple')).toEqual(null);
    expect(upload.fileInput.getAttribute('multiple')).toEqual(null);
  });

  it('renders as no-text-ellipsis', () => {
    expect(upload.getAttribute('no-text-ellipsis')).toEqual(null);
    expect(upload.noTextEllipsis).toBe(null);
    expect(upload.textInput.textEllipsis).toBe('true');
    upload.noTextEllipsis = true;
    expect(upload.getAttribute('no-text-ellipsis')).toEqual('true');
    expect(upload.noTextEllipsis).toBe('true');
    expect(upload.textInput.textEllipsis).toBe(null);
    upload.noTextEllipsis = false;
    expect(upload.getAttribute('no-text-ellipsis')).toEqual(null);
    expect(upload.noTextEllipsis).toBe(null);
    expect(upload.textInput.textEllipsis).toBe('true');
  });

  it('should renders validate', () => {
    expect(upload.getAttribute('validate')).toEqual(null);
    expect(upload.textInput.validate).toBe(null);
    upload.validate = 'required';
    expect(upload.getAttribute('validate')).toEqual('required');
    expect(upload.textInput.validate).toBe('required');
    upload.validate = null;
    expect(upload.getAttribute('validate')).toEqual(null);
    expect(upload.textInput.validate).toBe(null);
  });

  it('should renders validation-events', () => {
    expect(upload.getAttribute('validation-events')).toEqual(null);
    expect(upload.textInput.validationEvents).toBe('blur change');
    upload.validationEvents = 'blur';
    expect(upload.getAttribute('validation-events')).toEqual('blur');
    expect(upload.textInput.validationEvents).toBe('blur');
    upload.validationEvents = null;
    expect(upload.getAttribute('validation-events')).toEqual(null);
    expect(upload.textInput.validationEvents).toBe('blur change');
  });

  it('should renders value', () => {
    expect(upload.getAttribute('value')).toEqual(null);
    expect(upload.textInput.value).toBe('');
    upload.value = 'test';
    expect(upload.getAttribute('value')).toEqual('test');
    expect(upload.textInput.value).toBe('test');
    upload.value = null;
    expect(upload.getAttribute('value')).toEqual(null);
    expect(upload.textInput.value).toBe('');
  });

  it('should renders label', () => {
    expect(upload.getAttribute('label')).toEqual(null);
    expect(upload.textInput.label).toBe('');
    upload.label = 'test';
    expect(upload.getAttribute('label')).toEqual('test');
    expect(upload.textInput.label).toBe('test');
    upload.label = null;
    expect(upload.getAttribute('label')).toEqual(null);
    expect(upload.textInput.label).toBe('');
  });

  it('should renders label filetype', () => {
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

  it('should renders label trigger', () => {
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

  it('should setup dirty tracking', () => {
    expect(upload.getAttribute('dirty-tracker')).toEqual(null);
    expect(upload.textInput.getAttribute('dirty-tracker')).toEqual(null);
    expect(upload.textInput.dirtyTracker).toEqual(null);
    upload.dirtyTracker = true;
    expect(upload.getAttribute('dirty-tracker')).toEqual('true');
    expect(upload.textInput.getAttribute('dirty-tracker')).toEqual('true');
    expect(upload.textInput.dirtyTracker).toEqual('true');
    upload.dirtyTracker = false;
    expect(upload.getAttribute('dirty-tracker')).toEqual(null);
    expect(upload.textInput.getAttribute('dirty-tracker')).toEqual(null);
    expect(upload.textInput.dirtyTracker).toEqual(null);
  });

  it('should rendr upload sizes', () => {
    const sizes = ['xs', 'sm', 'mm', 'md', 'lg', 'full'];
    const checkSize = (size) => {
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
