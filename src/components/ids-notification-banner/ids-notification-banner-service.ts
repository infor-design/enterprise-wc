import './ids-notification-banner';
import type { IdsNotificationBannerSettings } from './ids-notification-banner';
import type IdsNotificationBanner from './ids-notification-banner';

/**
 * IDS Notification Service
 */
export default class IdsNotificationBannerService {
  /* Show a notification Banner */
  static show(settings: IdsNotificationBannerSettings) {
    const notificationBanner = document.createElement('ids-notification-banner') as IdsNotificationBanner;
    notificationBanner.add(settings);
  }

  static get openNotificationBanners(): Array<IdsNotificationBanner> | [] {
    return Array.from(document.querySelectorAll('ids-notification-banner'));
  }

  /* Close All notification Banner */
  static dismissAll() {
    this.openNotificationBanners.forEach((el) => {
      (el as IdsNotificationBanner).dismiss();
    });
  }

  /* Close Last (oldest) notification Banner */
  static dismissOldest() {
    const last = this.openNotificationBanners.length - 1;
    if (last >= 0) this.openNotificationBanners[this.openNotificationBanners.length - 1]?.dismiss();
  }

  /* Close Newst recent notification Banner */
  static dismissNewest() {
    if (this.openNotificationBanners.length > 0) this.openNotificationBanners[0].dismiss();
  }

  /* Display number of open notification banners */
  static get count() {
    return document.querySelectorAll('ids-notification-banner').length || 0;
  }
}
