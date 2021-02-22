// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import { IdsElement } from '../ids-base/ids-element';

export default class extends IdsElement {
  /** Set the expanded state */
  expanded: string;

  /** Set the type of expander to toggle-btn or not and future types */
  type: null | 'toggle-btn' | string;
}
