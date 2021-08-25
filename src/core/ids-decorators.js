/* eslint no-param-reassign: ["error", { "props": false }] */
const VERSION = '0.0.0-beta.15';

/**
 * Add the version to the component
 * @returns {Function} The function that did the decorating
 */
export function version() {
  return (target) => {
    target.prototype.version = VERSION;
  };
}

/**
 * Custom Element Decorator
 * @param  {string} name The custom element name
 * @returns {Function} The function that did the decorating
 */
export function customElement(name) {
  return (target) => {
    /* istanbul ignore next */
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
