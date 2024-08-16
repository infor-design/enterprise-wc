# ids-checkbox

## Description

The ids-checkbox is a wrapper around a standard `HTMLInputElement` that provides additional API for setting checkbox states, labels, and functionality. Checkboxes can also be grouped together with a label. See more [usage details](https://design.infor.com/components/components/checkbox).

## Terminology

- **Checkbox**: A standard checkbox element that can be set to checked, unchecked, indeterminate, or disabled. It adds `aria-required` for required elements.
- **Label**: An `HTMLLabelElement` associated with the checkbox input. Make sure the label has a meaningful relative. It will add pseudo UI `*` for required elements.

## Themeable Parts

- `label` allows further styling of the label element
- `input` allows further styling of the checkbox input element
- `label-text` allows further styling of the text element in the label

## Features (With Code Samples)

A standard `unchecked` checkbox:

```html
<ids-checkbox label="Unchecked"></ids-checkbox>
```

Sets the checkbox as `checked`:

```html
<ids-checkbox label="Checked" checked="true"></ids-checkbox>
```

Set the hitbox to the checkbox:

```html
<ids-checkbox label="Checkbox with Hitbox" hitbox="true"></ids-checkbox>
```

### Disabled Checkboxes

Add a disabled checkbox as unchecked:

```html
<ids-checkbox label="Disabled and unchecked" disabled="true"></ids-checkbox>
```

Add a disabled checkbox as checked:

```html
<ids-checkbox label="Disabled and checked" checked="true" disabled="true"></ids-checkbox>
```

Set validation `required` to the checkbox:

```html
<ids-checkbox label="Required" validate="required"></ids-checkbox>
```

Set validation `required` to the checkbox without label required indicator:

```html
<ids-checkbox label="Required (No indicator)" label-required="false" validate="required"></ids-checkbox>
```

Customize the checkbox color:

```html
<ids-checkbox checked="true" color="green" label="Green"></ids-checkbox>
<ids-checkbox checked="true" color="caution" label="Caution"></ids-checkbox>
```

Set an indeterminate state. The `indeterminate` attribute will be removed each time the checkbox `change` its state `checked/unchecked`, so it must be added every time it need to set.

```html
<ids-checkbox label="Indeterminate" indeterminate="true"></ids-checkbox>
```

Hide the checkbox label:

```html
<ids-checkbox label="UnChecked" label-state="hidden"></ids-checkbox>
```

## Checkbox Groups

The Checkbox Group consists of a set of checkboxes with labels. It groups a set of options with a summarizing `<legend>`. Has a `label` property and `ids-checkbox` elements for slots.

```html
<ids-checkbox-group label="Checkbox Group">
  <ids-checkbox label="Option 1" checked="false"></ids-checkbox>
  <ids-checkbox label="Option 2" checked="true"></ids-checkbox>
  <ids-checkbox label="Option 3" checked="true"></ids-checkbox>
</ids-checkbox-group>
```

- `label` {string} Sets the label for the checkbox group

## Checkbox Settings

- `checked` {boolean} Sets the checked state.
- `color` {string} Sets the checkbox color.
- `disabled` {boolean} Sets the disabled state.
- `horizontal` {boolean} Sets the checkbox layout inline as horizontal.
- `indeterminate` {boolean} Sets the checkbox to neither checked nor unchecked.
- `label` {string} Sets the label text.
- `label-state` {string} Sets the checkbox label state: can be `hidden` or omitted.
- `label-required` {boolean} Sets validation `required` indicator. Defaults to `true`.
- `validate` {string} Sets the validation rule `required`.
- `validation-events` {string} Sets the validation events. Use `space` to add multiple. Defaults to `change`.
- `value` {string} Sets the `<form>` `submit` value (not to be confused with `checked`, it only sets the form value).
- `noAnimation` {boolean} Disables the checkbox animation.

## Events

- `change`: The change event is fired when a checkbox element's value is committed by the user. Unlike the input event, the change event is not necessarily fired for each alteration to an element's value.
- `input`: The input event fires when the value of a checkbox element has been changed.

## States

- disabled
- dirty (not supported on this component)
- validation/error
- focused
- active
- unchecked/checked/indeterminate

## Responsive Guidelines

- Default display set as `block`, but can change to `inline-block` by setting `horizontal` attribute to `true`.

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

The IDS Checkbox component is now a Web Component. Instead of using classes to define, it is done directly:

```html
<!-- 4.x checkbox example -->
<div class="field">
  <input type="checkbox" class="checkbox" name="checkbox1" id="checkbox1"/>
  <label for="checkbox1" class="checkbox-label">Unchecked</label>
</div>

<!-- this is the same checkbox using the web component version -->
<ids-checkbox label="Unchecked"></ids-checkbox>
```
