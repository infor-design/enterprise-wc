// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

export class MixinBuilder {
  /** Mix a base object with a set of mixins */
  with(args: []): HTMLElement;
}

export const mix: (mixins: []) => HTMLElement;
