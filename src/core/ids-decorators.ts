/**
 * Custom Element Decorator
 * @param  {string} name The custom element name
 * @returns {Function} The function that did the decorating
 */
export function customElement(name) {
  console.log(name);
  return (target) => {
    console.log(target);
    if (!customElements.get(name)) {
      customElements.define(name, target);
    }
  };
}

/**
 * Styles Decorator
 * @param {string} cssStyles The css stringified stylesheet
 * @returns {Function} The function that did the decorating
 */
export function scss(cssStyles) {
  console.log(cssStyles);
  return (target) => {
    target.prototype.cssStyles = cssStyles;
  };
}

/**
 * Call appendIds in base if needed to add automation ids and ids
 * @returns {Function} The function that did the decorating
 */
export function appendIds() {
  return (target) => {
    target.prototype.appendIds = true;
  };
}
