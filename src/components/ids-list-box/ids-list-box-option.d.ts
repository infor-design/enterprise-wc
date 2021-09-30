// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import { IdsElement } from '../../core';

export default class IdsListBoxOption extends IdsElement {
  /** Sets the `id` attribute */
  id: string;

  /** Sets the `value` attribute */
  value: string;

  /** Sets the tooltip on the dropdown container */
  tooltip: string;
}
