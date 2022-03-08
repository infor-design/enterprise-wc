interface IdsTriggerFieldEventDetail extends Event {
  detail: {
    elem: IdsTriggerField
  }
}

export default class IdsTriggerField extends HTMLElement {
  /** Set the theme mode */
  mode: 'light' | 'dark' | 'contrast' | string;

  /** Set if the trigger field is tabbable */
  tabbable: boolean;

  /** Set the theme version */
  version: 'new' | 'classic' | string;

  /** Fire the trigger event and action */
  trigger(): void;

  /** Fires before the trigger button is clicked, you can return false in the response to veto. */
  on(event: 'beforetriggerclicked', listener: (detail: IdsTriggerFieldEventDetail) => void): this;

  /** Fires as the trigger button is clicked. */
  on(event: 'triggerclicked', listener: (detail: IdsTriggerFieldEventDetail) => void): this;
}
