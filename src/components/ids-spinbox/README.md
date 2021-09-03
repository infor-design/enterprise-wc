# Ids Spinbox Component

## Description
Allows a user to input a value that goes up/down in specific intervals, and also optionally within a range of integers.

## Use Cases
- a normal input that goes up or down specific increments by it's nature.

## Themeable Parts
- `container` the overall spinbox container
- `input` the spinbox center input
- `button` increment/decrement buttons
- `label` the label above the input
- `validation` the validation message that pops up if any errors exist

## Features (With Code Examples)

Spinbox with a minimum and maximum

```html
<ids-spinbox
  value="0"
  min="0"
  max="5"
  label="Enter an int from 0 to 5"
  placeholder="0=>5"
></ids-spinbox>
```

Spinbox which increments in intervals of 5
```html
 <ids-spinbox
  value="0"
  min="-25"
  max="25"
  step="5"
  label="Jumps 5 from -25 to 25"
></ids-spinbox>
 ```

Spinbox which shows a marker with changes, and no range limits

```html
<ids-spinbox
  value="0"
  label="Unbounded Spinbox"
  dirty-marker="true"
></ids-spinbox>
```

Spinbox which is required to have a value set when tabbed off.

```html
<ids-spinbox
  value=""
  label="Value Is Required"
  validation="required"
></ids-spinbox>
```

## Settings and Attributes

`value` `{number}` the current number assigned to the step box

`max` `{number}` maximum/ceiling value possible to assign to `value`

`min` `{number}` minimum/floor value possible to assign to `value`

`label` `{string}` label shown above the spinbox

`labelHidden` `{string}` label whether a label's text has been flagged as hidden.
(a label is still required for the sake of accessibility and will be applied on the input element)

`placeholder` `{string}` text shown as a hint when user clears text on the input

`validate` `{string}` validation message text; set to `required` to require validation.

## Keyboard Guidelines
- TAB should move off of the component to the next focusable element on page.
- SHIFT + TAB should move to previous focusable element on the page.
- UP/DOWN arrow keys should increment, and decrement the ids-spinbox value.

## Responsive Guidelines

N/A

## Converting from Previous Versions

TODO

## Accessibility Guidelines
- 1.4.3 Contrast (Minimum) - there should be enough contrast on the background which the wizard resides on in the page.
- Be sure to provide labels that provide clear intent as to the representation of the value which the spinbox controls.

## Regional Considerations
Label text should be localized in the current language. All elements will flip to the alternate side in Right To Left mode. Consider that in some languages text may be a lot longer (German). And in some cases it cant be wrapped (Thai). For some of these cases text-ellipsis is supported.
