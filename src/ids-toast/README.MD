# Ids Toast Component

## Description

Toasts are used to display confirmations of success, failure, or other statuses of system processes related to a user’s workflow. If a user submits a form, a toast will confirm the successful or unsuccessful completion of that submission. Toasts are dismissible via the “close” icon or the escape key. If not dismissed, the toast will hide after a configurable amount of time. The Toast will close itself after a timeout (default 6s) or if the close button is clicked. It is also possible to have more than one toast onscreen at a time.

## Use Cases

- Toast component use to give feedback to users after an action has taken place.
- Use a toast component to display notifications and other non-critical messages.

## Terminology

**Title:** An html text element that display as toast message title.
**Message:** An html text element that display as toast message body.
**Close Button:** A trigger button to close the toast message.
**Progress Bar:** An html element that display as progress bar.

## Features (With Code Examples)

A normal toast used as a web component.

```html
<ids-button id="btn-toast" type="secondary">
  <span slot="text">Toast Message</span>
</ids-button>
```

```javascript
const btnToast = document.querySelector('#btn-toast');

btnToast?.addEventListener('click', () => {
  const toastId = 'demo-toast';
  let toast = document.querySelector(`#${toastId}`);
  if (!toast) {
    toast = document.createElement('ids-toast');
    toast.setAttribute('id', toastId);
    document.body.appendChild(toast);
  }

  toast.show({
    title: 'Application Offline',
    message: 'This is a Toast message.'
  });
});
```

Set position of the toast container in specific place

```html
<ids-button id="btn-toast" type="secondary">
  <span slot="text">Position</span>
</ids-button>
```

```javascript
const btnToast = document.querySelector('#btn-toast');

btnToast?.addEventListener('click', () => {
  const toastId = 'demo-toast';
  let toast = document.querySelector(`#${toastId}`);
  if (!toast) {
    toast = document.createElement('ids-toast');
    toast.setAttribute('id', toastId);
    // 'bottom-end', 'bottom-start', 'top-end', 'top-start' (default: 'top-end')
    toast.position = 'bottom-start';
    document.body.appendChild(toast);
  }
  toast.show({
    title: 'Application Offline',
    message: 'This is a Toast message.'
  });
});
```

Set user to allows drag/drop the toast container

```html
<ids-button id="btn-toast" type="secondary">
  <span slot="text">Draggable</span>
</ids-button>
```

```javascript
const btnToast = document.querySelector('#btn-toast');

btnToast?.addEventListener('click', () => {
  const toastId = 'demo-toast';
  let toast = document.querySelector(`#${toastId}`);
  if (!toast) {
    toast = document.createElement('ids-toast');
    toast.setAttribute('id', toastId);
    toast.draggable = true;
    document.body.appendChild(toast);
  }
  toast.show({
    title: 'Application Offline',
    message: 'This is a Toast message.'
  });
});
```

Save toast container position to local storage, apply only when draggable set to true

```html
<ids-button id="btn-toast" type="secondary">
  <span slot="text">Save position</span>
</ids-button>
```

```javascript
const btnToast = document.querySelector('#btn-toast');

btnToast?.addEventListener('click', () => {
  const toastId = 'demo-toast';
  // uniqueId: Use when need to clear saved position from storage
  // if not will use internal auto generated
  const uniqueId = 'some-uniqueid';
  let toast = document.querySelector(`#${toastId}`);
  if (!toast) {
    toast = document.createElement('ids-toast');
    toast.setAttribute('id', toastId);
    toast.draggable = true;
    toast.uniqueId = uniqueId;
    toast.savePosition = true;
    document.body.appendChild(toast);
  }
  toast.show({
    title: 'Application Offline',
    message: 'This is a Toast message.'
  });
});
```

Clear the saved position from local storage

```html
<ids-button id="btn-toast" type="secondary">
  <span slot="text">Clear saved position</span>
</ids-button>
```

```javascript
const btnToast = document.querySelector('#btn-toast');

btnToast?.addEventListener('click', () => {
  // uniqueId: used with toast while saved position toast
  const uniqueId = 'some-uniqueid';
  const toast = document.createElement('ids-toast');
  toast.clearPosition(uniqueId);
});
```

Clear all toast related saved position from local storage

```html
<ids-button id="btn-toast" type="secondary">
  <span slot="text">Clear (all) saved positions</span>
</ids-button>
```

```javascript
const btnToast = document.querySelector('#btn-toast');

btnToast?.addEventListener('click', () => {
  const toast = document.createElement('ids-toast');
  toast.clearPositionAll();
});
```

Set to not destroy after complete all the toast messages

```html
<ids-button id="btn-toast" type="secondary">
  <span slot="text">No destroy after complete</span>
</ids-button>
```

```javascript
const btnToast = document.querySelector('#btn-toast');

btnToast?.addEventListener('click', () => {
  const toastId = 'demo-toast';
  let toast = document.querySelector(`#${toastId}`);
  if (!toast) {
    toast = document.createElement('ids-toast');
    toast.setAttribute('id', toastId);
    toast.destroyOnComplete = false;
    document.body.appendChild(toast);
  }
  toast.show({
    title: 'Application Offline',
    message: 'This is a Toast message.'
  });
});
```

Set to put links in the toast message

```html
ids-button id="btn-toast" type="secondary">
  <span slot="text">Allow link</span>
</ids-button>
```

```javascript
const btnToast = document.querySelector('#btn-toast');

btnToast?.addEventListener('click', () => {
  const toastId = 'demo-toast';
  let toast = document.querySelector(`#${toastId}`);
  if (!toast) {
    toast = document.createElement('ids-toast');
    toast.setAttribute('id', toastId);
    document.body.appendChild(toast);
  }
  toast.show({
    title: 'Application Offline',
    message: 'Link in message: <ids-hyperlink href="http://www.example.com" target="_blank">Google</ids-hyperlink>',
    allowLink: true
  });
});
```

Set the amount of time (2 seconds), the toast should be present on-screen

```html
<ids-button id="btn-toast" type="secondary">
  <span slot="text">Timeout (2 seconds)</span>
