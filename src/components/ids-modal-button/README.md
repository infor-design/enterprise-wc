# Ids Modal Button Component

## Description

The IdsModalButton Component is an extension of the regular [IdsButton Component](../ids-button/README.md) that displays the button in a larger style that fits within [IdsModal Components](../ids-modal/README.md).

## Use Cases

- Create buttons for use within Modal-type components

## States/Attributes

`cancel` a special flag that can be applied to Modal Buttons to more easily identify them as being associated with a "cancelling" action.

## Features (With Code Examples)

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

Modal Buttons in 4.x were defined with only CSS classes

**4.x to 5.x**

- Modal Buttons are now standalone custom elements `<ids-modal-button></ids-modal-button>`
