# Ids Message

The IdsMessage Component provides a quick interface for displaying an application message to the user in [Modal]('../ids-modal/README.md'), along with providing quick actions related to the message.

## Use Cases

- Display application information that requires a user's attention
- Convey a specific status to the user
- Provide actions that the user can take to address the information

## Terminology

**Status** Indicates whether the message is normal (default), error, warning, success, or informative

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
    <ids-modal-button slot="buttons" appearance="secondary">OK</ids-modal-button>
    <ids-modal-button slot="buttons" appearance="primary" cancel>Cancel</ids-modal-button>
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

You can also use the Modal's `target` property to activate a Message component by clicking an associated target element, like a button for example:

```html
<ids-message id="my-message">
    <ids-text slot="title" font-size="24" type="h2">My Message Title</ids-text>
    <p>This is my message</p>
    <ids-modal-button slot="buttons" appearance="secondary">OK</ids-modal-button>
    <ids-modal-button slot="buttons" appearance="primary" cancel>Cancel</ids-modal-button>
</ids-message>

<ids-button id="trigger-button" appearance="secondary">
    <span>Show Message</span>
    <ids-icon icon="launch"></ids-icon>
</ids-button>
```

```js
// Show a message component when clicking a trigger button
const messageEl = document.querySelector('#my-message');
const btnEl = document.querySelector('#trigger-button');
messageEl.target = btnEl;

btnEl.click();
```

## Converting from Previous Versions (Breaking Changes)

**3.x to 4.x**

- Very similar and compatible with newer versions of 3.X
- dialogType option deprecated. Instead use either modal or message component
- shortMessage option now called message because there is only one option buttons works the same

**4.x to 5.x**

- The message component has been changed to a web component and renamed to `ids-message`.
- If using properties/settings these are now attributes.
- Markup has changed to a custom element `<ids-message></ids-message>`
- If using events events are now plain JS events for example
- Can now be imported as a single JS file and used with encapsulated styles
- Close X is deprecated as it is redundant with the modal buttons
- Allowed tags is not needed as you can put your own markup in the light DOM now
- The Message component now extends the Modal component, containing the same properties and methods.
- Modal Buttons, Title, Status, and Message can be changed via API
