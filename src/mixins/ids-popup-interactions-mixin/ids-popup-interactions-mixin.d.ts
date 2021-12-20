import IdsPopup from '../../components/ids-popup/ids-popup';

export class IdsPopupInteractionsMixin {
  /** true if the component currently has trigger events */
  readonly hasTriggerEvents: boolean;

  /** reference to the IdsPopup component used in shadow root */
  readonly popup: IdsPopup;

  /** duration in miliseconds to delay a `mouseenter` event. Used in Popups configured to use the `hover` interaction. */
  popupDelay?: number;

  /* defines the "target" HTMLElement in which to apply the PopupMenu */
  target?: HTMLElement | undefined;

  /* defines the action that will cause the menu to appear */
  trigger: 'contextmenu' | 'click' | 'hover' | 'immediate';

  /** Refreshes the currently-bound interaction events */
  refreshTriggerEvents(): void;

  /** Removes the currently-bound interaction events */
  removeTriggerEvents(): void;
}
