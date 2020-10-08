/**
 * @jest-environment jsdom
 */
import IdsButton from '../../src/ids-button/ids-button';

describe('IdsButton Component', () => {
  let elem;

  beforeEach(async () => {
    const btn = new IdsButton();
    btn.id = 'test-button';
    btn.text = 'Test Button';
    document.body.appendChild(btn);
    elem = document.querySelector('ids-button');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    elem.remove();
    elem = new IdsButton();
    document.body.appendChild(elem);
    expect(document.querySelectorAll('ids-button').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });
});
