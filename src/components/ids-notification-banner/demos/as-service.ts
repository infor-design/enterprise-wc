import IdsNotificationBannerService from '../ids-notification-banner-service';

let count = 1;

document.querySelector('#show-notification')!.addEventListener('click', () => {
  IdsNotificationBannerService.show({
    id: 'ids-notification-banner-1',
    type: 'success',
    messageText: `Notification message number ${count}`,
    parent: '#notification-banner-area'
  });

  count++;
  console.info(`${IdsNotificationBannerService.count} notification banners are open`);
});

document.querySelector('#close-all')!.addEventListener('click', () => {
  IdsNotificationBannerService.dismissAll();
  console.info(`${IdsNotificationBannerService.count} notification banners are open`);
});

document.querySelector('#close-oldest')!.addEventListener('click', () => {
  IdsNotificationBannerService.dismissOldest();
  console.info(`${IdsNotificationBannerService.count} notification banners are open`);
});

document.querySelector('#close-newest')!.addEventListener('click', () => {
  IdsNotificationBannerService.dismissNewest();
  console.info(`${IdsNotificationBannerService.count} notification banners are open`);
});

// For the tests
(window as any).IdsNotificationBannerService = IdsNotificationBannerService;
