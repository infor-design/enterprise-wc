/**
 * @jest-environment jsdom
 */
import IdsNotificationBanner from '../../src/components/ids-notification-banner/ids-notification-banner';
import IdsHyperLink from '../../src/components/ids-hyperlink/ids-hyperlink';

describe('IdsNotificationBanner Component', () => {
  let notificationBanner;

  beforeEach(async () => {
    const elem = new IdsNotificationBanner();
    document.body.appendChild(elem);
    notificationBanner = document.querySelector('ids-notification-banner');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    const elem = new IdsNotificationBanner();
    document.body.appendChild(elem);
    elem.remove();
    expect(document.querySelectorAll('ids-notification-banner').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders correctly', () => {
    notificationBanner.type = 'success';
    expect(notificationBanner.outerHTML).toMatchSnapshot();

    notificationBanner.type = 'alert';
    expect(notificationBanner.outerHTML).toMatchSnapshot();

    notificationBanner.type = 'info';
    expect(notificationBanner.outerHTML).toMatchSnapshot();

    notificationBanner.type = 'error';
    expect(notificationBanner.outerHTML).toMatchSnapshot();

    // Handles incorrect values
    notificationBanner.type = 'fakeType';
    expect(notificationBanner.outerHTML).toMatchSnapshot();
  });

  it('can change its type', () => {
    notificationBanner.type = 'success';
    expect(notificationBanner.getAttribute('type')).toBe('success');
    expect(notificationBanner.type).toBe('success');

    notificationBanner.type = 'alert';
    expect(notificationBanner.getAttribute('type')).toBe('alert');
    expect(notificationBanner.type).toBe('alert');

    notificationBanner.type = 'info';
    expect(notificationBanner.getAttribute('type')).toBe('info');
    expect(notificationBanner.type).toBe('info');

    notificationBanner.type = 'error';
    expect(notificationBanner.getAttribute('type')).toBe('error');
    expect(notificationBanner.type).toBe('error');

    // Handles incorrect values
    notificationBanner.type = 'fakeType';
    expect(notificationBanner.getAttribute('type')).toBe('success');
    expect(notificationBanner.type).toBe('success');
  });

  it('can change its messageText', () => {
    notificationBanner.messageText = 'Lorem ipsum dolor set';
    expect(notificationBanner.getAttribute('message-text')).toBe('Lorem ipsum dolor set');
    expect(notificationBanner.messageText).toBe('Lorem ipsum dolor set');
  });

  it('can change its link', () => {
    notificationBanner.link = 'https://infor.com';
    expect(notificationBanner.getAttribute('link')).toBe('https://infor.com');
    expect(notificationBanner.link).toBe('https://infor.com');
  });

  it('can change its linkText', () => {
    notificationBanner.linkText = 'Click to view';
    expect(notificationBanner.getAttribute('link-text')).toBe('Click to view');
    expect(notificationBanner.linkText).toBe('Click to view');
  });

  it('can change its icon', () => {
    let alertIcon;
    notificationBanner.type = 'success';
    alertIcon = 'success';
    expect(alertIcon).toBe('success');

    alertIcon = 'alert';
    expect(alertIcon).toBe('alert');
  });

  it('dismisses on click', () => {
    notificationBanner.container.querySelector('ids-button').click();
    expect(document.querySelectorAll('ids-notification-banner').length).toEqual(0);
  });

  it('dismisses on keydown (Enter)', () => {
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    notificationBanner.dispatchEvent(event);
    expect(document.querySelectorAll('ids-notification-banner').length).toEqual(0);
  });

  it('can veto dismiss on beforeNotificationRemove', () => {
    const mockCallback = jest.fn((x) => {
      x.detail.response(false);
      expect(x.detail.elem).toBeTruthy();
    });

    notificationBanner.addEventListener('beforeNotificationRemove', mockCallback);
    notificationBanner.dismiss();

    expect(mockCallback.mock.calls.length).toBe(1);
    expect(document.body.contains(notificationBanner)).toEqual(true);
  });

  it('fires beforeNotificationRemove on dismiss', () => {
    const mockCallback = jest.fn((x) => {
      expect(x.detail.elem).toBeTruthy();
    });

    notificationBanner.addEventListener('beforeNotificationRemove', mockCallback);
    notificationBanner.dismiss();

    expect(mockCallback.mock.calls.length).toBe(1);
    expect(document.body.contains(notificationBanner)).toEqual(false);
  });

  it('fires notificationRemove on dismiss', () => {
    const mockCallback = jest.fn((x) => {
      expect(x.detail.elem).toBeTruthy();
    });

    notificationBanner.addEventListener('notificationRemove', mockCallback);
    notificationBanner.dismiss();

    expect(mockCallback.mock.calls.length).toBe(1);
    expect(document.body.contains(notificationBanner)).toEqual(false);
  });

  it('fires afterNotificationRemove on dismiss', () => {
    const mockCallback = jest.fn((x) => {
      expect(x.detail.elem).toBeTruthy();
    });

    notificationBanner.addEventListener('afterNotificationRemove', mockCallback);
    notificationBanner.dismiss();

    expect(mockCallback.mock.calls.length).toBe(1);
    expect(document.body.contains(notificationBanner)).toEqual(false);
  });

  it('can render different icons based on type', () => {
    const alertIcon = notificationBanner.shadowRoot.querySelector('ids-alert');
    notificationBanner.type = 'success';
    notificationBanner.template();
    expect(alertIcon.icon).toEqual('success');

    notificationBanner.type = 'alert';
    alertIcon.icon = 'alert';
    notificationBanner.template();
    expect(alertIcon.icon).toEqual('alert');
  });

  it('can render with or without a link', () => {
    let idsLink;
    notificationBanner.link = null;
    notificationBanner.template();
    expect(idsLink).toBe(undefined);
    expect(notificationBanner.linkText).toEqual(null);

    notificationBanner.link = 'https://infor.com';
    notificationBanner.linkText = 'Click to view';
    idsLink = new IdsHyperLink();
    notificationBanner.appendChild(idsLink);
    notificationBanner.template();
    expect(idsLink).toBeTruthy();
    expect(notificationBanner.linkText).toEqual('Click to view');
  });

  it('can render default messageText', () => {
    expect(notificationBanner.messageText).toEqual(null);

    notificationBanner.messageText = 'Lorem ipsum dolor set';
    notificationBanner.template();
    expect(notificationBanner.messageText).toEqual('Lorem ipsum dolor set');
  });

  it('can create notification dynamically with add()', () => {
    const notificationObj = {
      id: 'ids-notification-banner-5',
      type: 'alert',
      messageText: 'DTO accepted by your manager for Sept 30, 2018.',
    };
    const notification = new IdsNotificationBanner();
    notification.add(notificationObj);

    notificationObj.parent = 'notification-container';
    const parentEl = document.createElement('div');
    parentEl.setAttribute('id', notificationObj.parent);
    notification.appendChild(parentEl);
    expect(notificationObj.parent).toEqual('notification-container');

    const notificationObj2 = {
      type: 'alert',
      parent: 'notification-container',
      messageText: 'DTO accepted by your manager for Sept 30, 2018.',
      link: 'https://infor.com',
      linkText: 'Learn More'
    };
    const notification2 = new IdsNotificationBanner();
    notification2.add(notificationObj2);
    expect(notificationObj2.id).toEqual(undefined);
    expect(notificationObj2.linkText).toEqual('Learn More');

    const notificationObj3 = {
      id: 'ids-notification-banner-5',
      type: 'alert',
      messageText: 'DTO accepted by your manager for Sept 30, 2018.',
      link: 'https://infor.com',
    };
    const notification3 = new IdsNotificationBanner();
    const idsContainer = document.createElement('ids-container');
    document.body.prepend(idsContainer);
    notification3.add(notificationObj3);
  });
});
