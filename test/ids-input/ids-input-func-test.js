/**
 * @jest-environment jsdom
 */
import IdsInput from '../../src/ids-input/ids-input';

describe('IdsInput Component', () => {
  let input;

  beforeEach(async () => {
    const elem = new IdsInput();
    document.body.appendChild(elem);
    input = document.querySelector('.ids-input');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    const elem = new IdsInput();
    document.body.appendChild(elem);
    elem.remove();
    expect(document.querySelectorAll('.ids-input').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders correctly', () => {
    input.type = 'text';

    expect(input.outerHTML).toMatchSnapshot();
  });

  it('renders type from an attribute', () => {
    input.setAttribute('type', 'text');
    expect(input.getAttribute('type')).toEqual('text');
    expect(input.type).toEqual('text');
  });
});
