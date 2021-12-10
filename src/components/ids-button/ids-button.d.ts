// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.
import { IdsElement } from '../../core';

/**
 * @type {any}
 */
export class IdsButton extends IdsElement {
  /* Set the variants theme styles */
  colorVariant?: 'alternate' | 'alternate-formatter';

  /* Contains space-delimited CSS classes (or an array of CSS classes) that will be passed to the Shadow Root button */
  cssClass?: Array<string> | string | null;

  /* Sets the internal Button element's `disabled` property to enable/disable the button */
  disabled?: boolean;

  /* A string representing an icon to display inside the button.  This icon will become the content of the Shadow Root button's `icon` slot when set. */
  icon?: string | null;

  /* Defines which side to align the Button's icon against */
  iconAlign: 'start' | 'end';

  /* Sets the internal Button element's `tabIndex` property for controlling focus */
  tabIndex: number;

  /* API-level method of setting a button's text content. This will become the content of the Shadow Root button's `text` slot when set. */
  text?: string;

  /* The type/purpose of the button to display */
  type: 'default' | 'primary' | 'secondary' | 'tertiary' | 'destructive';

  /* Sets up a string based tooltip */
  tooltip?: string;

  /* Disable the ripple animation effect */
  noRipple?: boolean;

  /* Provides a direct reference to the Shadow Root's HTMLButtonElement. */
  readonly button: HTMLElement;

  /** Set the theme mode */
  mode: 'light' | 'dark' | 'contrast' | string;

  /** whether the corners of the button as an icon-button are angled/90° */
  square?: boolean;

  /** Set the theme version */
  version: 'new' | 'classic' | string;
}
