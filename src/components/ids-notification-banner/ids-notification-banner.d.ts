import Base from './ids-notification-banner-base';

export default class IdsNotificationBanner extends Base {
  /** Sets the type of Notification */
  type: 'success' | 'alert' | 'info' | 'error' | string;

  /** Sets the link of the notification */
  link: string;

  /** Sets the linkText of the notification */
  linkText: string;

  /** Sets the messageText of the notification */
  messageText: string;
}
