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

Set the types, available types are `'text'|'password'|'email'|'color'` and default type is `type="text"`.

```html
<ids-input type="password" label="Xtra Small"></ids-input>
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

Set the Dirty Tracking to Text Input this way. You can also call `resetDirtyTracker()` to reset the dirty tracking icon:

```html
<ids-input label="Dirty Tracking" dirty-tracker="true"></ids-input>
```

Set validation `required` to Text Input this way:

```html
<ids-input label="Last Name" validate="required"></ids-input>
```

Set the input to clearable and add a clear button:

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
<ids-input label="Left align" value="Left align" text-align="start"></ids-input>
<ids-input label="Center align" value="Center align" text-align="center"></ids-input>
<ids-input label="Right align" value="Right align" text-align="end"></ids-input>
```

Set the caps lock alert indicator this way:

```html
<ids-input label="password" caps-lock="true" type="password"></ids-input>
```

Set up for displaying the show/hide password button:

```html
<ids-input label="password" revealable-text="true" password-visible="false" type="password"></ids-input>
```

Set up for autocomplete input

```html
  <ids-input
    id="input-autocomplete"
    placeholder="This input's label is visible"
    size="md"
    label="Autocomplete Input"
    autocomplete
    search-field="label"
  >
  </ids-input>
```

```js
import statesJSON from '../../../assets/data/states.json';

const input: any = document.querySelector('#input-autocomplete');
const url: any = statesJSON;

const setData = async () => {
  const res = await fetch(url);
  const data = await res.json();
  input.data = data;
};

setData();
```

## Settings (Attributes)

- `autocomplete` can be set to true to enable autocomplete functionality.
- `autoselect` {boolean} set auto select text on focus to input.
- `bgTransparent` {boolean} set the transparent background to readonly input.
- `clearable` {boolean} set (x) button to clear text on click/key to input. See [Ids Clearable Mixin](../../mixins/ids-clearable-mixin/README.md) for more information.
- `clearableForced` {boolean} set (x) button to clear text on click/key to input, forced to be on readonly.
- `colorVariant` {string} set the current color variant.
- `compact` {boolean} sets the component to be compact mode.
- `caps-lock` {boolean} sets whether the   indicator appears when caps lock is on.
- `data` when autocomplete is enabled an instance of [IdsDatasource](../../core/README.md)]
- `dirty-tracker` {boolean} set dirty tracker to input. See [Ids Dirty Tracker Mixin](../../mixins/ids-dirty-tracker-mixin/README.md) for more information.
- `disabled` {boolean} set disabled state.
- `fieldHeight` {string} defines the height of the input field. See [Ids Field Height Mixin](../../mixins/ids-field-height-mixin/README.md) for more information.
- `label` {string} set the label text.
- `labelState` {string} indicates that a label is hidden (note that for accessibility reasons, `label` should still be specified). See [Ids Label State Mixin](../../mixins/ids-label-state-mixin/README.md) for more information.
- `mask` {array|function} defines how to mask the input.  See [Ids Mask Mixin](../ids-mask/README.md) for more information.
- `noMargins` {boolean} sets whether or not no-margins around the component.
- `password-visible` {boolean} sets whether the password is currently visible must be paired with revealable-text = 'true' and type = 'password'.
- `placeholder` {string} set the placeholder text to input.
- `size` {string} set the input size, it will set `md` as defaults.
- `search-field` when autocomplete is enabled can be set to a string of the field to be searched in the dataset.
- `revealable-text` {boolean} sets whether the show/hide button is available for password fields must be paired with type='password'
- `readonly` {boolean} sets the input's readonly state.
- `text-align` {string} sets the text alignment (default is `left`).
- `type` {string} set the input type, (default is `text`)
- `validate` {string} sets the input validation rules, use `space` to add multiple validation rules.
- `format` {string} if the validation rules include date/time, use the setting to set custom date/time format
- `validationEvents` {string} set the input validation events, use `space` to add multiple validation rules, it will set `blur` as defaults.
- `value` {string} sets the input value.
- `maxlength` {number}  sets the input's `maxlength` property to the max characters you can type
- `uppercase` {boolean} sets the input editor's to all uppercase

## Keyboard Guidelines

The IDS Input doesn't contain any interactions beyond a standard HTMLInputElement:

- <kbd>Tab</kbd> and <kbd>Shift Tab</kbd> moves focus into the edit field to/from the next focusable item in the tab order.

## Responsive Guidelines

- Default size is 300px wide but there are a number of widths.

## Converting from Previous Versions (Breaking Changes)

**3.x to 4.x**

- Block grid / Image List partially replaces the carousel in 3.x

**4.x to 5.x**

- The Input component has been changed to a web component and renamed to ids-input.
- Markup has changed to a custom element `<ids-input></ids-input>` (see examples above)
- Actions next to the input is deprecated, if needed you can code it with a button, popupmenu and input
- If using events, events are now plain JS events (custom events)
- Can now be imported as a single JS file and used with encapsulated styles
- Can now be use variation of sizes (width/height)
- If using a clearable X on the input the x is now tabbable by default for accessibility

Markup comparison:

```html
<!-- 4.x input example -->
<div class="field">
  <label class="required" for="last-name">Last Name</label>
  <input type="text" id="last-name" aria-required="true" name="last-name" data-validate="required"/>
</div>

<!-- this is the same input using the WebComponent -->
<ids-input label="Last Name" id="last-name" name="last-name" validate="required"></ids-input>
```

## Accessibility Guidelines

There should be a label on all inputs to give an indication what the field is containing.
