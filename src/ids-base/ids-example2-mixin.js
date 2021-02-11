/**
 * An example mixin that shows the general format of a mixin that will be used in a IDS component.
 * @param {object} superclass Accepts a superclass and creates a new subclass from it
 * @returns {object} The extended object
 */
const IdsExampleMixin2 = (superclass) => class extends superclass {
  example2() {
    console.info('example2 from IdsExampleMixin');
  }
};

export { IdsExampleMixin2 };
