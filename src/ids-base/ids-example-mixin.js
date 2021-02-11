/**
 * An example mixin that shows the general format of a mixin that will be used in a IDS component.
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */
const IdsExampleMixin = (superclass) => class extends superclass {
  constructor() {
    super();
  }

  example1() {
    console.info('example1 from IdsExampleMixin');
  }
};

export { IdsExampleMixin };
