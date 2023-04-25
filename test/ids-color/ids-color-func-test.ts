/**
 * @jest-environment jsdom
 */

import IdsColor from '../../src/components/ids-color/ids-color';

describe('Ids Color Component', () => {
  let color: any;
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
    const elem: any = new IdsColor();
    document.body.appendChild(elem);
    expect(document.querySelectorAll('ids-color').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
    elem.remove();
  });

  it('shows transparent background for default hex', () => {
    expect(color.hex).toEqual('');
    expect(['', 'transparent'].includes(color.container.style.backgroundColor)).toBe(true);
  });

  it('hex attribute updates background-color', () => {
    color.hex = '#000000';
    expect(color.getAttribute('hex')).toEqual('#000000');
    expect(color.hex).toEqual('#000000');
    expect(color.container.style.backgroundColor).toBe('rgb(0, 0, 0)');

    color.hex = '#FFFFFF';
    expect(color.getAttribute('hex')).toEqual('#FFFFFF');
    expect(color.hex).toEqual('#FFFFFF');
    expect(color.container.style.backgroundColor).toBe('rgb(255, 255, 255)');

    color.hex = '#F00';
    expect(color.getAttribute('hex')).toEqual('#F00');
    expect(color.hex).toEqual('#F00');
    expect(color.container.style.backgroundColor).toBe('rgb(255, 0, 0)');

    color.hex = 'red';
    expect(color.getAttribute('hex')).toEqual('red');
    expect(color.hex).toEqual('red');
    expect(color.container.style.backgroundColor).toBe('red');
  });

  it('shows hex when IdsColor.label is falsey', () => {
    color.hex = '#000000';
    color.label = '';
    expect(color.label).toEqual('#000000');
    expect(color.getAttribute('label')).toEqual('');
  });

  it('shows label when IdsColor.label is true', () => {
    color.hex = '#000000';
    color.label = 'Black';
    expect(color.label).toEqual('Black');
    expect(color.getAttribute('label')).toEqual('Black');
  });

  it('shows tooltip-popup when IdsColor.tooltip is not empty', () => {
    color.hex = '#000000';
    color.tooltip = 'Black';
    color.showTooltip();

    expect(color.getAttribute('tooltip')).toEqual('Black');
    expect(color.tooltip).toEqual('Black');
    expect(color.popup.innerText).toEqual('Black');
    expect(color.popup.visible).toEqual(true);
  });

  it.skip('shows black checkmark when IdsColor.class contains "light" class', () => {
    color.hex = '#FFFFFF';
    color.classList.add('light');
    expect(color.hasAttribute('checked')).toBe(false);

    const icon = color.swatch.querySelector('ids-icon');
    expect(icon).toBeDefined();
    expect(icon.classList.contains('color-check')).toBe(true);

    let styles = getComputedStyle(icon);
    expect(styles.getPropertyValue('opacity')).toBe('0');
    // expect(styles.opacity).toBe('0');
    // expect(icon.style.opacity).toBe('0');

    color.setAttribute('checked', '');
    expect(color.hasAttribute('checked')).toBe(true);

    styles = getComputedStyle(icon);
    expect(styles.color).toBe('rgb(0, 0, 0)');
    // expect(styles.color).toBe('rgb(255, 255, 255)');
    expect(styles.opacity).toBe('1');
    // expect(styles.opacity).toBe('1');
    // expect(icon.style.opacity).toBe('1');
  });

  it.skip('shows white checkmark when IdsColor.class contains "dark" class', () => {
    color.hex = '#FFFFFF';
    color.classList.add('light');
    expect(color.hasAttribute('checked')).toBe(false);

    const icon = color.swatch.querySelector('ids-icon');
    expect(icon).toBeDefined();
    expect(icon.classList.contains('color-check')).toBe(true);

    let styles = getComputedStyle(icon);
    expect(styles.getPropertyValue('opacity')).toBe('0');
    // expect(styles.opacity).toBe('0');
    // expect(icon.style.opacity).toBe('0');

    color.setAttribute('checked', '');
    expect(color.hasAttribute('checked')).toBe(true);

    styles = getComputedStyle(icon);
    expect(styles.color).toBe('rgb(255, 255, 255)');
    expect(styles.opacity).toBe('1');
    // expect(styles.opacity).toBe('1');
    // expect(icon.style.opacity).toBe('1');
  });

  it.skip('hides outline when IdsColor.class removes "outlined" class', () => {
    // color.classList.remove('outlined');
    // const styles = getComputedStyle(color, ':hover');
    // expect(styles.getPropertyValue('box-shadow')).toEqual('');
    // expect(styles.getPropertyValue('outline')).toEqual('');
    // expect(color.style.boxShadow).toEqual('');
    // expect(color.style.outline).toEqual('');
  });

  it.skip('show outline when IdsColor.class adds "outlined" class', () => {
    // color.classList.add('outlined');
    // const styles = getComputedStyle(color, ':hover');
    // const outlineHoverRules = [...color.shadowRoot.styleSheets[0].cssRules][1];
    // expect(outlineHoverRules.style.boxShadow).toEqual('rgba(0, 114, 237, 0.3) 0px 0px 3px 2px');
    // expect(outlineHoverRules.style.outline).toEqual('1px solid var(--ids-color-azure-60)');
    // color.shadowRoot.styleSheets

    // expect(styles.getPropertyValue('box-shadow')).toEqual('0 0 3px 2px #0072ED4d');
    // expect(styles.getPropertyValue('outline')).toEqual('1px solid #0072ED');
    // expect(color.style.boxShadow).toEqual('0 0 3px 2px #0072ED4d');
    // expect(color.style.outline).toEqual('1px solid #0072ED');
  });
});
