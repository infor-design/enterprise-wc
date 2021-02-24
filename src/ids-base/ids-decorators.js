/* eslint no-param-reassign: ["error", { "props": false }] */
const VERSION = '0.0.0-beta.7';

/**
 * Add the version to the component
 * @returns {Function} The function that did the decorating
 */
export function version() {
  return (/** @type {any} */ target) => {
    target.prototype.version = VERSION;
  };
}

/**
 * Custom Element Decorator
 * @param  {string} name The custom element name
 * @returns {Function} The function that did the decorating
 */
export function customElement(name) {
  return (/** @type {CustomElementConstructor} */ target) => {
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
  return (/** @type {any} */ target) => {
    target.prototype.cssStyles = cssStyles;
  };
}
