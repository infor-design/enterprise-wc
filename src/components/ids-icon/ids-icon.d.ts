// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.
import { IdsElement } from '../../core';

export default class IdsIcon extends IdsElement {
  /* position of notification badge */
  badgePosition?: 'base' | 'caution' | 'danger' | 'success' | 'warning';

  /* color of notification badge */
  badgeColor?: 'bottom-left'| 'bottom-right' | 'top-left' | 'top-right';

  /* sets a custom height for the icon */
  height?: string;

  /* sets a custom width for the icon */
  width?: string;

  /* updates the svg viewbox for the icon */
  viewbox?: string;

  /* The name of the icon to display */
  icon: string;

  /** Set the language */
  language: string;

   /* The size of the icon to display */
   size: 'normal' | 'small' | 'medium' | 'large' | 'xl' | 'xl3';
}
