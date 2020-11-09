/**
 * @jest-environment jsdom
 */
import IdsInput from '../../src/ids-input/ids-input';

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

  it('renders field as disabled', () => {
    expect(input.getAttribute('disabled')).toEqual(null);
    expect(input.input.getAttribute('disabled')).toBe(null);
    expect(input.labelEl.classList).not.toContain('disabled');
    input.disabled = true;
    expect(input.getAttribute('disabled')).toEqual('true');
    expect(input.input.getAttribute('disabled')).toBe('true');
    expect(input.labelEl.classList).toContain('disabled');
  });

  it('renders field as readonly', () => {
    expect(input.getAttribute('readonly')).toEqual(null);
    expect(input.input.getAttribute('readonly')).toBe(null);
    expect(input.labelEl.classList).not.toContain('readonly');
    input.readonly = true;
    expect(input.getAttribute('readonly')).toEqual('true');
    expect(input.input.getAttribute('readonly')).toBe('true');
    expect(input.labelEl.classList).toContain('readonly');
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

  it('should input sizes', () => {
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
