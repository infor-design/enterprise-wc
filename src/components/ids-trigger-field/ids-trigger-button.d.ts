import Base from './ids-trigger-button-base';

export default class IdsTriggerButton extends Base {
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

  /** Toggles the "pressed" state of the button */
  tabbable?: boolean;

  /** Set the theme mode */
  mode: 'light' | 'dark' | 'contrast' | string;

  /** Set the theme version */
  version: 'new' | 'classic' | string;

  /* Provides a direct reference to the Shadow Root's HTMLButtonElement. */
  readonly button: HTMLElement;
}
