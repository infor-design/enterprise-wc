/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-mixed-operators */
/**
 * Converts the provided hex to a rgba value
 * @param {string} hex to set.
 * @param {number} opacity to use
 * @returns {string} converted rgba
 */
export function hexToRgba(hex: string, opacity?: number) {
  let c: any;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('');

    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }

    c = `0x${c.join('')}`;

    if (opacity) {
      return `rgba(${[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(' ')} / ${opacity})`;
    }

    return `rgb(${[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(' ')})`;
  }
  return '';
}

/**
 * Converts the provided rgba to a hex value
 * @param {string} rgba to set
 * @param {boolean} forceRemoveAlpha remove alpha
 * @returns {string} converted hex
 */
export function rgbaToHex(rgba: string, forceRemoveAlpha = false) {
  rgba = rgba.replace(' / ', ',').replaceAll(' ', ',');
  return `#${rgba.replace(/^rgba?\(|\s+|\)$/g, '') // Get's rgba / rgb string values
    .split(',') // splits them at ","
    .filter((string, index) => !forceRemoveAlpha || index !== 3)
    .map((string) => parseFloat(string)) // Converts them to numbers
    .map((number, index) => (index === 3 ? Math.round(number * 255) : number)) // Converts alpha to 255 number
    .map((number) => number.toString(16)) // Converts numbers to hex
    .map((string) => (string.length === 1 ? `0${string}` : string)) // Adds 0 when length of one number is 1
    .join('')}`; // Puts the array to togehter to a string
}

/**
 * Converts the provided "built in" human-readable color to an RGB(A?) value
 * @private
 * @param {string} colorName any valid CSS color value, including "built-in".
 * @param {number} [opacity=1] optional opacity value. If included, causes the return value to be RGBA.
 *  If omitted, causes the return value to be RGB.
 * @returns {string} converted rgb(a)
 */
export function builtinToRgba(colorName: string, opacity?: number) {
  const el = document.createElement('div');
  el.style.color = colorName;
  document.body.appendChild(el);

  const cs = window.getComputedStyle(el);
  let rgb = cs.getPropertyValue('color');

  document.body.removeChild(el);

  // normalize RGB values from the DOM to the modern format
  rgb = rgb.replace(/,/g, '');

  if (opacity && rgb.indexOf('a') === -1) {
    return rgb.replace('rgb', 'rgba').replace(')', ` / ${opacity})`);
  }
  return rgb;
}

/**
 * Converts any valid CSS color into an RGB(A?) value
 * @param {string} colorName any valid CSS color
 * @param {number} opacity optional opacity value. If included, causes the return value to be RGBA.
 *  If omitted, causes the return value to be RGB.
 * @returns {string} RGB(A?) value of the original color
 */
export function colorNameToRgba(colorName: string, opacity?: number) {
  if (colorName.substring(0, 1) === '#') {
    return hexToRgba(colorName, opacity);
  }
  return builtinToRgba(colorName, opacity);
}

/**
 * Darken a color by a magnitude
 * @param {string} hexColor the starting color
 * @param {number} magnitude level to use for example 10, 20, 30
 * @returns {string} the darker color
 */
function darkenColor(hexColor: string, magnitude: number) {
  hexColor = hexColor.replace(`#`, ``);
  const decimalColor = parseInt(hexColor, 16);
  let r = (decimalColor >> 16) + magnitude;
  r > 255 && (r = 255);
  r < 0 && (r = 0);
  let g = (decimalColor & 0x0000ff) + magnitude;
  g > 255 && (g = 255);
  g < 0 && (g = 0);
  let b = ((decimalColor >> 8) & 0x00ff) + magnitude;
  b > 255 && (b = 255);
  b < 0 && (b = 0);

  let newHex = (g | (b << 8) | (r << 16)).toString(16);
  if (newHex.length === 5) newHex = `0${newHex}`;
  if (newHex.length === 4) newHex = `0${newHex}`;
  return `#${newHex}`;
}

/**
 * Lighten a color by a magnitude
 * @param {string} hexColor the starting color
 * @param {number} percent level to use for example .10, .20, .30
 * @returns {string} the lighter color
 */
function lightenColor(hexColor: string, percent: number) {
  const rgba = hexToRgba(hexColor, percent);
  return rgbaToHex(rgba);
}

/**
 * Shade a color up or down given a hex color
 * @param {string} hexColor hex color to use
 * @param {number} magnitude the percent as a number or negative
 * @returns {string} the new hex
 */
export function adjustColor(hexColor: string, magnitude: number) {
  if (magnitude < 0) return darkenColor(hexColor, magnitude * 100);
  return lightenColor(hexColor, magnitude);
}

/**
 * Converts a "status" keyword provided to a color attribute into its corresponding
 * IDS theme color CSS variable.
 * @param {string} statusName the status keyword provided
 * @returns {string} containing the CSS variable name, or the original status if it cannot be corrected
 */
export function statusToIDSColor(statusName: string) {
  let cssVariable;
  const statuses = [
    'base',
    'error',
    'warning',
    'caution',
    'success'
  ];
  if (statuses.includes(statusName)) {
    cssVariable = `var(--ids-color-${statusName})`;
  }
  return cssVariable || statusName;
}
