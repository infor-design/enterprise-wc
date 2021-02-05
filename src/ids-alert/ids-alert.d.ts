// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

export default class IdsAlert extends HTMLElement {
  /* Types of alert */
  type: 'alert' | 'success' | 'dirty' | 'error' | 'info' | 'pending' | 'new' | 'in-progress' | 'info-field';
}
