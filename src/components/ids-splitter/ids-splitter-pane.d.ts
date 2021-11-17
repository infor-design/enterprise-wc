// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import { IdsElement } from '../../core';

export default class IdsSplitterPane extends IdsElement {
  /** Sets initially the pane size height or width for example: '20%', '200px' or 200 */
  size: string | number | null;

  /** Sets initially the pane minimum size height or width for example: '10%', '100px' or 100 */
  minSize: string | number | null;

  /** Sets initially the pane maximum size height or width for example: '80%', '800px' or 800 */
  maxSize: string | number | null;

  /** Sets initially the pane to collapsed state */
  collapsed: boolean | string;
}
