/**
 * @jest-environment jsdom
 */
import IdsTooltip from '../../src/ids-tooltip/ids-tooltip';
import { IdsButton } from '../../src/ids-button/ids-button';

describe('IdsTooltip Component', () => {
  let tooltip;
  let button;

  beforeEach(async () => {
    const buttonElem = new IdsButton();
    buttonElem.id = 'button-1';
    buttonElem.text = 'Test Button';
    document.body.appendChild(buttonElem);
    button = document.querySelector('ids-button');

    const toolTipElem = new IdsTooltip();
    toolTipElem.target = '#button-1';
    toolTipElem.text = 'Additional Information';
    document.body.appendChild(toolTipElem);
    tooltip = document.querySelector('ids-tooltip');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    const elem = new IdsTooltip();
    document.body.appendChild(elem);
    elem.remove();
    expect(document.querySelectorAll('ids-tooltip').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders correctly', () => {
    expect(tooltip.shadowRoot.innerHTML).toMatchSnapshot();
  });

  it('shows on hover', () => {
    const mouseenter = new MouseEvent('mouseenter');
    button.dispatchEvent(mouseenter);
    expect(tooltip.visible).toEqual(true);
  });
});
