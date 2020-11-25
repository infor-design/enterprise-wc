# Ids Input Component

## Description

The IDS Input component is a simple wrapper around a standard HTMLInputElement that is styled with Infor branding, and contains some additional API that makes it easy to set input, label, and functionality.

## Use Cases

- Create standalone inputs
- Create inputs, each with different styling to provide context for actions that are disabled, readonly, and various sizes, types.

## Terminology

- Input: A standard basic input element. It can set to various types, size, and functionality. IDS Input will add `aria-required` for required elements.
- Label: HTMLLabelElement to keep matching with HTMLInputElement. Make sure the input label has a meaningful relative to input. IDS Input will add sudo ui `*` for required elements.

## Features (With Code Samples)

A standard Text Input is a basic input element:

```html
<ids-input label="First Name"></ids-input>
```

Set the types, available types are `'text'|'password'|'number'|'email'` and default type is `type="text"`.

```html
<ids-input type="number" label="Xtra Small"></ids-input>
```

Set the sizes, available sizes are `'xs'|'sm'|'mm'|'md'|'lg'|'full'` and default type is `size="md"`.

```html
<ids-input size="xs" label="Xtra Small"></ids-input>
```

Add an Disabled Text Input this way:

```html
<ids-input label="Disabled" disabled="true"></ids-input>
```

Add an Readonly Text Input this way:

```html
<ids-input label="Readonly" readonly="true"></ids-input>
```

Set the Dirty Tracking to Text Input this way:

```html
<ids-input label="Dirty Tracking" dirty-tracker="true"></ids-input>
```

Set validation `required` to Text Input this way:

```html
<ids-input label="Last Name" validate="required"></ids-input>
```

## Attributes and Properties

- `dirty-tracker` {boolean} set dirty tracker to input.
- `disabled` {boolean} set disabled state.
- `label` {string} set the label text.
- `label-font-size` {string|number} set the label font size.
- `name` {string} set the name text to input.
- `placeholder` {string} set the placeholder text to input.
- `size` {string} set the input size, it will set `md` as defaults.
- `readonly` {boolean} set readonly state.
- `type` {string} set the input type, it will set `text` as defaults.
- `validate` {string} set the input validation rules, use `space` to add multiple validation rules.
- `value` {string} set the input value.

## Keyboard Guidelines

The IDS Input doesn't contain any interactions beyond a standard HTMLInputElement:

- <kbd>Tab</kbd> and <kbd>Shift Tab</kbd> moves focus into the edit field to/from the next focusable item in the tab order.

## Responsive Guidelines

- Default size is 300px wide but there are a number of widths.

## Converting from Previous Versions

### Converting from 4.x

The IDS Input component is now a WebComponent. Instead of using classes to define the type, it is done directly with a "type" attribute:

```html
<!-- 4.x input example -->
<div class="field">
  <label class="required" for="last-name">Last Name</label>
  <input type="text" id="last-name" aria-required="true" name="last-name" data-validate="required"/>
</div>

<!-- this is the same input using the WebComponent -->
<ids-input label="Last Name" id="last-name" name="last-name" validate="required"></ids-input>

```

## Designs

## Alternate Designs

## Proposed Changes

## Test Plan

1. Accessibility - Axe
1. Visual Regression Test
1. Repeat Tests in All Supported Browsers
1. Some of these as test cases from the [WC gold standard](https://github.com/webcomponents/gold-standard/wiki#api)
1. Can be consumed in NG/Vue/React (pull it in standalone/built see it works standalone)

## Accessibility Guidelines

## Regional Considerations
