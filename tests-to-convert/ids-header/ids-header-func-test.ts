/**
 * @jest-environment jsdom
 */
import IdsHeader from '../../src/components/ids-header/ids-header';

describe('IdsHeader Component', () => {
  let elem: any;

  beforeEach(async () => {
    const header: any = new IdsHeader();
    document.body.appendChild(header);
    elem = document.querySelector('ids-header');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  test('has a color attribute', () => {
    elem.color = '#fff';

    expect(elem.color).toBe('#fff');
    expect(elem.getAttribute('color')).toBe(null);

    elem.setAttribute('color', '#bb5500');

    expect(elem.color).toBe('#bb5500');
    expect(elem.getAttribute('color')).toBe('#bb5500');

    // Reset to default
    elem.removeAttribute('color');

    expect(elem.color).toBe('#fff');
    expect(elem.getAttribute('color')).toBe(null);
  });
});
