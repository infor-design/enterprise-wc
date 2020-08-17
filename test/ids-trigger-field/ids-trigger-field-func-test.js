/**
 * @jest-environment jsdom
 */
import IdsTag from '../../src/ids-trigger-field/ids-trigger-field';

describe('IdsTriggerField Component', () => {
  let triggerField;

  beforeEach(async () => {
    const elem = new IdsTriggerField();
    document.body.appendChild(elem);
    triggerField = document.querySelector('.ids-trigger-field');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    const elem = new IdsTag();
    document.body.appendChild(elem);
    elem.remove();
    expect(document.querySelectorAll('.ids-trigger-field').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

});
