# Ids Notification Banner

## Description

The Notification Banner allows developers to display a message and optionally a link to more information. The user can dismiss the banner or click through the provided link. It sits the top of a page or a widget or inside any parent.

Generally, notification banners should be highly targeted to a specific user action within the purpose and function of the form or widget they appear in and not for global issues (Server error etc) and should communicate via friendly plain-spoken user oriented microcopy, not system-speak such as numerical error codes or status codes.

Their scope should be limited to communicating immediately on a user. Multiple notifications banners should be avoided in the same area if possible. Their scope should be limited to communicating on actions taking place within the widget.

## Use Cases

There are 4 different types of notification banners. Each type has a unique background color and icon.

- success
- warning
- caution
- info
- error

You can import the type `IdsNotificationBannerAlertType` if needed.

## Features (With Code Examples)

A success notification banner with link.

```html
<ids-notification-banner
  id="ids-notification-banner-0"
  message-text="DTO rejected by your manager for Sept 30, 2023."
  type="success"
  link="https://infor.com">
</ids-notification-banner>
```

An info notification banner with custom link text

```html
<ids-notification-banner
  id="ids-notification-banner-0"
  message-text="DTO rejected by your manager for Sept 30, 2023."
  type="info"
  link="https://infor.com"
  link-text="Learn More">
</ids-notification-banner>
```

An error notification banner with no link

```html
<ids-notification-banner
  id="ids-notification-banner-0"
  message-text="DTO rejected by your manager for Sept 30, 2023."
  type="error">
</ids-notification-banner>
```

Add a notification banner dynamically

```js
const notificationBanner = new IdsNotificationBanner();
notificationBanner.add({
  id: 'ids-notification-banner-1',
  parent: 'notification-container',
  type: 'warning',
  messageText: 'DTO accepted by your manager for Sept 30, 2023.',
  link: 'https://infor.com',
  linkText: 'Learn More'
});
```

```html
<div id="notification-banner"></div>
```

## Using the Notification Service

A service is provided that allows you to show and hide banner messages and get a count. The API works as follows:

```js
import IdsNotificationBannerService from '../ids-notification-banner-service';

IdsNotificationBannerService.show({
  id: 'ids-notification-banner-1',
  parent: 'notification-container',
  type: 'warning',
  messageText: 'DTO accepted by your manager for Sept 30, 2023.',
  link: 'https://infor.com',
  linkText: 'Learn More'
});

IdsNotificationBannerService.count();
IdsNotificationBannerService.dismissAll();
IdsNotificationBannerService.dismissOldest();
IdsNotificationBannerService.dismissNewest();
```

## Settings and Attributes

- `type` {string | IdsNotificationBannerAlertType} can be 1 of 4 types (success, warning, info, error)
- `message-text` {string} text shown inside the banner
- `line-clamp` {number} sets number of message text rows to display before truncating
- `link` {string | null} sets the url for the call to action in the banner
- `link-text` `{string | null}` sets the custom text on the call to action (if `null` will display "Click to view")
- `id` `{string | null}` sets the id on the banner
- `parent` `{string | null}` sets the id on the banner

## Themeable Parts

- `bgColor` Allows you to further style the background
- `closeBtn` Allows you to further style the close button
- `messageText` Allows you to further style the message text
- `linkText` Allows you to further style the link text

## Keyboard Guidelines

- TAB should move off of the component to the next focusable element on page.
- SHIFT + TAB should move to previous focusable element on the page.

## Responsive Guidelines

- The notification is 100% wide and will full the parent container by default
- The message text will be non-breaking and display ellipsis when there is not enough visible space. Use the `line-clamp` attribute to set the number of lines to display before truncating.

## Converting from Previous Versions (Breaking Changes)

**3.x to 4.x**

- Comparable to the inforSlideInDialog in 3.X

**4.x to 5.x**

- The notification component has been renamed to notification-banner
- If using properties/settings these are now attributes.
- Markup has changed to a custom element `<ids-message></ids-message>`
- If using events events are now plain JS events for example
- Can now be imported as a single JS file and used with encapsulated styles
- The type, alert icon, message text, link and link text are all configurable via properties on the custom element
- Additionally, user's can define the notification via a JS api, where the `parent` and `id` can be configured
