// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import { IdsElement } from '../ids-base';

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

export default class IdsToastMessage extends IdsElement {
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
