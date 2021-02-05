// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

interface IdsTriggerFieldEventDetail extends Event {
  detail: {
    elem: IdsTriggerField
  }
}

export default class IdsTriggerField extends HTMLElement {
  /** Set if the trigger field is tabbable */
  tabbable: boolean;
  /** Set the appearance of the trigger field */
  appearance: 'normal' | 'compact' | string;
  /** Fire the trigger event and action */
  trigger(): void;

  /** Fires before the trigger button is clicked, you can return false in the response to veto. */
  on(event: 'beforetriggerclicked', listener: (detail: IdsTriggerFieldEventDetail) => void): this;
  /** Fires as the trigger button is clicked. */
  on(event: 'triggerclicked', listener: (detail: IdsTriggerFieldEventDetail) => void): this;
}
