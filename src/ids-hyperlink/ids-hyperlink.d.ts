// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

export default class IdsHyperlink extends HTMLElement {
  /** Set the link to disabled */
  disabled: boolean;

  /** Set the links href */
  href: string;

  /** Set the links target */
  target: '_blank' | '_self' | '_parent' | '_top' | string;

  /** Set the theme mode */
  mode: 'light' | 'dark' | 'contrast' | string;

  /** Set the decoration style */
  textDecoration: string;

  /** Set the theme version */
  version: 'new' | 'classic' | string;
}
