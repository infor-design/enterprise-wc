# Ids Textarea Component

## Description

The IDS Textarea component is a simple wrapper around a standard HTMLTextareaElement that is styled with Infor branding, and contains some additional API that makes it easy to set textarea, label, and functionality.

## Use Cases

- Create a standalone textarea
- Create a textarea, with different styling to provide context for actions that are disabled, readonly, and various sizes, types.

## Terminology

- Textarea: A standard basic textarea element. It can set to various types, size, and functionality. IDS Textarea will add `aria-required` for required elements.
- Label: HTMLLabelElement to keep matching with HTMLTextareaElement. Make sure the textarea label has a meaningful relative to textarea. IDS Textarea will add sudo ui `*` for required elements.

## Features (With Code Samples)

A standard Text Textarea is a basic textarea element:

```html
<ids-textarea label="Basic"></ids-textarea>
```

Sets textarea as Disabled:

```html
<ids-textarea label="Disabled" disabled="true"></ids-textarea>
```

Add an Readonly to Textarea this way:

```html
<ids-textarea label="Readonly" readonly="true"></ids-textarea>
```

Set the Auto Select text to Textarea this way:

```html
<ids-textarea label="Autoselect" autoselect="true">Text select on focus</ids-textarea>
```

Set validation `required` to Textarea this way:

```html
<ids-textarea label="Required" validate="required"></ids-textarea>
```

Set the Dirty Tracking to Textarea this way:

```html
<ids-textarea label="Dirty Tracking" dirty-tracker="true"></ids-textarea>
```

Set the Resizable to Textarea this way:

```html
<ids-textarea label="Resizable" resizable="true"></ids-textarea>
```

Set the Max Length to Textarea this way:

```html
<ids-textarea label="Max Length" maxlength="90">Line One</ids-textarea>
```

Set the Max Length and Custom Text to Textarea this way:

```html
<ids-textarea label="Max Length (Custom Text)" maxlength="90" char-max-text="This text cannot exceed {0} characters." char-remaining-text="You can type {0} more characters.">Line One</ids-textarea>
```

Set the Auto Grow to Textarea this way:

```html
<ids-textarea label="Auto Grow" autogrow="true"></ids-textarea>
```

Set the Auto Grow and Max Height to Textarea this way:

```html
<ids-textarea label="Auto Grow (Max Height)" autogrow="true" autogrow-max-height="200"></ids-textarea>
```

Set the Rows to Textarea this way:

```html
<ids-textarea label="Rows" rows="15">Line One</ids-textarea>
```

Set the Text Align to Text Textarea this way:

```html
<ids-textarea label="Default align (left)">Default align</ids-textarea>
<ids-textarea label="Left align" text-align="left">Left align</ids-textarea>
<ids-textarea label="Center align" text-align="center">Center align</ids-textarea>
<ids-textarea label="Right align" text-align="right">Right align</ids-textarea>
```

Set the sizes, available sizes are `'sm'|'md'|'lg'|'full'` and default type is `size="md"`.

```html
<ids-textarea label="Full" size="full"></ids-textarea>
```

Set the sizes, available sizes are `'sm'|'md'|'lg'|'full'` and default type is `size="md"`.

```html
<ids-textarea label="Placeholder" placeholder="Type your notes here...">></ids-textarea>
```

## Settings (Attributes)

- `autogrow` {boolean} set automatically expand to fit the contents when typing.
- `autogrowMaxHeight` {number|string} set max height of the textarea when autogrow is enabled.
- `autoselect` {boolean} set auto select text on focus to textarea.
- `charMaxText` {string} set text that will be used in place of the `max` text.
- `charRemainingText` {string} set text that will be used in place of the `remaining` text.
- `characterCounter` {boolean} set a counter that counts down from the maximum character.
- `dirty-tracker` {boolean} set dirty tracker to textarea.
- `disabled` {boolean} set disabled state.
- `label` {string} set the label text.
- `labelRequired` {boolean} set the required indicator on label text.
- `maxlength` {number|string} set the maximum characters allowed in textarea.
- `placeholder` {string} set the placeholder text to textarea.
- `printable` {boolean} set whether or not the textarea can be displayed on a printed page.
- `size` {string} set the textarea size, it will set `md` as defaults.
- `readonly` {boolean} set readonly state.
- `resizable` {boolean} set to resize the height of the textarea.
- `rows` {number|string} set to visible height of a textarea in lines.
- `text-align` {string} set text-align to textarea, it will set `left` as defaults.
- `triggerfield` {boolean} if true will add css class/style `has-triggerfield`.
- `type` {string} set the textarea type, it will set `text` as defaults.
- `validate` {string} set the textarea validation rules, use `space` to add multiple validation rules.
- `validationEvents` {string} set the textarea validation events, use `space` to add multiple validation rules, it will set `blur` as defaults.
- `value` {string} set the textarea value.

## Themeable Parts

- `textarea` allows you to further style the textarea input element
- `label` allows you to further style the label text

## Keyboard Guidelines

The IDS Textarea doesn't contain any interactions beyond a standard HTMLTextareaElement:

- <kbd>Tab</kbd> and <kbd>Shift Tab</kbd> moves focus into the edit field to/from the next focusable item in the tab order.

## Responsive Guidelines

- Default size is 362px wide but there are a number of widths.

## Converting from Previous Versions

### Converting from 4.x

The IDS Textarea component is now a WebComponent. Instead of using classes to define the type, it is done directly:

```html
<!-- 4.x textarea example -->
<div class="field">
	<label for="textarea-desc">Description</label>
  <textarea class="textarea" id="textarea-desc" name="textarea-desc"></textarea>
</div>

<!-- this is the same textarea using the WebComponent -->
<ids-textarea label="Description" id="textarea-desc"></ids-textarea>

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
