// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.
import { IdsElement } from '../../core';

export default class IdsAlert extends IdsElement {
  /* Types of alert */
  type: 'alert' | 'success' | 'dirty' | 'error' | 'info' |
    'pending' | 'new' | 'in-progress' | 'info-field';

  /* Set the disabled */
  disabled: boolean | string | null;

  /* Set the icon */
  icon: string | null;

  /** Set the theme mode */
  mode: 'light' | 'dark' | 'contrast' | string;

  /** Set the theme version */
  version: 'new' | 'classic' | string;
}
