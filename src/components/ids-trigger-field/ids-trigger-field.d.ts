import Base from './ids-trigger-field-base';

interface IdsTriggerFieldEventDetail extends Event {
  detail: {
    elem: IdsTriggerField
  }
}

export default class IdsTriggerField extends Base {
  /** Set if the trigger field is tabbable */
  tabbable: boolean;

  /** Set the appearance of the trigger field */
  appearance: 'normal' | 'compact' | string;

  /** Set the theme mode */
  mode: 'light' | 'dark' | 'contrast' | string;

  /** Set the theme version */
  version: 'new' | 'classic' | string;

  /** Sets the appearance of the ids-trigger-field-content container */
  contentBorders: boolean;

  /** Fire the trigger event and action */
  trigger(): void;

  /** Fires before the trigger button is clicked, you can return false in the response to veto. */
  on(event: 'beforetriggerclicked', listener: (detail: IdsTriggerFieldEventDetail) => void): this;

  /** Fires as the trigger button is clicked. */
  on(event: 'triggerclicked', listener: (detail: IdsTriggerFieldEventDetail) => void): this;
}
