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

Set the input to clearbale and add a clear button:

```html
<ids-input label="Clearable" clearable="true"></ids-input>
```

Set the Auto Select to Text Input this way:

```html
<ids-input label="Autoselect" value="Text select on focus" autoselect="true"></ids-input>
```

Set the Text Align to Text Input this way:

```html
<ids-input label="Default align (left)" value="Default align"></ids-input>
<ids-input label="Left align" value="Left align" text-align="left"></ids-input>
<ids-input label="Center align" value="Center align" text-align="center"></ids-input>
<ids-input label="Right align" value="Right align" text-align="right"></ids-input>
```

## Attributes and Properties

- `autoselect` {boolean} set auto select text on focus to input.
- `bgTransparent` {boolean} set the transparent background to readonly input.
- `clearable` {boolean} set (x) button to clear text on click/key to input.
- `clearableForced` {boolean} set (x) button to clear text on click/key to input, forced to be on readonly.
- `dirty-tracker` {boolean} set dirty tracker to input.
- `disabled` {boolean} set disabled state.
- `label` {string} set the label text.
- `mask` {array|function} defines how to mask the input.  See [Ids Mask Mixin](../ids-mask/README.md) for more information.
- `placeholder` {string} set the placeholder text to input.
- `size` {string} set the input size, it will set `md` as defaults.
- `readonly` {boolean} set readonly state.
- `text-align` {string} set text-align to input, it will set `left` as defaults.
- `triggerfield` {boolean} if true will add css class/style `has-triggerfield`.
- `type` {string} set the input type, it will set `text` as defaults.
- `validate` {string} set the input validation rules, use `space` to add multiple validation rules.
- `validationEvents` {string} set the input validation events, use `space` to add multiple validation rules, it will set `blur` as defaults.
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
