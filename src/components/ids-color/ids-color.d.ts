// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import { IdsElement } from '../../core';

export default class IdsColor extends IdsElement {
  /** Set the hex color */
  hex: string;
}
