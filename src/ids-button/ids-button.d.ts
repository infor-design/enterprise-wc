// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

interface nativeElement extends HTMLElement {
  /* Provides a direct reference to the Shadow Root's HTMLButtonElement. */
  readonly button: HTMLElement;
  /** Contains space-delimeted CSS classes (or an array of CSS classes)
   * that will be passed to the Shadow Root button */
  cssClass?: Array<string> | string | null;
  /** A string representing an icon to display inside the button.
   * This icon will become the content of the Shadow Root button's `icon` slot when set. */
  icon?: string | null;
  /** API-level method of setting a button's text content. This will become the content
   * of the Shadow Root button's `text` slot when set. */
  text?: string;
  /* The type/purpose of the button to display */
  /** Generates a visual ripple effect inside the button at the x/y coordinates provided
   * (or in the center if 0, 0) */
  type: 'default' | 'primary' | 'secondary' | 'tertiary' | 'destructive'
  /* Generates a visual ripple effect inside the button at the x/y coordinates provided (or in the center if 0, 0) */
  createRipple(x?: number, y?: number): void;
}

export class IdsButton extends HTMLElement {
  nativeElement: nativeElement;
}

export class IdsToggleButton extends IdsButton {
  nativeElement: nativeElement;
}
