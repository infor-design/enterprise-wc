/**
 * @jest-environment jsdom
 */
import { IdsExpandableArea } from '../../src/ids-expandable-area/ids-expandable-area';

describe('IdsExpandableArea Component', () => {
  let elem;

  beforeEach(async () => {
    const component = new IdsExpandableArea();
    document.body.appendChild(component);
    elem = document.querySelector('ids-expandable-area');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    elem = null;
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    elem.remove();
    elem = new IdsExpandableArea();
    document.body.appendChild(elem);

    expect(document.querySelectorAll('ids-expandable-area').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();

    expect(elem.shouldUpdate).toBeTruthy();
  });
})
