/**
 * @jest-environment jsdom
 */

import IdsHeader from '../../src/ids-header/ids-header';

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
    elem.remove();
    elem = new IdsHeader();
    document.body.appendChild(elem);
    elem.color = '#0072ed';
    expect(elem.getAttribute('color')).toEqual('#0072ed');
  });
});
