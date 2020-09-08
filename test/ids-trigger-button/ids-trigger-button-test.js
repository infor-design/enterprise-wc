/**
 * @jest-environment jsdom
 */
import IdsTriggerButton from '../../src/ids-trigger-button/ids-trigger-button';

describe('IdsTriggerButton Component', () => {
  let triggerButton;

  beforeEach(async () => {
    const elem = new IdsTriggerButton();
    document.body.appendChild(elem);
    triggerButton = document.querySelector('ids-trigger-button');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    const elem = new IdsTriggerButton();
    document.body.appendChild(elem);
    elem.remove();
    expect(document.querySelectorAll('ids-trigger-button').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders correctly', () => {
    expect(triggerButton.outerHTML).toMatchSnapshot();
  });
});
