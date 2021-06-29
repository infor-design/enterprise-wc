// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import { IdsElement } from '../ids-base';

export default class IdsLoadingIndicator extends IdsElement {
  /** Set the theme mode */
  mode: 'light' | 'dark' | 'contrast' | string;

  /** Set the theme version */
  version: 'new' | 'classic' | string;

  /**
   * Represents the percentage completed for the indicator;
   * if not specified, the indicator is set into indeterminate mode (e.g. no specific
   * progress with an animation)
   */
  progress: number | undefined;

  /**
   * Flags the indicator as an sticky indicator;
   * causes the indicator to stick to the top of the innermost parent IdsElement
   * and span it horizontally
   */
  sticky: boolean | string;

  /**
   * Flags the indicator as a linear indicator;
   * causes the indicator to span its parent component horizontally and
   * be represented as a horizontal/linear bar. If set, removes current
   * flag types that may be set.
   */
  linear: boolean | string;
}
