// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

/** A segment of text with standardized settings, theming and fonts */
export default class IdsBreadcrumb extends HTMLElement {
  /** Set the theme mode */
  mode: 'light' | 'dark' | 'contrast' | string;

  /** Set the theme version */
  version: 'new' | 'classic' | string;

  /** Adds an item at the end of the bread crumb */
  add(): void;

  /** Removes the last item from the end of the bread crumb */
  delete(): void;
}
