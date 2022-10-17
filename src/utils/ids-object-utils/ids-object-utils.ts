/**
 * Check whether the given object is an object or not.
 * @param {any} obj The object to check.
 * @returns {boolean} true if given object is an object.
 */
export function isObject(obj: any): boolean {
  return obj instanceof Object && !(obj instanceof Number) && !(obj instanceof Array);
}

/**
 * Check the given object is an object and NOT empty.
 * @param {any} obj The object to check.
 * @returns {boolean} true if given object is an object and NOT empty.
 */
export function isObjectAndNotEmpty(obj: any): boolean {
  return isObject(obj) && Object.keys(obj).length > 0;
}

/**
 * Calculates the width to render given text string.
 * @private
 * @param  {object} obj The used object.
 * @param  {string} text The text to render.
 * @param  {string} font The font value.
 * @returns {number} Calculated text width in pixels.
 */
export function calculateTextRenderWidth(obj: any, text: string, font = '400 16px arial'): number {
  obj.canvas = obj.canvas || document.createElement('canvas');
  const context = obj.canvas.getContext('2d');
  context.font = font;
  return context.measureText(text).width;
}
