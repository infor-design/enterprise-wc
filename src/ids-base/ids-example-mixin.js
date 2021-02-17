/**
 * An example mixin that shows the general format of a mixin that will be used in a IDS component.
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */
const IdsExampleMixin = (superclass) => class extends superclass {
  constructor() {
    super();
  }

  prop1= 'test';

  methodOne() {
    console.info('methodOne from IdsExampleMixin');
  }
};

export { IdsExampleMixin };
