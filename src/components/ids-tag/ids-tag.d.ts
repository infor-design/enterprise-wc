/** Defines the event data types for any non vetoable tag event */
interface IdsTagEventDetail extends Event {
  detail: {
    elem: IdsTag
  }
}

/** Defines the event data types for any vetoable tag event */
interface IdsTagEventVetoable extends Event {
  detail: {
    elem: IdsTag,
    response: () => boolean
  }
}

/** Defines the public API for the `<ids-tag>` element */
export default class IdsTag extends HTMLElement {
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
