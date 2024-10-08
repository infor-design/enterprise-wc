# ids-switch

## Description

The IDS Switch component is a simple wrapper around a standard HTMLInputElement that is styled with Infor branding. A switch component is essentially a specially-styled [checkbox component](../ids-checkbox/README.md). Consider using a checkbox for most form layouts; Switch is primarily for settings.

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

Switch with the label positioned at the start and sized to fit the full width of the container:

```html
<ids-switch label="Show component" label-position="start" size="full"></ids-switch>
```

## Settings (Attributes)

- `checked` {boolean} set checked state.
- `disabled` {boolean} set disabled state.
- `label` {string} set the label text.
- `label-position` {'start'|'end'} set the position of the label on either the right or left side of the slider. Default is 'end'
- `value` {string} set the form submit value (not to be confused with checked, it only sets the form value)
- `size` {'xs'|'sm'|'mm'|'md'|'lg'|'full'} set the size (width) of the field

## Keyboard Guidelines

The IDS Switch doesn't contain any interactions beyond a standard Checkbox HTMLInputElement:

- <kbd>Tab</kbd> and <kbd>Shift Tab</kbd> moves focus into the switch to/from the next focusable item in the tab order.
- <kbd>Space</kbd> toggle the checked/unchecked state.

## Converting from Previous Versions (Breaking Changes)

**3.x to 4.x**

- Switch was implemented in v4.0.0
- Switch can be invoked with `$('#my-element').switch()`.

**4.x to 5.x**

- Markup has changed to a custom element `<ids-switch></ids-switch>`
- If using events, events are now plain JS events.
- Can now be imported as a single JS file and used with encapsulated styles
