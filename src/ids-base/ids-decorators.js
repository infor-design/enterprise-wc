/* eslint no-param-reassign: ["error", { "props": false }] */
const VERSION = '0.0.0-beta.4';

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
 * Mixin Decorator just applies the mixin on the component with a loose copy.
 * Some mixins like keyboardmixin and events mixin must be newed up instead if using complex
 * objects that cannot be shared.
 * @param  {object} obj The class/object to register
 * @returns {Function} The function that did the decorating
 */
export function mixin(obj) {
  return (/** @type {any} */ target) => {
    Object.assign(target.prototype, obj);
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
