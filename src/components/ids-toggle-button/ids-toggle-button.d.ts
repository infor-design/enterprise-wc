import Base from './ids-toggle-button-base';

export default class IdsToggleButton extends Base {
  /* Contains space-delimeted CSS classes (or an array of CSS classes) that will be passed to the Shadow Root button */
  cssClass?: Array<string> | string | null;

  /* A string representing an icon to display inside the button.  This icon will become the content of the Shadow Root button's `icon` slot when set. */
  icon?: string | null;

  /* API-level method of setting a button's text content. This will become the content of the Shadow Root button's `text` slot when set. */
  text?: string;

  /* The type/purpose of the button to display */
  type: 'default' | 'primary' | 'secondary' | 'tertiary' | 'destructive'

  /** Set the theme mode */
  mode: 'light' | 'dark' | 'contrast' | string;

  /** Set the theme version */
  version: 'new' | 'classic' | string;

  /* Provides a direct reference to the Shadow Root's HTMLButtonElement. */
  readonly button: HTMLElement;

  /** Toggles the "pressed" state of the button */
  toggle(): void;
}
