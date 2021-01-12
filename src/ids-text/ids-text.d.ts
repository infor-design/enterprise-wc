// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

export class IdsText extends HTMLElement {
  /** Set the type of element it is (h1-h6, span (default)) */
  type: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' |  'span' | string;
  /** Set `audible` string (screen reader only text) */
  audbible: string;
  /** Set `audible` string (screen reader only text) */
  fontSize: '10' | '12' | 'x2' | '14' | 'sm' | '16' |  '20' | '24' | 'lg' | '32' | 'xl' | '40' | '48' | '60' | '72' | string;
}
