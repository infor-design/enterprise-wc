# Ids Modal Component

The Modal Component provides an interface for displaying information, forms, and other content over top of other content on the page.

The IDS Modal Component builds on top of the [Ids Popup](../ids-popup/README.md).

## Use Cases

- Display messages to the user regarding errors, alerts, or other info
- Display small forms that may apply to the next step in a workflow, like inputs/buttons/dropdowns/etc.

## Terminology

**Overlay** The transparent background that exists between the Modal and the page content.  Its opacity can be adjusted.
**Target** Refers to the element that will "trigger" the Modal by click.  This element is optional, as Modals can exist and be triggered by other operations.

## Settings (Attributes)

- `visible` can be used to make the Modal show or hide
- `buttons` (readonly) contains a list of references to any Modal Buttons present
- `messageTitle` The text present at the very top of the Modal to indicate its purpose

## Themeable Parts

- `modal` allows you to further style or adjust the outer popup element
- `overlay` allows you to adjust the overlay style

## Features (With Code Examples)

To generate a standalone Modal component, simply add an `ids-modal` tag to the page with some content in its default slot.

```html
<ids-modal id="my-modal">
    <p>This is a simple Modal component</p>
</ids-modal>
```

This modal can be controlled with Javascript

```js
const modal = document.querySelector('#my-modal');
modal.show();
// ...Modal is displayed

modal.hide();
// ...Modal is hidden
```

### Using a target

Other elements on the page, such as an [Ids Button](../ids-button/README.md) can be used as a triggering element.  In this case, a click event is bound to the defined trigger element that will activate the modal.

```html
<ids-modal id="my-modal">
    <p>This is a simple Modal component</p>
</ids-modal>

<ids-button id="trigger-button" type="secondary">
    <span slot="text">Trigger Modal</span>
    <ids-icon slot="icon" icon="launch"></ids-icon>
</ids-button>
```

```js
const modal = document.querySelector('#my-modal');
const btn = document.querySelector('#trigger-button');
modal.target = btn;

btn.click();
// ...Modal is triggered by its target element
```
### Adding a Message Title and Buttons

It's possible to append a Message Title to add more context, and Buttons to create mulitple actions that can be triggered from the Modal.  To do so, take advantage of the Modal's slots:

- The "title" slot, which can be populated by an [IdsText](../ids-text/README.md) or other text element, and will be located at the top of the Modal.
- The "buttons" slot, which can be filled with one or multiple [IdsModalButtons](../ids-modal-button/README.md), and will be located at the bottom of the Modal.

```html
<ids-modal id="my-modal">
    <ids-text slot="title" font-size="24" type="h2">This is the Title</ids-text>
    <p>This is a simple Modal component</p>
    <ids-modal-button slot="buttons" id="ok" type="primary">OK</ids-modal-button>
    <ids-modal-button slot="buttons" id="cancel" type="secondary" cancel>Cancel</ids-modal-button>
</ids-modal>
```
