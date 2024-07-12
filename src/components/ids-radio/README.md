# ids-radio

## Description

The ids-radio is a Web Component wrapper around a standard `<input type="radio">`, while the ids-radio-group is a wrapper around a list of radio buttons. They each include API for setting states, groups, labels, and more. See more [usage details](https://design.infor.com/components/components/radios).

## Terminology

- **Radio Button:** A standard basic radio button element. It can be set to checked, unchecked and disabled.
- **Label:** An `HTMLLabelElement` to keep matching with `HTMLInputElement`. The IDS Radio Group will add a pseudo UI `*` for required elements.

## Features (With Code Samples)

### Radios

A standard unchecked radio button:

```html
<ids-radio value="opt1" label="Option one"></ids-radio>
```

Set a `checked` radio:

```html
<ids-radio value="opt1" label="Option one" checked="true"></ids-radio>
```

Add an unchecked, `disabled` radio:

```html
<ids-radio value="opt1" label="Option one" disabled="true"></ids-radio>
```

Add a `checked`, `disabled` radio:

```html
<ids-radio value="opt1" label="Option one" checked="true" disabled="true"></ids-radio>
```
### Radio Groups

A standard unchecked radio group element:

```html
<ids-radio-group label="Select delivery method">
  <ids-radio value="opt1" label="Option one"></ids-radio>
  <ids-radio value="opt2" label="Option two"></ids-radio>
</ids-radio-group>
```

Set a `checked` radio within a radio group.

```html
<ids-radio-group label="Select delivery method">
  <ids-radio value="opt1" label="Option one" checked="true"></ids-radio>
  <ids-radio value="opt2" label="Option two"></ids-radio>
</ids-radio-group>
```

Set a radio group without a label.

```html
<ids-radio-group>
  <ids-radio value="opt1" label="Option one"></ids-radio>
  <ids-radio value="opt2" label="Option two" checked="true"></ids-radio>
</ids-radio-group>
```

Set the value and the radio group to `checked`:

```html
<ids-radio-group label="Select delivery method" value="opt1">
  <ids-radio value="opt1" label="Option one"></ids-radio>
  <ids-radio value="opt2" label="Option two"></ids-radio>
</ids-radio-group>
```

Set a radio group as `disabled`, which disables all radios within:

```html
<ids-radio-group label="Select delivery method" disabled="true">
  <ids-radio value="opt1" label="Option one" checked="true"></ids-radio>
  <ids-radio value="opt2" label="Option two"></ids-radio>
</ids-radio-group>
```

Set a `disabled` item within the radio group:

```html
<ids-radio-group label="Select delivery method">
  <ids-radio value="opt1" label="Option one"></ids-radio>
  <ids-radio value="opt2" label="Option two" checked="true"></ids-radio>
  <ids-radio value="opt3" label="Option three" disabled="true"></ids-radio>
</ids-radio-group>
```

Set validation `required` to radio group:

```html
<ids-radio-group label="Select delivery method" validate="required" id="ids-radio-validation">
  <ids-radio value="opt1" label="Option one"></ids-radio>
  <ids-radio value="opt2" label="Option two"></ids-radio>
  <ids-radio value="opt3" label="Option three" disabled="true"></ids-radio>
</ids-radio-group>
<button id="btn-radio-validate">Validate</button>
```

You can also check validation with the JS API.

```javascript
document.querySelector('#btn-radio-validate').addEventListener('click', () => {
  const radio = document.querySelector('#ids-radio-validation');
  radio.checkValidation();
});
```

Set validation `required` to radio group without label required indicator:

```html
<ids-radio-group label="Select delivery method" label-required="false" validate="required">
  <ids-radio value="opt1" label="Option one"></ids-radio>
  <ids-radio value="opt2" label="Option two"></ids-radio>
</ids-radio-group>
```

Set the radio group as `horizontal`:

```html
<ids-radio-group label="Select delivery method" horizontal="true">
  <ids-radio value="opt1" label="Option one"></ids-radio>
  <ids-radio value="opt2" label="Option two" checked="true"></ids-radio>
</ids-radio-group>
```

## Settings (Attributes)

### Radios

- `checked` {boolean} Sets the checked state.
- `disabled` {boolean} Sets the disabled state.
- `group-disabled` {boolean} Sets disabled state, if group disabled.
- `horizontal` {boolean} Sets the radio layout inline as horizontal.
- `label` {string} Sets the label text.
- `validation-has-error` {boolean} Sets the validation error state.
- `value` {string} Sets the radio value.

### Radio Groups

- `disabled` {boolean} Sets the disabled state.
- `horizontal` {boolean} Set radio group layout inline as horizontal.
- `label` {string} Sets the label text.
- `label-required` {boolean} Set validation `required` indicator, default is set to `true`.
- `validate` {string} Set the validation rule `required`.
- `validation-events` {string} Sets the validation events. Use `space` to add multiple. Defaults to `change`.
- `value` {string} Sets the radio group value, will set as checked the matching radio value in list.

## Themeable Parts

- `radio` allows you to further style the actual radio input element
- `circle` allows you to further style the visible circle element
- `label` allows you to further style the label text element

## States and Variations

- Unchecked
- Checked/Selected
- Hover
- Disabled
- Focus
- Error
- Dirty (Not supported on this component)
- Active

## Responsive Guidelines

- The default display is set to vertical, but you can use the `horizontal` attribute set to `true` for horizontal layout.
- The default display is set as `block`, but you can change it to `inline-block` by setting the `horizontal` attribute to `true`.

## Converting from Previous Versions (Breaking Changes)

**3.x to 4.x**

- Radio button styles were implemented in 4.0.0
- Radio buttons were CSS-only components

**4.x to 5.x**

- Radio component has changed to a custom element `<ids-radio-group></ids-radio-group>`
- Individual radio buttons are standalone custom elements `<ids-radio></ids-radio>` and are slotted into groups
- If using events, events are now plain JS events.
- Can now be imported as a single JS file and used with encapsulated styles

### Converting from 4.x

Radio Buttons are now standalone web components instead of being defined only with CSS styles:

```html
<!-- 4.x radio example -->
<div class="field">
  <input type="radio" class="radio" name="options" value="opt1" id="option1" />
  <label for="option1" class="radio-label">Option one</label>
</div>

<!-- This is the same radio using a WebComponent -->
<ids-radio value="opt1" label="Option one"></ids-radio>
```

The same rules apply to Radio Groups, which are also now standalone web components:

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
