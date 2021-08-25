# Ids Message

The IdsMessage Component provides a quick interface for displaying an application message to the user in [Modal]('../ids-modal/README.md'), along with providing quick actions related to the messsage.

## Use Cases

- Display application information that requires a user's attention
- Convey a specific status to the user
- Provide ansulary actions that the user can take to address the information

## Terminology

**Status** Indicates whether the message is normal (default), error, alert, success, or informative

## Attributes and Properties

- `status` sets/removes the Status type
- `message` sets the contents of the message

## Features (With Code Examples)

A basic, barebones message might look like this:

```html
<ids-message id="my-message">
    <p>This is my message</p>
</ids-message>
```

Messages can have titles and buttons (just the same as [Modals](../ids-modal/README.md)), as well as Statuses.  Statuses and Titles are appended with an attribute on the Message, while Buttons are added by slot.

```html
<ids-message id="my-message">
    <ids-text slot="title" font-size="24" type="h2">My Message Title</ids-text>
    <p>This is my message</p>
    <ids-modal-button slot="buttons" type="secondary">OK</ids-modal-button>
    <ids-modal-button slot="buttons" type="primary" cancel>Cancel</ids-modal-button>
</ids-message>
```

You can manipulate the Message by using its Javascript API

```js
const messageEl = document.querySelector('#my-message');
messageEl.messageTitle = 'Different Title';
messageEl.message = 'Alternate Message';
messageEl.status = 'success';
```

Messages extend [Modals](../ids-modal/README.md), so it's possible to configure them in similar fashion.  You can control Messages manually with the same API:

```js
// Manually show a Message Component
const messageEl = document.querySelector('#my-message');
messageEl.show();
```

You can also take advange of the Modal's `target` property to activate a Message component by clicking an associated target element, like a button for example:

```html
<ids-message id="my-message">
    <ids-text slot="title" font-size="24" type="h2">My Message Title</ids-text>
    <p>This is my message</p>
    <ids-modal-button slot="buttons" type="secondary">OK</ids-modal-button>
    <ids-modal-button slot="buttons" type="primary" cancel>Cancel</ids-modal-button>
</ids-message>

<ids-button id="trigger-button" type="secondary">
    <span slot="text">Show Message</span>
    <ids-icon slot="icon" icon="launch"></ids-icon>
</ids-button>
```

```js
// Show a message component when clicking a trigger button
const messageEl = document.querySelector('#my-message');
const btnEl = document.querySelector('#trigger-button');
messageEl.target = btnEl;

btnEl.click();
```
