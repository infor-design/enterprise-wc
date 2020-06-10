/* eslint no-param-reassign: ["error", { "props": false }] */
const pjson = require('../../package.json');

/**
 * Add the version to all component
 * @param {number} id A number for testing;
 * @returns {Function} The decoratored function
 */
export function version(id) {
  return (target, property, descriptor) => { //eslint-disable-line
    target.version = pjson.version;
  };
}

/**
 * Custom Element Decorator
 * @param  {string} name The custom element name
 * @returns {Function} The decoratored function
 */
export function customElement(name) {
  return (target) => {
    customElements.define(name, target);
  };
}
