export default class IdsIcon extends HTMLElement {
  /* position of notification badge */
  badgeColor?: 'success' | 'info' | 'warning'| 'error' | null;

  /* color of notification badge */
  badgePosition?: 'bottom-left'| 'bottom-right' | 'top-left' | 'top-right';

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
  size: 'normal' | 'small' | 'medium' | 'large' | 'xl' | 'xxl';
}
