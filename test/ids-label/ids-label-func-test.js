/**
 * @jest-environment jsdom
 */
import IdsLabel from '../../src/ids-label/ids-label';

describe('IdsLabel Component', () => {
  let elem;

  beforeEach(async () => {
    const label = new IdsLabel();
    document.body.appendChild(label);
    elem = document.querySelector('ids-label');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    elem.remove();
    elem = new IdsLabel();
    document.body.appendChild(elem);
    expect(document.querySelectorAll('ids-label').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders correctly', () => {
    expect(elem.outerHTML).toMatchSnapshot();
    elem.fontSize = 24;
    expect(elem.outerHTML).toMatchSnapshot();
  });

  it('renders font size setting', () => {
    elem.fontSize = 24;
    expect(elem.fontSize).toEqual('24');
    expect(document.querySelectorAll('ids-label').length).toEqual(1);
  });

  it('renders font-size setting then removes it', () => {
    elem = new IdsLabel();
    document.body.appendChild(elem);
    elem.fontSize = 24;
    expect(elem.fontSize).toEqual('24');
    elem.fontSize = null;
    expect(elem.fontSize).toEqual(null);
    expect(elem.getAttribute('font-size')).toEqual(null);
  });
});
