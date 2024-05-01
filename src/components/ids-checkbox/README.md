# Ids Checkbox Component

## Description

The IDS Checkbox component is a simple wrapper around a standard HTMLInputElement that is styled with Infor branding, and contains some additional API that makes it easy to set checkbox, label, and functionality. Checkboxes can also be grouped with a label.

## Use Cases

- Checkboxes are particularly useful in allowing users to make choices on lists of selectable options. In contrast with radio buttons, which are included in lists where options are mutually exclusive, checkboxes allow users to toggle multiple responses to “on” and “off” states.
- Create checkbox, each with different styling to provide context for actions that are checked, unchecked, indeterminate, value, disabled and colored.
- Checkboxes allow users to make zero, one, or multiple selections in a list with multiple items.

## Terminology

**Checkbox**: A standard basic checkbox element. It can set to checked, unchecked, indeterminate and disabled. IDS checkbox will add `aria-required` for required elements.
**Label**: HTMLLabelElement to keep matching with HTMLInputElement. Make sure the label has a meaningful relative. IDS Checkbox will add sudo ui `*` for required elements.

## Themeable Parts

- `label` allows you to further style the label element
- `input` allows you to further style the checkbox input element
- `label-text` allows you to further style the text element in the label

## Features (With Code Samples)

A standard Checkbox unchecked element:

```html
<ids-checkbox label="Unchecked"></ids-checkbox>
```

Set as Checked, the checkbox.

```html
<ids-checkbox label="Checked" checked="true"></ids-checkbox>
```

Set the Hitbox to Checkbox this way:

```html
<ids-checkbox label="Checkbox with Hitbox" hitbox="true"></ids-checkbox>
```

Add an Disabled Checkbox as unchecked:

```html
<ids-checkbox label="Disabled and unchecked" disabled="true"></ids-checkbox>
```

Add an Disabled Checkbox as checked:

```html
<ids-checkbox label="Disabled and checked" checked="true" disabled="true"></ids-checkbox>
```

Set validation `required` to Checkbox this way:

```html
<ids-checkbox label="Required" validate="required"></ids-checkbox>
```

Set validation `required` to Checkbox without label required indicator:

```html
<ids-checkbox label="Required (No indicator)" label-required="false" validate="required"></ids-checkbox>
```

Add an Colored checkbox

```html
<ids-checkbox checked="true" color="green" label="Green"></ids-checkbox>
<ids-checkbox checked="true" color="caution" label="Caution"></ids-checkbox>
```

Set as Indeterminate the checkbox. This `indeterminate` attribute will remove on every time checkbox `change` it's state `checked/unchecked`, so it must be added every time it need to set.

```html
<ids-checkbox label="Indeterminate" indeterminate="true"></ids-checkbox>
```

Hide label and show only checkbox:

```html
<ids-checkbox label="UnChecked" label-state="hidden"></ids-checkbox>
```

## Checkbox Groups

The IDS Checkbox Group Component consists of group of checkboxes with label. Its useful if you need to group a set of checkbox under a legend or category. Has a `label` property and `ids-checkbox` elements for slots

```html
<ids-checkbox-group label="Checkbox Group">
  <ids-checkbox label="Option 1" checked="false"></ids-checkbox>
  <ids-checkbox label="Option 2" checked="true"></ids-checkbox>
  <ids-checkbox label="Option 3" checked="true"></ids-checkbox>
</ids-checkbox-group>
```

- `label` {string} Sets the label for the checkbox group

## Checkbox Settings

- `checked` {boolean} set checked state.
- `color` {string} set the color for checkbox.
- `disabled` {boolean} set disabled state.
- `horizontal` {boolean} set checkbox layout inline as horizontal.
- `indeterminate` {boolean} This set to neither checked nor unchecked.
- `label` {string} set the label text.
- `label-state` {string} sets the checkbox label state -- can be `hidden`, or omitted.
- `label-required` {boolean} set validation `required` indicator, default is set to `true`.
- `validate` {string} set the validation rule `required`.
- `validation-events` {string} set the validation events, use `space` to add multiple default is set to `change`.
- `value` {string} set the form submit value (not to be confused with checked, it only sets the form value)
- `noAnimation` {boolean} disable the checkbox animation

## Events

- `change` The change event is fired when a checkbox element's value is committed by the user. Unlike the input event, the change event is not necessarily fired for each alteration to an element's value.
- `input` The input event fires when the value of a checkbox element has been changed.

## States

- disabled
- dirty (not supported on this component)
- validation/error
- focused
- active
- unchecked/checked/partially selected

## Keyboard Guidelines

The IDS Checkbox doesn't contain any interactions beyond a standard HTMLInputElement:

- <kbd>Tab</kbd> and <kbd>Shift Tab</kbd> moves focus into the edit field to/from the next focusable item in the tab order.
- <kbd>Space</kbd> toggle the checked/unchecked state.

## Responsive Guidelines

- Default display set as `block`, but can change to `inline-block` by use of `horizontal` attribute as `true`.

## Converting from Previous Versions (Breaking Changes)

**3.x to 4.x**
- Wrap the input in an element with the class field
- Change class `inforCheckbox` to checkbox
- Change class `inforCheckboxLabel` to checkbox-label

**4.x to 5.x**
- Markup has changed to a custom element `<ids-checkbox></ids-checkbox>`
- Can now be imported as a single JS file and used with encapsulated styles.
- If using events, events are now plain JS events (change/input ect)
- Can now use the hitbox styles by adding the setting to the ids-checkbox component

The IDS Checkbox component is now a WebComponent. Instead of using classes to define, it is done directly:

```html
<!-- 4.x checkbox example -->
<div class="field">
  <input type="checkbox" class="checkbox" name="checkbox1" id="checkbox1"/>
  <label for="checkbox1" class="checkbox-label">Unchecked</label>
</div>

<!-- this is the same checkbox using the web component version -->
<ids-checkbox label="Unchecked"></ids-checkbox>
```
