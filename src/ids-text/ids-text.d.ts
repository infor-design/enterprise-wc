// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

/** A segment of text with standardized settings, theming and fonts */
export default class IdsText extends HTMLElement {
  /** Set the type of element it is (h1-h6, span (default)) */
  type: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | string | null;

  /** Set `audible` string (screen reader only text) */
  audible: string | null;

  /** Set the text to disabled */
  disabled: boolean;

  /** Set the size of font to use */
  fontSize: '10' | '12' | 'x2' | '14' | 'sm' | '16' | '20' | '24' | 'lg' |
    '32' | 'xl' | '40' | '48' | '60' | '72' | string | null;

  /** Set the font weight */
  fontWeight: 'bold' | 'bolder' | null;

  /** Set the overflow style */
  overflow: 'ellipsis' | null;

  /** Set the theme mode */
  mode: 'light' | 'dark' | 'contrast' | string;

  /** Set the theme version */
  version: 'new' | 'classic' | string;

  /** If set to "unset", allows parent to color text */
  color: 'unset' | null;
}
