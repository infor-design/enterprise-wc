# Ids Trigger Field Component

## Description

We include a trigger field component that helps layout an input next to a button (the trigger button). This component can be used on its own, but its generally used to make other internal components (date picker, time picker ect).

## Class Hierarchy

- IdsTriggerField
  - IdsInput
    - IdsElement
- Mixins
  IdsDirtyTrackerMixin
  IdsColorVariantMixin
  IdsClearableMixin
  IdsEventsMixin
  IdsKeyboardMixin
  IdsMaskMixin
  IdsThemeMixin
  IdsTooltipMixin
  IdsValidationMixin

## Use Cases

- When you want an input with a trigger button/buttons that opens some kind of selection dialog that works with the field.

## Terminology

- **Trigger**: The button next to the input element
- **Input**: The input element

## Features (With Code Examples)

Add an ids-trigger-field to the page and inside its slot add an ids-input and ids-trigger-button.

```html
<ids-trigger-field size="sm" label="Date Field" tabbable="false">
  <ids-input></ids-input>
  <ids-trigger-button>
    <ids-text audible="true">Date Field trigger</ids-text>
    <ids-icon slot="icon" icon="schedule"></ids-icon>
  </ids-trigger-button>
</ids-trigger-field>
```

Example usage with buttons on both sides of input.

```html
<ids-trigger-field
    id="trigger-field-1"
    label="Trigger field label"
    tabbable="false"
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
- `disabled` {boolean} set disabled state.
- `label` {string} This adds a label to the trigger field
- `size` {string} set the input size, it will set `md` as defaults
- `tabbable` {boolean} Turns on the functionality allow the trigger to be tabbable. For accessibility reasons this should be on in most cases and this is the default.
- `delimiter` {string} The delimiter to use when multiple values are selected.

## Converting from Previous Versions

- 3.x: There was no separate trigger field component.
- 4.x: There was no separate trigger field component.

## Regional Considerations

In Right To Left Languages the trigger field and alignment will flow to the other side.
