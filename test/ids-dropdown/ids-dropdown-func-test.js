/**
 * @jest-environment jsdom
 */
import IdsDropdown from '../../src/ids-dropdown/ids-dropdown';

describe('IdsDropdown Component', () => {
  let dropdown;

  beforeEach(async () => {
    const elem = new IdsDropdown();
    document.body.appendChild(elem);
    dropdown = document.querySelector('ids-dropdown');
    dropdown.label = 'Normal Dropdown';
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    const elem = new IdsDropdown();
    document.body.appendChild(elem);
    elem.remove();
    expect(document.querySelectorAll('ids-dropdown').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders correctly', () => {
    expect(dropdown.outerHTML).toMatchSnapshot();
    dropdown.dismissible = true;
    expect(dropdown.outerHTML).toMatchSnapshot();
  });

  // TODO
  it('renders the label', () => {
    dropdown.label = 'Changed Label';
  });
});
