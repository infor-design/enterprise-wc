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

    const tooltipElem = new IdsTooltip();
    tooltipElem.delay = 1;
    tooltipElem.target = '#button-1';
    tooltipElem.innerHTML = 'Additional Information';
    document.body.appendChild(tooltipElem);
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

  it('shows on mouseenter', (done) => {
    const mouseenter = new MouseEvent('mouseenter');
    button.dispatchEvent(mouseenter);
    setTimeout(() => {
      expect(tooltip.visible).toEqual(true);
      done();
    }, 50);
  });

  it('shows on mouseenter and then hides on mouseleave', (done) => {
    const mouseenter = new MouseEvent('mouseenter');
    const mouseleave = new MouseEvent('mouseleave');
    button.dispatchEvent(mouseenter);
    setTimeout(() => {
      expect(tooltip.visible).toEqual(true);
      button.dispatchEvent(mouseleave);
      expect(tooltip.visible).toEqual(false);
      done();
    }, 50);
  });

  it('shows on mouseenter and then hides on click', (done) => {
    const mouseenter = new MouseEvent('mouseenter');
    const click = new MouseEvent('click');
    button.dispatchEvent(mouseenter);
    setTimeout(() => {
      expect(tooltip.visible).toEqual(true);
      button.dispatchEvent(click);
      expect(tooltip.visible).toEqual(false);
      done();
    }, 50);
  });

  it('handles two or more elements can share a tooltip', (done) => {
    const buttonElem = new IdsButton();
    buttonElem.id = 'button-2';
    buttonElem.text = 'Test Button 2';
    document.body.appendChild(buttonElem);
    const button2 = document.querySelector('#button-2');
    tooltip.target = '#button-1, #button-2';

    const mouseenter = new MouseEvent('mouseenter');
    const click = new MouseEvent('click');
    button.dispatchEvent(mouseenter);
    setTimeout(() => {
      expect(tooltip.visible).toEqual(true);
      button.dispatchEvent(click);
      expect(tooltip.visible).toEqual(false);

      button2.dispatchEvent(mouseenter);
      setTimeout(() => {
        expect(tooltip.visible).toEqual(true);
        button2.dispatchEvent(click);
        expect(tooltip.visible).toEqual(false);
        done();
      }, 50);
    }, 50);
  });

  it('handles changing the target', (done) => {
    const buttonElem = new IdsButton();
    buttonElem.id = 'button-2';
    buttonElem.text = 'Test Button 2';
    document.body.appendChild(buttonElem);
    const button2 = document.querySelector('#button-2');
    tooltip.target = '#button-2';

    const mouseenter = new MouseEvent('mouseenter');
    const click = new MouseEvent('click');
    button2.dispatchEvent(mouseenter);
    setTimeout(() => {
      expect(tooltip.visible).toEqual(true);
      button2.dispatchEvent(click);
      expect(tooltip.visible).toEqual(false);
      done();
    }, 50);
  });

  it('shows on mouseenter when disabled', (done) => {
    const mouseenter = new MouseEvent('mouseenter');
    const click = new MouseEvent('click');
    button.disabled = true;
    button.dispatchEvent(mouseenter);

    setTimeout(() => {
      expect(tooltip.visible).toEqual(true);
      button.dispatchEvent(click);
      expect(tooltip.visible).toEqual(false);
      done();
    }, 50);
  });

  it('shows on click and then hides on click', (done) => {
    tooltip.trigger = 'click';
    button.click();

    setTimeout(() => {
      expect(tooltip.visible).toEqual(true);
      button.click();
      expect(tooltip.visible).toEqual(false);
      done();
    }, 50);
  });

  it('shows on focusin and then hides on focusout', (done) => {
    tooltip.trigger = 'focus';
    button.dispatchEvent(new MouseEvent('focusin'));

    setTimeout(() => {
      expect(tooltip.visible).toEqual(true);
      button.dispatchEvent(new MouseEvent('focusout'));
      expect(tooltip.visible).toEqual(false);
      done();
    }, 50);
  });

  it('shows on an HTMLElement', () => {
    tooltip.target = button;
    tooltip.visible = true;
    expect(tooltip.visible).toEqual(true);
  });

  it('shows and hides on visible', () => {
    tooltip.visible = true;
    expect(tooltip.visible).toEqual(true);
    expect(tooltip.getAttribute('visible')).toEqual('true');

    tooltip.visible = false;
    expect(tooltip.getAttribute('visible')).toEqual(null);
    expect(tooltip.visible).toEqual(false);

    tooltip.visible = true;
    tooltip.visible = null;
    expect(tooltip.getAttribute('visible')).toEqual(null);
    expect(tooltip.visible).toEqual(false);
  });

  it('can set/reset the delay', () => {
    tooltip.delay = 400;
    expect(tooltip.getAttribute('delay')).toEqual('400');
    expect(tooltip.delay).toEqual(400);
    tooltip.delay = null;
    expect(tooltip.getAttribute('delay')).toEqual(null);
    expect(tooltip.delay).toEqual(500);
  });

  it('can place on on top', () => {
    tooltip.placement = 'top';
    tooltip.visible = true;

    expect(tooltip.popup.visible).toEqual(true);
    expect(tooltip.popup.y).toEqual(12);
    expect(tooltip.popup.align).toEqual('top');
  });

  it('can place on on bottom', () => {
    tooltip.placement = 'bottom';
    tooltip.visible = true;

    expect(tooltip.popup.visible).toEqual(true);
    expect(tooltip.popup.y).toEqual(12);
    expect(tooltip.popup.align).toEqual('bottom');
  });

  it('can place on on right', () => {
    tooltip.placement = 'right';
    tooltip.visible = true;

    expect(tooltip.popup.visible).toEqual(true);
    expect(tooltip.popup.x).toEqual(12);
    expect(tooltip.popup.y).toEqual(0);
    expect(tooltip.popup.align).toEqual('right');
  });

  it('can place on on left', () => {
    tooltip.placement = 'left';
    tooltip.visible = true;

    expect(tooltip.popup.visible).toEqual(true);
    expect(tooltip.popup.x).toEqual(12);
    expect(tooltip.popup.y).toEqual(0);
    expect(tooltip.popup.align).toEqual('left');
  });

  it('can reset placement', () => {
    tooltip.placement = 'left';
    tooltip.visible = true;
    tooltip.visible = false;
    tooltip.placement = null;

    expect(tooltip.getAttribute('placement')).toEqual(null);
  });

  it('can reset trigger', () => {
    expect(tooltip.trigger).toEqual('hover');
    tooltip.trigger = 'click';
    tooltip.trigger = null;
    expect(tooltip.trigger).toEqual('hover');
  });

  it('supports async beforeShow', (done) => {
    const getContents = () => new Promise((resolve) => {
      setTimeout(() => {
        resolve('test content');
      }, 1);
    });

    tooltip.beforeShow = async function beforeShow() {
      return getContents();
    };
    tooltip.show();

    setTimeout(() => {
      expect(tooltip.innerHTML).toEqual('test content');
      done();
    }, 2);
  });
});
