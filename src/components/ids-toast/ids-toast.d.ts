import Base from './ids-toast-base';

interface IdsToastMsgAddRemoveEventDetail extends Event {
  detail: {
    elem: HTMLElement,
    messageId: string,
    options: {
      title: string,
      message: string,
      messageId: string,
      closeButtonLabel: string,
      allowLink: boolean,
      audible: boolean,
      progressBar: boolean,
      timeout: number,
    }
  }
}

interface IdsToastSavePositionEventDetail extends Event {
  detail: {
    elem: IdsToast,
    uniqueId: string,
    value: string
  }
}

interface IdsToastClearPositionEventDetail extends Event {
  detail: {
    elem: IdsToast,
    clearIds: Array<string>
  }
}

interface IdsToastRmContainerEventDetail extends Event {
  detail: {
    elem: IdsToast,
    uniqueId: string
  }
}

type IdsToastShownTypes = {
  /** Text that is displayed in the toast message title */
  title: string;

  /** Text that displayed in the toast message body */
  message: string;

  /** Set id to manage each toast message */
  messageId?: string;

  /** Text that use for close button label in the toast message */
  closeButtonLabel?: string;

  /** Allows user to put links in the toast message */
  allowLink?: boolean | string;

  /** Let toast message to be invisible on the screen */
  audible?: boolean | string;

  /** To have a visible progress bar in the toast message */
  progressBar?: boolean | string;

  /** The amount of time, the toast message should be present on-screen */
  timeout?: number | string;
}

export default class IdsToast extends Base {
  /** Set to put links in the toast message */
  allowLink: boolean | string;

  /** Set as invisible on the screen, but still read out loud by screen readers */
  audible: boolean | string;

  /** Set to destroy after complete all the toast messages */
  destroyOnComplete: boolean | string;

  /** Set user to allows drag/drop the toast container */
  draggable: boolean;

  /** Set position of the toast container in specific place */
  position: 'bottom-end' | 'bottom-start' | 'top-end' | 'top-start' | string;

  /** Set toast to have a visible progress bar */
  progressBar: boolean | string;

  /** Set toast container to save position to local storage, apply only when draggable set to true */
  savePosition: boolean | string;

  /** Set the amount of time, the toast should be present on-screen */
  timeout: number | string;

  /** Set uniqueId to save to local storage, so same saved position can be use for whole app, apply only when draggable set to true */
  uniqueId: string;

  /** Clear the saved position from local storage, If uniqueId is undefined will use Internal attached */
  clearPosition(uniqueId: string|undefined): void;

  /** Clear all toast related saved position from local storage */
  clearPositionAll(): void;

  /** Get message element by given message id */
  messageElem(messageId: string): HTMLElement | undefined;

  /** Set to show the toast message */
  show(options: IdsToastShownTypes): void;

  /** Get the toast container */
  toastContainer(): HTMLElement;

  /** Fires while the toast message is added */
  on(event: 'add-message', listener: (detail: IdsToastMsgAddRemoveEventDetail) => void): this;

  /** Fires while the toast message is removed */
  on(event: 'remove-message', listener: (detail: IdsToastMsgAddRemoveEventDetail) => void): this;

  /** Fires after the local storage settings changed in some way */
  on(event: 'save-position', listener: (detail: IdsToastSavePositionEventDetail) => void): this;

  /** Fires after clear the saved position from local storage */
  on(event: 'clear-position', listener: (detail: IdsToastClearPositionEventDetail) => void): this;

  /** Fires after removed the toast message container */
  on(event: 'remove-container', listener: (detail: IdsToastRmContainerEventDetail) => void): this;
}
