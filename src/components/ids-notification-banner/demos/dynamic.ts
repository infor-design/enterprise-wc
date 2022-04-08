import '../ids-notification-banner';

document.addEventListener('DOMContentLoaded', () => {
  const notificationBanner: HTMLElement | any = document.createElement('ids-notification-banner');
  notificationBanner.add({
    id: 'ids-notification-banner-1',
    type: 'success',
    messageText: 'DTO accepted by your manager for Sept 30, 2018.',
  });

  const notificationBanner2: HTMLElement | any = document.createElement('ids-notification-banner');
  notificationBanner2.add({
    id: 'ids-notification-banner-2',
    type: 'error',
    messageText: 'Something went wrong',
    link: 'https://infor.com'
  });

  const notificationBanner3: HTMLElement | any = document.createElement('ids-notification-banner');
  notificationBanner3.add({
    id: 'ids-notification-banner-3',
    type: 'info',
    messageText: 'DTO accepted by your manager for Sept 30, 2018.',
    link: 'https://infor.com',
    linkText: 'Learn More'
  });

  const notificationBanner4: HTMLElement | any = document.createElement('ids-notification-banner');
  notificationBanner4.add({
    id: 'ids-notification-banner-4',
    type: 'alert',
    messageText: 'DTO accepted by your manager for Sept 30, 2018.',
    link: 'https://infor.com',
    linkText: 'Learn More'
  });

  const notificationBanner5: HTMLElement | any = document.createElement('ids-notification-banner');
  notificationBanner5.add({
    id: 'ids-notification-banner-5',
    parent: 'notification-container',
    type: 'alert',
    messageText: 'DTO accepted by your manager for Sept 30, 2018.',
    link: 'https://infor.com',
    linkText: 'Learn More'
  });
});
