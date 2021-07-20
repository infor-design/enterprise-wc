// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.
import IdsPopup from '../ids-popup';

export class IdsPopupInteractionsMixin {
  /** true if the component currently has trigger events */
  hasTriggerEvents: boolean;

  /** reference to the IdsPopup component used in shadow root */
  readonly popup: IdsPopup;

  /** sets the trigger type */
  trigger: 'contextmenu' | 'click' | 'immediate';

  /** Refreshes the currently-bound interaction events */
  refreshTriggerEvents(): void;

  /** Removes the currently-bound interaction events */
  removeTriggerEvents(): void;
}
