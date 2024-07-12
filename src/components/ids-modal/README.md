# ids-modal

## Description

The modal is a dialog, built on top of the [ids-popup](../ids-popup/README.md), that displays information over page content. See more [usage details](https://design.infor.com/components/components/modal).

## Terminology

**Overlay** The transparent background that exists between the Modal and the page content. The opacity is adjustable.
**Target** Refers to the element that will "trigger" the Modal by click.  This element is optional, as Modals can exist and be triggered by other operations.

## Settings (Attributes)

- `fullsize` Defines what breakpoint (if any) should cause the modal to transform into full size mode, which takes up 100% width/height of the browser viewport. Can also be set to `''` (no change) or `always` (always at 100%).
- `visible` Shows or hides the Modal.
- `buttons` (readonly) contains a list of references to any Modal Buttons present.
- `messageTitle` The text present at the very top of the modal to indicate its purpose.
- `scrollable` If `true`, allows the "modal-content" element inside the modal to scroll its contents.
- `showCloseButton` Used to show the close button in modal.
- `clickOutsideToClose` {true|false} - If `true`, the modal can be closed by clicking outside. Default is `false`.

## Themeable Parts

- `modal` allows you to further style or adjust the outer popup element
- `overlay` allows you to adjust the overlay style

## Features (With Code Examples)

To generate a standalone modal component, add an `ids-modal` tag to the page with some content in its default slot.

```html
<ids-modal id="my-modal">
    <p>This is a simple Modal component</p>
</ids-modal>
```

This modal can be controlled with Javascript:

```js
const modal = document.querySelector('#my-modal');
modal.show();
// ...Modal is displayed

modal.hide();
// ...Modal is hidden
```

### Using a target

Other elements on the page, such as an [ids-button](../ids-button/README.md) can be used as a triggering element. In this case, a click event is bound to the defined trigger element that will activate the modal.

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

Add the title and modal actions by using the Modal's slots:

- The "title" slot, which can be populated by an [ids-text](../ids-text/README.md) or another text element, is at the top of the Modal.
- The "buttons" slot, which can be filled with one or multiple ids-modal-buttons, is at the bottom of the Modal.

```html
<ids-modal id="my-modal">
    <ids-text slot="title" font-size="24" type="h2">This is the Title</ids-text>
    <p>This is a simple Modal component</p>
    <ids-modal-button slot="buttons" id="ok" appearance="primary">OK</ids-modal-button>
    <ids-modal-button slot="buttons" id="cancel" appearance="secondary" cancel>Cancel</ids-modal-button>
</ids-modal>
```

### Displaying in full size mode

IdsModal can alter its display mode to take up 100% of the browser viewport's width/height by using the `fullsize` attribute:

```html
<ids-modal id="my-modal" fullsize="lg">
    <ids-text slot="title" font-size="24" type="h2">Fullsize Modal</ids-text>
    <p>This modal will transform when below the `lg` breakpoint</p>
    <ids-modal-button slot="buttons" id="ok" appearance="primary">OK</ids-modal-button>
    <ids-modal-button slot="buttons" id="cancel" appearance="secondary" cancel>Cancel</ids-modal-button>
</ids-modal>
```

The full size attribute can be defined with an IDS Breakpoint, as defined in the [IdsBreakpointMixin](https://github.com/infor-design/enterprise-wc/blob/main/src/mixins/ids-breakpoint-mixin/README.md).  Alternatively, this setting can be changed to `null` or `''` resulting in no fullscreen mode, or `'always'` which forces the fullscreen mode to be displayed indefinitely.

By default, the full size setting on all modals is set to Small (`sm`) and will break when the viewport width is below 600px.

### Handling scrolled content

Scrolled content on IdsModal can be configured using the `scrollable` setting.  By default, scrolling is disabled on the internal `ids-modal-content` element, which wraps the slot containing all nested content outside the header and footer areas.  In situations where scrolling is not handled by one of the slotted elements, using `scrollable="true"` will enable the scrolling internally.

If a scrollable element such as [IdsSplitter](../ids-splitter/README.md) has been slotted, a best practice is to defer to that element for scrolling behavior on its own child elements.  In this case, `scrollable` should be set to false.


### ids-modal-button

The Modal Button is an extension of the [ids-button](../ids-button/README.md), displaying in a larger style that fits within Modal. Used to create buttons for use within Modal-type components.

#### States/Attributes

`cancel` a special flag that can be applied to Modal Buttons to more easily identify them as being associated with a "cancelling" action.

#### Code Example

Modal Buttons extend regular buttons and are constructed with similar markup.

```html
<ids-modal-button id="button-ok" appearance="primary">
    <ids-text>OK</ids-text>
</ids-modal-button>
<ids-modal-button id="button-ok" appearance="secondary" cancel>
    <ids-text>Cancel</ids-text>
</ids-modal-button>
```

## Converting from Previous Versions (Breaking Changes)

**3.x to 4.x**

- Modal was added in v4.0.0
- Replace `.inforDialog()` with `.modal()`

**4.x to 5.x**

- Modal is now a custom element `<ids-modal></ids-modal>`
- Modal content is now user-defined by slot
- Triggering element for the modal is now configurable with the `target` prop
- Events are now just plain JS events
