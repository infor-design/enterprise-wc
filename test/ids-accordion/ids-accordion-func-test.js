/**
 * @jest-environment jsdom
 */
import IdsAccordion from '../../src/ids-accordion/ids-accordion';

describe('IdsAccordion Component', () => {
  let el;

  beforeEach(async () => {
    const elem = new IdsAccordion();

    document.body.appendChild(elem);
    el = document.querySelector('ids-accordion');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    el = null;
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    el.remove();
    el = new IdsAccordion();
    document.body.appendChild(el);

    expect(document.querySelectorAll('ids-accordion').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });
});
