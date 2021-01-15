// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

interface IdsTagEventDetail extends Event {
  detail: {
    elem: IdsTag
  }
}

export class IdsTag extends HTMLElement {
  /** Set the tag type/color */
  color: 'secondary' | 'error' | 'success' | 'caution' | string;
  /** Add a dismissible x button to the tag */
  dismissible: boolean;

  /** Dismiss a dismissible tag */
  dismiss(): void;

  /** Fires before the tag is removed, you can return false in the response to veto. */
  on(event: 'beforetagremoved', listener: (detail: IdsTagEventDetail) => void): this;
  /** Fires while the tag is removed */
  on(event: 'tagremoved', listener: (detail: IdsTagEventDetail) => void): this;
  /** Fires after the tag is fully removed */
  on(event: 'aftertagremoved', listener: (detail: IdsTagEventDetail) => void): this;
}
