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

- `fullsize` used for defining what breakpoint (if any) should cause the modal to transform into fullsize mode, which takes up 100% width/height of the browser viewport.  Can also be set to `''` (no change) or `always` (always at 100%)
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

<ids-button id="trigger-button" appearance="secondary">
    <span>Trigger Modal</span>
    <ids-icon icon="launch"></ids-icon>
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

It's possible to append a Message Title to add more context, and Buttons to create multiple actions that can be triggered from the Modal.  To do so, take advantage of the Modal's slots:

- The "title" slot, which can be populated by an [IdsText](../ids-text/README.md) or other text element, and will be located at the top of the Modal.
- The "buttons" slot, which can be filled with one or multiple [IdsModalButtons](../ids-modal-button/README.md), and will be located at the bottom of the Modal.

```html
<ids-modal id="my-modal">
    <ids-text slot="title" font-size="24" type="h2">This is the Title</ids-text>
    <p>This is a simple Modal component</p>
    <ids-modal-button slot="buttons" id="ok" appearance="primary">OK</ids-modal-button>
    <ids-modal-button slot="buttons" id="cancel" appearance="secondary" cancel>Cancel</ids-modal-button>
</ids-modal>
```

### Displaying in fullsize mode

IdsModal can alter its display mode to take up 100% of the browser viewport's width/height by using the `fullsize` attribute:

```html
<ids-modal id="my-modal" fullsize="lg">
    <ids-text slot="title" font-size="24" type="h2">Fullsize Modal</ids-text>
    <p>This modal will transform when below the `lg` breakpoint</p>
    <ids-modal-button slot="buttons" id="ok" appearance="primary">OK</ids-modal-button>
    <ids-modal-button slot="buttons" id="cancel" appearance="secondary" cancel>Cancel</ids-modal-button>
</ids-modal>
```

The fullsize attribute can be defined with an IDS Breakpoint, as defined in the [IdsBreakpointMixin](../../mixins/ids-breakpoint-mixin/README.md).  Alternatively, this setting can be changed to `null` or `''` resulting in no fullscreen mode, or `'always'` which forces the fullscreen mode to be displayed indefinitely.

By default, the fullsize setting on all modals is set to Small (sm) and will break when the viewport width is below 600px.

## Converting from Previous Versions (Breaking Changes)

**3.x to 4.x**

- Modal was added in v4.0.0
- Replace `.inforDialog()` with `.modal()`

**4.x to 5.x**

- Modal is now a custom element `<ids-modal></ids-modal>`
- Modal content is now user-defined by slot
- Triggering element for the modal is now configurable with the `target` prop
- Events are now just plain JS events
