// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.
import { IdsElement } from '../../core';

export default class IdsTreeMap extends IdsElement {
  /** Sets the data object of the treemap */
  result?: object | [{ value: 1 }, { value: 2 }];

  /** Sets the title the treemap */
  title: string;
}
