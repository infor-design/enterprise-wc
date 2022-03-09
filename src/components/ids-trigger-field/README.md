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

Add an IdsTriggerField to the page and inside its slot add one or more ids-trigger-buttons.  The `slot` attribute can be applied the IdsTriggerButton to control its placement, but by default they will appear at the "end" side of the trigger field:

```html
<ids-trigger-field size="sm" label="Date Field">
  <ids-trigger-button slot="end">
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
>
  <ids-trigger-button slot="start">
    <ids-icon class="ids-settings" icon="settings" size="medium"></ids-icon>
    <ids-text audible="true">Call to action Button</ids-text>
  </ids-trigger-button>
  <ids-trigger-button slot="end">
    <ids-text audible="true">Popup Activator Button</ids-text>
    <ids-icon class="ids-dropdown" icon="dropdown" size="medium"></ids-icon>
  </ids-trigger-button>
</ids-trigger-field>
```

## Settings and Attributes

- `disabled` {boolean} set disabled state.
- `label` {string} This adds a label to the trigger field
- `size` {string} set the input size, it will set `md` as defaults
- `tabbable` {boolean} Turns on the functionality allow the trigger to be tabbable. For accessibility reasons this should be on in most cases and this is the default.
- `delimiter` {string} The delimiter to use when multiple values are selected.

## Converting from Previous Versions (Breaking Changes)

**3.x to 4.x**

No separate Trigger Field component is present in 4.x

**4.x to 5.x**

IdsTriggerField is a new component for 5.x

## Regional Considerations

In Right To Left Languages the trigger field and alignment will flow to the other side.
