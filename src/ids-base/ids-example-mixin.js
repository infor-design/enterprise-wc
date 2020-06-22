/**
 * An example mixin that shows the general format of a mixin that will extend a IDS component.
 */
const IdsExampleMixin = {
  sayHi() {
    console.log(`Hello ${this.name}`);
  },
  sayBye() {
    console.log(`Bye ${this.name}`);
  }
};

export { IdsExampleMixin };
