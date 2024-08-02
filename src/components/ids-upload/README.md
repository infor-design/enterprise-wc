# ids-upload

## Description

A form element that allows users to choose a file they want to upload. A user can prompt a system menu to select one or more file to upload.

## Use Cases

- Used for allowing users to select files from a local system to be uploaded to a server or application.

## Terminology

**Input Type File:** A standard basic input element with type as file.
**Label:** HTMLLabelElement to keep matching with HTMLInputElement. Make sure the label has a meaningful relative.
**Drag and Drop:** File/s can be drag from finder/explorer window and drop into upload field.

## Features (With Code Samples)

A standard single upload field:

```html
<ids-upload label="Upload a File"></ids-upload>
```

A field that allows multiple files to be uploaded

```html
<ids-upload label="Multiple Files" multiple="true"></ids-upload>
```

Option to limit the file types to be uploaded

```html
<ids-upload label="Upload a File (.cvs,.xls,.xlsx)" accept=".cvs,.xls,.xlsx"></ids-upload>
```

Readonly upload field

```html
<ids-upload label="Readonly" readonly="true"></ids-upload>
```

Disabled upload field

```html
<ids-upload label="Disabled" disabled="true"></ids-upload>
```

Upload field with dirty tracker

```html
<ids-upload label="Dirty Tracker" dirty-tracker="true"></ids-upload>
```

Upload field with required validation

```html
<ids-upload label="Required" validate="required"></ids-upload>
```

Upload field as tabbable

```html
<ids-upload label="Tabbable" tabbable="true"></ids-upload>
```

Upload field with hidden label state

```html
<ids-upload label="Label State (hidden)" label-state="hidden"></ids-upload>
```

Upload field with collapsed label state

```html
<ids-upload label="Label State (collapsed)" label-state="collapsed"></ids-upload>
```

Upload field as compact mode

```html
<ids-upload label="Compact" compact="true"></ids-upload>
```

Upload field with types of field heights

```html
<ids-upload field-height="xs" label="Extra Small (compact)"></ids-upload>
<ids-upload field-height="sm" label="Small"></ids-upload>
<ids-upload field-height="md" label="Medium (default)"></ids-upload>
<ids-upload field-height="lg" label="Large"></ids-upload>
```

Upload field with types of sizes

```html
<ids-upload size="xs" label="Extra Small"></ids-upload>
<ids-upload size="sm" label="Small"></ids-upload>
<ids-upload size="mm" label="Small - Medium"></ids-upload>
<ids-upload size="md" label="Medium (default)"></ids-upload>
<ids-upload size="lg" label="Large"></ids-upload>
<ids-upload size="full" label="Full"></ids-upload>
```

## Settings (Attributes)

- `accept` {string} sets limit the file types to be uploaded.
- `colorVariant` {string} set the current color variant.
- `compact` {boolean} sets the component to be compact mode.
- `dirty-tracker` {boolean} sets the dirty tracking feature on to indicate a changed field. See [Ids Dirty Tracker Mixin](https://github.com/infor-design/enterprise-wc/blob/main/src/mixins/ids-dirty-tracker-mixin/README.md) for more information.
- `disabled` {boolean} sets to disabled state.
- `fieldHeight` {string} defines the field height. See [Ids Field Height Mixin](https://github.com/infor-design/enterprise-wc/blob/main/src/mixins/ids-field-height-mixin/README.md) for more information.
- `label` {string} sets the label text for text input.
- `labelFiletype` {string} sets the label text for file input.
- `language` {string} Sets the language for RTL and inner labels
- `labelRequired` {boolean} Sets the validation required indicator on label text, it's default to `true`
- `labelState` {string} indicates that a label is hidden (note that for accessibility reasons, `label` should still
- `multiple` {boolean} sets to allows multiple files to be uploaded.
- `noMargins` {boolean} sets whether or not no-margins around the component.
- `textEllipsis` {boolean} sets ellipsis to be shown on text input.
- `placeholder` {string} sets the input placeholder text.
- `size` {'sm '|'md'|'lg'|'full'|string} sets the size (width) of input, it will set `md` as defaults.
- `readonly` {boolean} sets to readonly state.
- `triggerLabel` {string} sets the label text for trigger button.
- `validate` {string} sets text input validation rules, use `space` to add multiple validation rules.
- `validationEvents` {string} sets text input validation events, use `space` to add multiple validation rules, it will set `blur change` as defaults.
- `value` {string} sets text input value.

## Keyboard Guidelines

- <kbd>Tab</kbd> and <kbd>Shift Tab</kbd> moves focus into the input field to/from the next focusable item in the tab order.
- <kbd>Enter</kbd>, <kbd>Space</kbd> Open the file upload dialog box.
- <kbd>Backspace</kbd> Clear the selected value.

## Converting from Previous Versions (Breaking Changes)

**3.x to 4.x**

- Replace any calls to `inforFileField()` with `.fileupload()`
- Replace class `inforLabel` with `label`
- Replace class `inforFileField` with `fileupload`
- Make sure the `<label>` wraps the `<input>` element

**4.x to 5.x**

- Markup has changed to a custom element `<ids-upload></ids-upload>`
- If using events, events are now plain JS events.
- Can now be imported as a single JS file and used with encapsulated styles
- Shows percent progress on file

```html
<!-- 4.x fileupload example -->
<div class="field">
  <label for="fileupload">Upload a File</label>
  <input type="file" class="fileupload" id="fileupload" name="fileupload"/>
</div>

<!-- this is the same using the WebComponent -->
<ids-upload label="Upload a File"></ids-upload>
```
