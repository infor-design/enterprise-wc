// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import { IdsElement } from '../ids-base/ids-element';

interface IdsTagEventDetail extends Event {
  detail: {
    elem: IdsTag
  }
}

interface IdsTagEventVetoable extends Event {
  detail: {
    elem: IdsTag,
    response: () => boolean
  }
}

export default class IdsTag extends IdsElement {
  /** Set the tag type/color */
  color: 'secondary' | 'error' | 'success' | 'caution' | string;

  /** Add a dismissible x button to the tag */
  dismissible: boolean;

  /** Dismiss a dismissible tag */
  dismiss(): void;

  /** Set the theme mode */
  mode: 'light' | 'dark' | 'contrast' | string;

  /** Set the tag type/color */
  version: 'new' | 'classic' | string;

  /** Fires before the tag is removed, you can return false in the response to veto. */
  on(event: 'beforetagremoved', listener: (detail: IdsTagEventVetoable) => void): this;

  /** Fires while the tag is removed */
  on(event: 'tagremoved', listener: (detail: IdsTagEventDetail) => void): this;
}
