import { IdsElement } from '../../core/ids-element';
import IdsOverlay from './ids-overlay';
import IdsPopup from '../ids-popup';
import IdsModalButton from '../ids-modal-button';

interface beforeshow extends Event {
  bubbles: true,
  detail: {
    elem: IdsModal,
    response: (isVoid: boolean) => void;
  }
}

interface beforehide extends Event {
  bubbles: true,
  detail: {
    elem: IdsModal,
    response: (isVoid: boolean) => void;
  }
}

interface show extends Event {
  bubbles: true,
  detail: {
    elem: IdsModal,
    value: unknown
  }
}

interface hide extends Event {
  bubbles: true,
  detail: {
    elem: IdsModal,
    value: unknown
  }
}

// Handle other exports
export { IdsOverlay };

/**
 * @type {any}
 */
export default class IdsModal extends IdsElement {
  /** Allows for the definition of an external overlay, or for the use of a generated, internal overlay */
  overlay?: IdsOverlay | null

  /** If defined, points to an element that causes the Modal to become active when clicked */
  target?: HTMLElement;

  /** Defines the Modal's title */
  messageTitle?: string;

  /** If buttons are defined, returns a list of the defined buttons */
  readonly buttons?: Array<IdsModalButton>;

  /** Provides access to the internal Popup component */
  readonly popup?: IdsPopup;

  /** Changes the visibility of the Modal */
  visible: boolean;

  /** Shows the modal */
  show(): void;

  /** Hides the modal */
  hide(): void;

  /** Sets the position of the modal to the center of the viewport */
  setModalPosition(): void;

  /** Fires before the modal is displayed, you can return false in the response to veto. */
  on(event: 'beforeshow', listener: (event: beforeshow) => void): this;

  /** Fires before the modal is hidden, you can return false in the response to veto. */
  on(event: 'beforehide', listener: (event: beforehide) => void): this;

  /** Fires after the modal is hidden */
  on(event: 'hide', listener: (event: hide) => void): this;

  /** Fires after the modal is displayed */
  on(event: 'show', listener: (event: show) => void): this;
}
