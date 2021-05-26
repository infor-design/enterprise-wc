// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import { IdsElement } from '../ids-base';

export default class IdsCounts extends IdsElement {
  /** Set the tag type/color */
  color: 'base' | 'caution' | 'danger' | 'success' | 'warning' | string;

  /** List the settable component properties */
  properties: string[];

  /** Sets the value size at 32 when true (instead of 40) */
  compact?: 'true' | 'false' | boolean;

  /** Sets the href/link */
  href?: string;

  /** Set the theme mode */
  mode: 'light' | 'dark' | 'contrast' | string;

  /** Set the theme version */
  version: 'new' | 'classic' | string;
}
