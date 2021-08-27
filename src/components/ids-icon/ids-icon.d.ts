// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.
import { IdsElement } from '../../core';

export default class IdsIcon extends IdsElement {
  /* The size of the icon to display */
  type: 'normal' | 'small' | 'medium' | 'large';

  /* The name of the icon to display */
  icon: string;

  /** Set the language */
  language: string;
}
