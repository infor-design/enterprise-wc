/**
 * Rest decorator TODO Remove
 * @param {number} id A number for testing;
 * @returns {Function} The decoratored function
 */
export function dec(id) {
  console.log('evaluated', id); //eslint-disable-line
  return (target, property, descriptor) => { //eslint-disable-line
    console.log('executed', id); //eslint-disable-line
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
