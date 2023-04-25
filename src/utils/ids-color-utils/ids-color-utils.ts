/**
 * Converts the provided hex to an RGB(A?) value
 * @private
 * @param {string} hex to set.
 * @param {number} opacity to check.
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
      // eslint-disable-next-line
      return `rgba(${[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(' ')} / ${opacity})`;
    }

    return `rgb(${[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(' ')})`;
  }
  return '';
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
export function convertColorToRgba(colorName: string, opacity?: number) {
  if (colorName.substring(0, 1) === '#') {
    return hexToRgba(colorName, opacity);
  }
  // @TODO add HexA (four-digit hex) check
  // @TODO add HSL(A) check
  return builtinToRgba(colorName, opacity);
}

/**
 * Converts a "status" keyword provided to a color attribute into its corresponding
 * IDS theme color CSS variable.
 * @param {string} statusName the status keyword provided
 * @returns {string} containing the CSS variable name, or the original status if it cannot be corrected
 */
export function convertStatusToIDSColor(statusName: string) {
  let cssVariable;
  const statuses = [
    'base',
    'error',
    'warning',
    'caution',
    'success'
  ];
  if (statuses.includes(statusName)) {
    cssVariable = `var(--ids-color-${statusName === 'error' ? 'danger' : statusName})`;
  }
  return cssVariable || statusName;
}
