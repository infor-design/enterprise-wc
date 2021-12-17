export default class IdsNotificationBanner extends HTMLElement {
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
