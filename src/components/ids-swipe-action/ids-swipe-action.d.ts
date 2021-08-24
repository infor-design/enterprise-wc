// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

export default class IdsSwipeAction extends HTMLElement {
  /** Set the theme mode */
  mode: 'light' | 'dark' | 'contrast' | string;

  /** Set the theme version */
  version: 'new' | 'classic' | string;

  /** Set the swipe interaction */
  swipeType: 'reveal' | 'continuous';
}
