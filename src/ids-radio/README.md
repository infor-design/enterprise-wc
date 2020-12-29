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

# Ids Radio Group Component

## Description

The IDS Radio Group component is a simple wrapper around list of IDS radio, and contains some additional API that makes it easy to set list of radio, label, and functionality.

## Use Cases

- Create standalone radio group
- Create list of radio, each with different styling to provide context for actions that are checked, unchecked, value, disabled and colored.

## Terminology

**List of IdsRadio:** A list of basic IdsRadio components. Each can set to checked, unchecked and disabled.

**Label:** HTMLLabelElement to keep matching with HTMLInputElement. Make sure the label has a meaningful relative. IDS Radio Group will add sudo ui `*` for required elements.

## Features (With Code Samples)

A standard Radio Group unchecked element:

```html
<ids-radio-group label="Select delivery method">
  <ids-radio value="opt1" label="Option one"></ids-radio>
  <ids-radio value="opt2" label="Option two"></ids-radio>
</ids-radio-group>
```

Set as Checked, the radio in Radio Group.

```html
<ids-radio-group label="Select delivery method">
  <ids-radio value="opt1" label="Option one" checked="true"></ids-radio>
  <ids-radio value="opt2" label="Option two"></ids-radio>
</ids-radio-group>
```

Set Radio Group as No label.

```html
<ids-radio-group>
  <ids-radio value="opt1" label="Option one"></ids-radio>
  <ids-radio value="opt2" label="Option two" checked="true"></ids-radio>
</ids-radio-group>
```

Set Radio Group Checked and Value

```html
<ids-radio-group label="Select delivery method" value="opt1">
  <ids-radio value="opt1" label="Option one"></ids-radio>
  <ids-radio value="opt2" label="Option two"></ids-radio>
</ids-radio-group>
```

Set the Dirty Tracking to Radio Group this way:

```html
<ids-radio-group label="Select delivery method" dirty-tracker="true">
  <ids-radio value="opt1" label="Option one"></ids-radio>
  <ids-radio value="opt2" label="Option two" checked="true"></ids-radio>
  <ids-radio value="opt3" label="Option three"></ids-radio>
</ids-radio-group>
```

Set Radio Group as Disabled Group (each radio will set to disabled):

```html
<ids-radio-group label="Select delivery method" disabled="true">
  <ids-radio value="opt1" label="Option one" checked="true"></ids-radio>
  <ids-radio value="opt2" label="Option two"></ids-radio>
</ids-radio-group>
```

Set Radio Group as Disabled Item:

```html
<ids-radio-group label="Select delivery method">
  <ids-radio value="opt1" label="Option one"></ids-radio>
  <ids-radio value="opt2" label="Option two" checked="true"></ids-radio>
  <ids-radio value="opt3" label="Option three" disabled="true"></ids-radio>
</ids-radio-group>
```

Set validation `required` to Radio Group this way:

```html
<ids-radio-group label="Select delivery method" validate="required" id="ids-radio-validation">
  <ids-radio value="opt1" label="Option one"></ids-radio>
  <ids-radio value="opt2" label="Option two"></ids-radio>
  <ids-radio value="opt3" label="Option three" disabled="true"></ids-radio>
</ids-radio-group>
<button id="btn-radio-validate">Validate</button>
```
Then can check validation with `JavaScript`

```javascript
document.querySelector('#btn-radio-validate').addEventListener('click', () => {
  const radio = document.querySelector('#ids-radio-validation');
  radio.checkValidation();
});
```

Set validation `required` to Radio Group without label required indicator:

```html
<ids-radio-group label="Select delivery method" label-required="false" validate="required">
  <ids-radio value="opt1" label="Option one"></ids-radio>
  <ids-radio value="opt2" label="Option two"></ids-radio>
</ids-radio-group>
```

Set Radio Group as Horizontal:

```html
<ids-radio-group label="Select delivery method" horizontal="true">
  <ids-radio value="opt1" label="Option one"></ids-radio>
  <ids-radio value="opt2" label="Option two" checked="true"></ids-radio>
</ids-radio-group>
```

## Attributes and Properties

- `dirty-tracker` {boolean} set dirty tracker.
- `disabled` {boolean} set disabled state.
- `horizontal` {boolean} set radio group layout inline as horizontal.
- `label` {string} set the label text.
- `label-font-size` {string|number} set the label font size.
- `label-required` {boolean} set validation `required` indicator, default is set to `true`.
- `validate` {string} set the validation rule `required`.
- `validation-events` {string} set the validation events, use `space` to add multiple default is set to `change`.
- `value` {string} set the radio group value, will set as checked the matching radio value in list.

## Keyboard Guidelines

The IDS Radio Group doesn't contain any interactions beyond a standard HTMLInputElement:

- <kbd>Tab</kbd> and <kbd>Shift Tab</kbd> moves focus into the edit field to/from the next focusable item in the tab order.
- <kbd>Space</kbd> toggle the checked/unchecked state.
- <kbd>ArrowDown</kbd>, <kbd>ArrowRight</kbd>, <kbd>ArrowUp</kbd>, <kbd>ArrowLeft</kbd>, roving in radio list, each key will move and set checked next in the list.

## Responsive Guidelines

- Default display set as `block`, but can change to `inline-block` by use of `horizontal` attribute as `true`.

## Converting from Previous Versions

### Converting from 4.x

The IDS Radio Group component is a WebComponent. Instead of using classes to define, it is done directly:

```html
<!-- 4.x radio group example -->
<fieldset class="radio-group">
  <legend>Select delivery method</legend>
  <input type="radio" class="radio" name="options" value="opt1" id="option1" />
  <label for="option1" class="radio-label">Option one</label>
  <br/>
  <input type="radio" class="radio" name="options" value="opt2" checked="true" id="option2" />
  <label for="option2"  class="radio-label">Option two</label>
  <br/>
  <input type="radio" class="radio" name="options" value="opt3" id="option3" />
  <label for="option3" class="radio-label">Option three</label>
  <br/>
  <input type="radio" class="radio" name="options" value="opt4" disabled="true" id="option4" />
  <label for="option4" class="radio-label">Option four</label>
</fieldset>


<!-- this is the same radio group using the WebComponent -->
<ids-radio-group label="Select delivery method">
  <ids-radio value="opt1" label="Option one"></ids-radio>
  <ids-radio value="opt2" label="Option two" checked="true"></ids-radio>
  <ids-radio value="opt3" label="Option three"></ids-radio>
  <ids-radio value="opt4" label="Option four" disabled="true"></ids-radio>
</ids-radio-group>
```
