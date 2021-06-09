/**
 * @jest-environment jsdom
 */
import IdsFieldset from '../../src/ids-fieldset/ids-fieldset';

describe('IdsFieldset Component', () => {
  let fieldset;

  beforeEach(async () => {
    const elem = new IdsFieldset();
    document.body.appendChild(elem);
    fieldset = document.querySelector('ids-fieldset');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    const elem = new IdsFieldset();
    document.body.appendChild(elem);
    elem.remove();
    expect(document.querySelectorAll('ids-fieldset').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders correctly', () => {
    expect(fieldset.outerHTML).toMatchSnapshot();
  });
});
