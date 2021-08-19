// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import { IdsElement } from '../../core';

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
  /** Set the tag color */
  color: 'secondary' | 'error' | 'success' | 'caution' | string;

  /** Add a dismissible x button to the tag */
  dismissible: boolean;

  /** Dismiss a dismissible tag */
  dismiss(): void;

  /** Set the theme mode */
  mode: 'light' | 'dark' | 'contrast' | string;

  /** Set the theme version */
  version: 'new' | 'classic' | string;

  /** Fires before the tag is removed, you can return false in the response to veto. */
  on(event: 'beforetagremove', listener: (detail: IdsTagEventVetoable) => void): this;

  /** Fires while the tag is removed */
  on(event: 'tagremove', listener: (detail: IdsTagEventDetail) => void): this;

  /** Fires after the tag is removed */
  on(event: 'aftertagremove', listener: (detail: IdsTagEventDetail) => void): this;
}
