// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.
import { IdsElement } from '../../core';

export default class IdsNotificationBanner extends IdsElement {
  /** Sets the type of Notification */
  type: 'success' | 'alert' | 'info' | 'error' | string;

  /** Sets the link of the notification */
  link: string;

  /** Sets the linkText of the notification */
  linkText: string;

  /** Sets the messageText of the notification */
  messageText: string;

  /** Set the theme mode */
  mode: 'light' | 'dark' | 'contrast' | string;

  /** Set the theme version */
  version: 'new' | 'classic' | string;
}
