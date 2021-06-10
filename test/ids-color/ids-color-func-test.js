/**
 * @jest-environment jsdom
 */

import IdsColor from '../../src/ids-color/ids-color';

describe('Ids Color Component', () => {
  let color;
  beforeEach(async () => {
    color = new IdsColor();
    document.body.appendChild(color);
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    color = null;
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    color.remove();
    const elem = new IdsColor();
    document.body.appendChild(elem);
    expect(document.querySelectorAll('ids-color').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
    elem.remove();
  });
});
