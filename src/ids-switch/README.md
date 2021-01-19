# Ids Switch Component

## Description

The IDS Switch component is a simple wrapper around a standard HTMLInputElement that is styled with Infor branding. A switch component is essentially a specially-styled [checkbox component](./ids-checkbox). Consider using a checkbox for most form layouts; Switch is primarily for settings.

## Use Cases

- Create standalone switch
- Create switch, each with different styling to provide context for actions that are checked, unchecked, value and disabled.

## Terminology

*Checkbox*: IDS Switch checkbox is a standard basic checkbox element. It can set to checked, unchecked and disabled.
*Label*: HTMLLabelElement to keep matching with HTMLInputElement. Make sure the label has a meaningful relative.

## Features (With Code Samples)

A standard Switch unchecked element:

```html
<ids-switch label="Allow my profile to be searched"></ids-switch>
```

Set as checked, the Switch.

```html
<ids-switch label="Allow notifications" checked="true"></ids-switch>
```

Add an Disabled Switch as unchecked:

```html
<ids-switch label="Automatically approve requests" disabled="true"></ids-switch>
```

Add an Disabled Switch as checked:

```html
<ids-switch label="Allow connections" checked="true" disabled="true"></ids-switch>
```

## Attributes and Properties

- `checked` {boolean} set checked state.
- `disabled` {boolean} set disabled state.
- `label` {string} set the label text.
- `value` {string} set the switch value.

## Keyboard Guidelines

The IDS Switch doesn't contain any interactions beyond a standard Checkbox HTMLInputElement:

- <kbd>Tab</kbd> and <kbd>Shift Tab</kbd> moves focus into the switch to/from the next focusable item in the tab order.
- <kbd>Space</kbd> toggle the checked/unchecked state.

## Converting from Previous Versions

### Converting from 4.x

The IDS Switch component is now a WebComponent. Instead of using classes to define, it is done directly:

```html
<!-- 4.x switch example -->
<div class="switch">
  <input type="checkbox" checked="true" id="allow-notifications" class="switch" />
  <label for="allow-notifications">Allow notifications</label>
</div>

<!-- this is the same switch using the WebComponent -->
<ids-switch label="Allow notifications" checked="true"></ids-switch>
```
