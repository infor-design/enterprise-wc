/**
 * @jest-environment jsdom
 */
import IdsHeader from '../../src/components/ids-header';

describe('IdsHeader Component', () => {
  let elem;

  beforeEach(async () => {
    const header = new IdsHeader();
    document.body.appendChild(header);
    elem = document.querySelector('ids-header');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    elem.remove();
    elem = new IdsHeader();
    document.body.appendChild(elem);
    expect(document.querySelectorAll('ids-header').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('has a color attribute', () => {
    elem.color = '#0072ed';

    expect(elem.color).toBe('#0072ed');
    expect(elem.getAttribute('color')).toBe('#0072ed');

    elem.setAttribute('color', '#bb5500');

    expect(elem.color).toBe('#bb5500');
    expect(elem.getAttribute('color')).toBe('#bb5500');

    // Reset to default
    elem.removeAttribute('color');

    expect(elem.color).toBe('#0072ed');
    expect(elem.getAttribute('color')).toBe(null);
  });
});
