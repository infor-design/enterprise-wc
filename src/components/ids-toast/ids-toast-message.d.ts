interface IdsToastMessageRemoveEventDetail extends Event {
  detail: {
    elem: IdsToastMessage,
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

export default class IdsToastMessage extends HTMLElement {
  /** Set as invisible on the screen, but still read out loud by screen readers */
  audible: boolean | string;

  /** Set toast to have a visible progress bar */
  progressBar: boolean | string;

  /** Set the amount of time, the toast should be present on-screen */
  timeout: number | string;

  /** Set id to manage each toast message */
  messageId: string;

  /** Remove the toast message and animate */
  removeToastMessage(): void;

  /** Fires while the toast message is removed */
  on(event: 'remove-message', listener: (detail: IdsToastMessageRemoveEventDetail) => void): this;
}
