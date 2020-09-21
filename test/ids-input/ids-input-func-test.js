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
});
