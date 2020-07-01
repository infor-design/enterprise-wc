/**
 * An example mixin that shows the general format of a mixin that will extend a IDS component.
 */
const IdsExampleMixin = {
  sayHi() {
    console.info(`Hello ${this.name}`);
  },
  sayBye() {
    console.info(`Bye ${this.name}`);
  }
};

export { IdsExampleMixin };
