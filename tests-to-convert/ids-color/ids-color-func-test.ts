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
    expect(color.label).toEqual('');
    expect(color.getAttribute('label')).toEqual('');
  });

  it('shows label when IdsColor.label is true', () => {
    color.hex = '#000000';
    color.label = 'Black';
    expect(color.label).toEqual('Black');
    expect(color.getAttribute('label')).toEqual('Black');
  });
});