</ids-button>
```

```javascript
const btnToast = document.querySelector('#btn-toast');

btnToast?.addEventListener('click', () => {
  const toastId = 'demo-toast';
  let toast = document.querySelector(`#${toastId}`);
  if (!toast) {
    toast = document.createElement('ids-toast');
    toast.setAttribute('id', toastId);
    document.body.appendChild(toast);
  }
  toast.show({
    title: 'Application Offline',
    message: 'This is a Toast message.',
    timeout: 2000
  });
});
```

Custom text that use for close button label in the toast message

```html
<ids-button id="btn-toast" type="secondary">
  <span slot="text">Close button custom label text</span>
</ids-button>
```

```javascript
const btnToast = document.querySelector('#btn-toast');

btnToast?.addEventListener('click', () => {
  const toastId = 'demo-toast';
  let toast = document.querySelector(`#${toastId}`);
  if (!toast) {
    toast = document.createElement('ids-toast');
    toast.setAttribute('id', toastId);
    document.body.appendChild(toast);
  }
  toast.show({
    title: 'Application Offline',
    message: 'This is a Toast message.',
    closeButtonLabel: 'Click here to close'
  });
});
```

Hide the progress bar in toast message

```html
<ids-button id="btn-toast" type="secondary">
  <span slot="text">Progress bar (hidden)</span>
</ids-button>
```

```javascript
const btnToast = document.querySelector('#btn-toast');

btnToast?.addEventListener('click', () => {
  const toastId = 'demo-toast';
  let toast = document.querySelector(`#${toastId}`);
  if (!toast) {
    toast = document.createElement('ids-toast');
    toast.setAttribute('id', toastId);
    document.body.appendChild(toast);
  }
  toast.show({
    title: 'Application Offline',
    message: 'This is a Toast message.',
    progressBar: false
  });
});
```

Let toast message to be invisible on the screen

```html
<ids-button id="btn-toast" type="secondary">
  <span slot="text">Audible only</span>
</ids-button>
```

```javascript
const btnToast = document.querySelector('#btn-toast');

btnToast?.addEventListener('click', () => {
  const toastId = 'demo-toast';
  let toast = document.querySelector(`#${toastId}`);
  if (!toast) {
    toast = document.createElement('ids-toast');
    toast.setAttribute('id', toastId);
    document.body.appendChild(toast);
  }
  toast.show({
    title: 'Application Offline',
    message: 'This is a Toast message.',
    audible: true
  });
});
```

Toast message by markup

```html
<ids-button id="btn-toast" type="secondary">
  <span slot="text">Toast message by markup</span>
</ids-button>
<ids-toast id="toast-markup" destroy-on-complete="false">
  <span slot="title">Application Offline</span>
  <span slot="message">This is a Toast message.</span>
</ids-toast>
```

```javascript
const btnToast = document.querySelector('#btn-toast');
const toast = document.querySelector('#demo-toast');

btnToast?.addEventListener('click', () => {
  toast.show();
});
```

## Settings and Attributes (Toast)

- `allowLink` {boolean} Set to put links in the toast message
- `audible` {boolean} Set as invisible on the screen, but still read out loud by screen readers
- `destroyOnComplete` {boolean} Set to destroy after complete all the toast messages
- `draggable` {boolean} Set user to allows drag/drop the toast container
- `position` {string} Set position of the toast container in specific place
- `progressBar` {boolean} Set toast to have a visible progress bar
- `savePosition` {boolean} Set toast container to save position to local storage, apply only when draggable set to true
- `timeout` {number} Set the amount of time, the toast should be present on-screen
- `uniqueId` {number} Set uniqueId to save to local storage, so same saved position can be use for whole app, apply only when draggable set to true

## Settings and Attributes (Toast Message)

- `audible` {boolean} Set as invisible on the screen, but still read out loud by screen readers
- `progressBar` {boolean} Set toast to have a visible progress bar
- `timeout` {number} Set the amount of time, the toast should be present on-screen
- `messageId` {string} Set id to manage each toast message

## Theme-able Parts (Toast Message)

- `toast` allows you to further style the toast element
- `title` allows you to further style the toast title element
- `message` allows you to further style the toast message element
- `progress-bar` allows you to further style the toast progress bar element
- `close-button` allows you to further style the toast close button element
- `close-button-icon` allows you to further style the toast close button icon element

## States and Variations (With Code Examples)

- Audible
- Auto Closeable
- Closeable
- Contains Link
- Draggable

## Keyboard Guidelines

- <kbd>Tab/Shift+Tab</kbd>: If the tab is focusable this will focus or unfocus the toast.
- <kbd>Control+Alt+P</kbd>: It will toggle pause and play timeout timer.
- <kbd>Escape</kbd>: It will close the toast message.

## Responsive Guidelines

- Toasts can be configured to appear at either the top-start, top-end, bottom-start or bottom-end of an application window.
- Will be placed in the top-end corner by default.

## Converting from Previous Versions

- 3.x: Toast have all new markup and classes.
- 4.x: Toast have all new markup and classes for web components.

## Designs

[Design Specs](https://www.figma.com/file/ok0LLOT9PP1J0kBkPMaZ5c/IDS_Component_File_v4.6-(Draft))

## Accessibility Guidelines

## Regional Considerations

Labels should be localized in the current language. The close icon and progress bar will flip to the alternate side in Right To Left mode. Consider that in some languages text may be a lot longer (German). And in some cases it cant be wrapped (Thai).
