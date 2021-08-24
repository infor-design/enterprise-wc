# Ids Trigger Field Component

## Description

We include a trigger field component that helps layout an input next to a button (the trigger button). This component can be used on its own, but its generally used to make other internal components (datepicker, timepicker ect).

## Use Cases

- When you want an input with a trigger button icon that opens some kind of selection dialog that works with the field.

## Terminology

- **Trigger**: The button next to the input element
- **Input**: The input element

## Features (With Code Examples)

Add an ids-trigger-field to the page and inside its slot add an ids-input and ids-trigger-button.

```html
<ids-trigger-field tabbable="false">
  <ids-input slot="ids-trigger-field-input" label="Date Field" size="sm"></ids-input>
  <ids-trigger-button slot="ids-trigger-field-btn-end">
    <ids-text audible="true">Date Field trigger</ids-text>
    <ids-icon slot="icon" icon="schedule"></ids-icon>
  </ids-trigger-button>
</ids-trigger-field>
```

Example usage with buttons on both sides of input. In order to wrap the border around the buttons and `ids-input` you need to add the `content-borders` attribute to `ids-trigger-field`

```html
<ids-trigger-field
    id="trigger-field-1"
    label="Trigger field label"
    tabbable="false"
    content-borders
>
  <ids-trigger-button class="color-preview">
    <ids-icon class="ids-dropdown" icon="dropdown" size="medium"></ids-icon>
    <ids-text audible="true">Call to action</ids-text>
  </ids-trigger-button>
  <ids-input placeholder="Enter Product"></ids-input>
  <ids-trigger-button>
    <ids-text audible="true">color picker trigger</ids-text>
    <ids-icon class="ids-dropdown" icon="dropdown" size="medium"></ids-icon>
  </ids-trigger-button>
</ids-trigger-field>
```

## Settings and Attributes

- `appearance` {string} Turns on the functionality to have more compact field size (TODO)
- `content-borders` {boolean} This adds the 'input' border and focus state to the ids-trigger-field-content.
- `disabled` {boolean} set disabled state.
- `label` {string} This adds a label to the trigger field
- `size` {string} set the input size, it will set `md` as defaults
- `tabbable` {boolean} Turns on the functionality allow the trigger to be tabbable. For accessibility reasons this should be on in most cases and this is the default.

## Converting from Previous Versions

- 3.x: There was no separate trigger field component.
- 4.x: There was no separate trigger field component.

## Regional Considerations

In Right To Left Languages the trigger field and alignment will flow to the other side.
