# Ids Modal Component

The Modal Component provides an interface for displaying information, forms, and other content over top of other content on the page.

The IDS Modal Component builds on top of the [Ids Popup](../ids-popup/README.md).

## Use Cases

- Display messages to the user regarding errors, alerts, or other info
- Display small forms that may apply to the next step in a workflow, like inputs/buttons/dropdowns/etc.

## Terminology

**Overlay** The transparent background that exists between the Modal and the page content.  Its opacity can be adjusted.
**Target** Refers to the element that will "trigger" the Modal by click.  This element is optional, as Modals can exist and be triggered by other operations.

## Attributes and Properties

- visible/hidden

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
