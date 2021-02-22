// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.
import { IdsElement } from '../ids-base/ids-element';

export default class IdsBadge extends IdsElement {
  /* Set the shape of the badge */
  shape: 'normal' | 'round';

  /* Set the color of the badge */
  color: string | null;
}
