# Ids Radio Component

## Description

The IDS Radio component is a simple wrapper around a standard HTMLInputElement that is styled with Infor branding, and contains some additional API that makes it easy to set radio, label, and functionality.

## Use Cases

- Create standalone radio button
- Create radio button, each with different styling to provide context for actions that are checked, unchecked, value, disabled and colored.
- Use with IDS Radio Group

## Terminology

**RadioButton:** A standard basic radio button element. It can set to checked, unchecked and disabled.

**Label:** HTMLLabelElement to keep matching with HTMLInputElement. Make sure the label has a meaningful relative.

## Features (With Code Samples)

A standard Radio unchecked element:

```html
<ids-radio value="opt1" label="Option one"></ids-radio>
```

Set as Checked, the Radio.

```html
<ids-radio value="opt1" label="Option one" checked="true"></ids-radio>
```

Add an Disabled Radio as unchecked:

```html
<ids-radio value="opt1" label="Option one" disabled="true"></ids-radio>
```

Add an Disabled Radio as checked:

```html
<ids-radio value="opt1" label="Option one" checked="true" disabled="true"></ids-radio>
```

Add an Colored checked:

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

## Keyboard Guidelines

The IDS Radio doesn't contain any interactions beyond a standard HTMLInputElement:

- <kbd>Tab</kbd> and <kbd>Shift Tab</kbd> moves focus into the edit field to/from the next focusable item in the tab order.
- <kbd>Space</kbd> toggle the checked/unchecked state.

## Responsive Guidelines

- Default display set as `block`, but can change to `inline-block` by use of `horizontal` attribute as `true`.

## Converting from Previous Versions

### Converting from 4.x

The IDS Radio component is now a WebComponent. Instead of using classes to define, it is done directly:

```html
<!-- 4.x radio example -->
<div class="field">
  <input type="radio" class="radio" name="options" value="opt1" id="option1" />
  <label for="option1" class="radio-label">Option one</label>
</div>

<!-- this is the same radio using the WebComponent -->
<ids-radio value="opt1" label="Option one"></ids-radio>
```

## Test Plan

1. Accessibility - Axe
2. Visual Regression Test
3. Repeat Tests in All Supported Browsers
4. Some of these as test cases from the [WC gold standard](https://github.com/webcomponents/gold-standard/wiki#api)
5. Can be consumed in NG/Vue/React (pull it in standalone/built see it works standalone)
