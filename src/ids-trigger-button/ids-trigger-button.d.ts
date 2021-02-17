// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import { IdsButton } from '../ids-button/ids-button';

export default class IdsTriggerButton extends IdsButton {
  /* Contains space-delimeted CSS classes (or an array of CSS classes) that will be passed to the Shadow Root button */
  cssClass?: Array<string> | string | null;

  /* Sets the internal Button element's `disabled` property to enable/disable the button */
  disabled?: boolean;

  /* A string representing an icon to display inside the button.  This icon will become the content of the Shadow Root button's `icon` slot when set. */
  icon?: string | null;

  /* Defines which side to align the Button's icon against */
  iconAlign: 'start' | 'end';

  /* API-level method of setting a button's text content. This will become the content of the Shadow Root button's `text` slot when set. */
  text?: string;

  /* Provides a direct reference to the Shadow Root's HTMLButtonElement. */
  readonly button: HTMLElement;

  /** Toggles the "pressed" state of the button */
  tabbable?: boolean;
}
