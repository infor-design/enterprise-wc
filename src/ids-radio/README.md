# Ids Radio Component

## Description

The IDS Radio component is a web component wrapper around a standard input radio element that is styled to Infor branding, and contains some additional API that makes it easy to set radio, label, and functionality.

## Use Cases

- Allows for making one selection out of a group of options.
- Radio buttons are particularly useful in allowing users to make single choices from lists of selectable options. When multiple items are available to choose from, use checkboxes or in some cases, switches.

## Terminology

**Radio Button:** A standard basic radio button element. It can set to checked, unchecked and disabled.
**Label:** HTMLLabelElement to keep matching with HTMLInputElement. Make sure the label has a meaningful content.

## Features (With Code Samples)

A standard single unchecked radio element:

```html
<ids-radio value="opt1" label="Option one"></ids-radio>
```

Set the radio as checked:

```html
<ids-radio value="opt1" label="Option one" checked="true"></ids-radio>
```

Add an unchecked and disabled radio:

```html
<ids-radio value="opt1" label="Option one" disabled="true"></ids-radio>
```

Add an checked and disabled radio:

```html
<ids-radio value="opt1" label="Option one" checked="true" disabled="true"></ids-radio>
```

Add an colored radio - use this option only in special use cases

```html
<ids-radio checked="true" color="emerald07" value="emerald07" label="Emerald 07"></ids-radio>
```

## Attributes and Properties

- `checked` {boolean} set checked state.
- `color` {string} set the color for radio.
- `disabled` {boolean} set disabled state.
- `group-disabled` {boolean} set disabled state, if group disabled.
- `horizontal` {boolean} set radio layout inline as horizontal.
- `label` {string} set the label text.
- `label-font-size` {string|number} set the label font size.
- `validation-has-error` {boolean} set the validation error state.
- `value` {string} set the radio value.

## States and Variations

- Unchecked
- Checked/Selected
- Hover
- Disabled
- Focus
- Error
- Dirty
- Active

## Keyboard Guidelines

The IDS Radio doesn't contain any interactions beyond a standard radio input element:

- <kbd>Tab</kbd> and <kbd>Shift Tab</kbd> moves focus into the edit field to/from the next focusable item in the tab order.
- <kbd>Space</kbd> toggle the checked/unchecked state.

## Responsive Guidelines

- Default display set vertical but can also use the  `horizontal` attribute as true for some cases.

## Converting from Previous Versions

### Converting from 4.x

The IDS Radio component is now a WebComponent. Instead of using classes to define, it is done directly via the web component.

```html
<!-- 4.x radio example -->
<div class="field">
  <input type="radio" class="radio" name="options" value="opt1" id="option1" />
  <label for="option1" class="radio-label">Option one</label>
</div>

<!-- This is the same radio using a WebComponent -->
<ids-radio value="opt1" label="Option one"></ids-radio>
```
