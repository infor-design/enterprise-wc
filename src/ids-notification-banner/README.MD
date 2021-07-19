# Ids Notification Banner

## Description
The Ids Notification Banner allows developers to display a message and optionally a link to more information to the user. A user can dismiss banner or click through the provided link.

## Use Cases
There are 4 different types of notification banners. Each type has a unique background color and icon.

- success
- alert
- info
- error

## Features (With Code Examples)

A success notification banner with link.

```html
<ids-notification-banner
  id="ids-notification-banner-0"
  message-text="DTO rejected by your manager for Sept 30, 2018."
  type="success"
  link="https://infor.com"
>
</ids-notification-banner>
```

An info notification banner with custom link text

```html
<ids-notification-banner
  id="ids-notification-banner-0"
  message-text="DTO rejected by your manager for Sept 30, 2018."
  type="info"
  link="https://infor.com"
  link-text="Learn More"
>
</ids-notification-banner>
```

An error notification banner with no link

```html
<ids-notification-banner
  id="ids-notification-banner-0"
  message-text="DTO rejected by your manager for Sept 30, 2018."
  type="error"
>
</ids-notification-banner>
```

Add a notification banner dynamically

```js
const notificationBanner = new IdsNotificationBanner();
notificationBanner.add({
  id: 'ids-notification-banner-1',
  parent: 'notification-container',
  type: 'alert',
  messageText: 'DTO accepted by your manager for Sept 30, 2018.',
  link: 'https://infor.com',
  linkText: 'Learn More'
});
```

```html
<div id="notification-banner"></div>
```

## Settings and Attributes
- `type` `{string}` can be 1 of 4 types (success, alert, info, error)
- `message-text` `{string}` text shown inside the banner
- `link` `{string | null}` url for the call to action in the banner
- `link-text` `{string | null}` custom text for the call to action (if `null` will display "Click to view")

## Themeable Parts

TODO

## Keyboard Guidelines
- TAB should move off of the component to the next focusable element on page.
- SHIFT + TAB should move to previous focusable element on the page.

## Responsive Guidelines

- The notification is 100% wide and will full the parent container by default
- The message text will be non-breaking and display ellipsis when there is not enough visible space.

## Converting from Previous Versions

TODO

## Accessibility Guidelines

TODO

## Regional Considerations

TODO
