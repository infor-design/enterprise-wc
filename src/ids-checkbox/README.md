# Ids Checkbox Component

## Description

The IDS Checkbox component is a simple wrapper around a standard HTMLInputElement that is styled with Infor branding, and contains some additional API that makes it easy to set checkbox, label, and functionality. IDS Checkbox lets the user select one or more values at a time.

## Use Cases

- Create standalone checkbox
- Create checkbox, each with different styling to provide context for actions that are checked, unchecked, indeterminate, value, disabled and colored.

## Terminology

_Checkbox:_ A standard basic checkbox element. It can set to checked, unchecked, indeterminate and disabled. IDS checkbox will add `aria-required` for required elements.

_Label:_ HTMLLabelElement to keep matching with HTMLInputElement. Make sure the input label has a meaningful relative to input. IDS Input will add sudo ui `*` for required elements.

## Features (With Code Samples)

A standard Checkbox unchecked element:

```html
<ids-checkbox label="Unchecked"></ids-checkbox>
```

Set as Checked, the checkbox.

```html
<ids-checkbox label="Checked" checked="true"></ids-checkbox>
```

Set the Dirty Tracking to Checkbox this way:

```html
<ids-checkbox label="Dirty tracking" dirty-tracker="true"></ids-checkbox>
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

Add an Colored checked:

```html
<ids-checkbox checked="true" color="emerald07" label="Emerald 07"></ids-checkbox>
<ids-checkbox checked="true" color="caution" label="Caution"></ids-checkbox>
```

Set as Indeterminate the checkbox. This `indeterminate` attribute will remove on every time checkbox `change` it's state `checked/unchecked`, so it must be added every time it need to set.

```html
<ids-checkbox label="Indeterminate" indeterminate="true"></ids-checkbox>
```

## Attributes and Properties

- `checked` {boolean} set checked state.
- `color` {string} set the color for checkbox.
- `dirty-tracker` {boolean} set dirty tracker.
- `disabled` {boolean} set disabled state.
- `display-inline` {boolean} set checkbox layout inline, most cases use as horizontal.
- `indeterminate` {boolean} This set to neither checked nor unchecked.
- `label` {string} set the label text.
- `label-font-size` {string|number} set the label font size.
- `label-required` {boolean} set validation `required` indicator, default is set to `true`.
- `validate` {string} set the validation rule `required`.
- `validation-events` {string} set the validation events, use `space` to add multiple default is set to `change`.
- `value` {string} set the checkbox value.

## Keyboard Guidelines

The IDS Checkbox doesn't contain any interactions beyond a standard HTMLInputElement:

- <kbd>Tab</kbd> and <kbd>Shift Tab</kbd> moves focus into the edit field to/from the next focusable item in the tab order.
- <kbd>Space</kbd> toggle the checked/unchecked state.

## Responsive Guidelines

- Default display set as `block`, but can change to `inline-block` by use of `display-inline` attribute as `true`.

## Converting from Previous Versions

### Converting from 4.x

The IDS Checkbox component is now a WebComponent. Instead of using classes to define, it is done directly:

```html
<!-- 4.x input example -->
<div class="field">
  <input type="checkbox" class="checkbox" name="checkbox1" id="checkbox1"/>
  <label for="checkbox1" class="checkbox-label">Unchecked</label>
</div>

<!-- this is the same input using the WebComponent -->
<ids-checkbox label="Unchecked"></ids-checkbox>
```

## Test Plan

1. Accessibility - Axe
2. Visual Regression Test
3. Repeat Tests in All Supported Browsers
4. Some of these as test cases from the [WC gold standard](https://github.com/webcomponents/gold-standard/wiki#api)
5. Can be consumed in NG/Vue/React (pull it in standalone/built see it works standalone)
