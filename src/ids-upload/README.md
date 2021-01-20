# Ids Upload Component

## Description

A form element that allows users to choose a file they want to upload. A user can prompt a system menu to select one or more file to upload.

## Use Cases

- Create standalone file upload.

## Terminology

**Input Type File:** A standard basic input element with type as file.
**Label**: HTMLLabelElement to keep matching with HTMLInputElement. Make sure the label has a meaningful relative.

## Features (With Code Samples)

A standard Upload element:

```html
<ids-upload label="Upload a File"></ids-upload>
```

Set as Multiple Files, the Upload.

```html
<ids-upload label="Multiple Files" multiple="true"></ids-upload>
```

Limit file type to be upload.

```html
<ids-upload label="Upload a File Accept (.cvs,.xls,.xlsx)" accept=".cvs,.xls,.xlsx"></ids-upload>
```

Set as Readonly the Upload.

```html
<ids-upload label="Readonly" readonly="true"></ids-upload>
```

Set as Disabled the Upload.

```html
<ids-upload label="Disabled" disabled="true"></ids-upload>
```

Set Upload Dirty Tracker.

```html
<ids-upload label="Dirty Tracker" dirty-tracker="true"></ids-upload>
```

Set Upload as Required.

```html
<ids-upload label="Required" validate="required"></ids-upload>
```

## Attributes and Properties

- `accept` {string} set the limit to file types;
- `dirty-tracker` {boolean} set dirty tracker to input.
- `disabled` {boolean} set disabled state.
- `label` {string} set the label text.
- `labelFiletype` {string} set the label text for input file type.
- `multiple` {boolean} set file to be as multiple uploads.
- `noTextEllipsis` {boolean} set ellipsis to be not shown.
- `placeholder` {string} set the placeholder text to input.
- `size` {string} set the input size, it will set `md` as defaults.
- `readonly` {boolean} set readonly state.
- `triggerLabel` {string} set the label text for trigger button.
- `validate` {string} set the input validation rules, use `space` to add multiple validation rules.
- `validationEvents` {string} set the input validation events, use `space` to add multiple validation rules, it will set `blur change` as defaults.
- `value` {string} set the input value.

## Keyboard Guidelines

The IDS Upload doesn't contain any interactions beyond a standard file upload HTMLInputElement:

- <kbd>Tab</kbd> and <kbd>Shift Tab</kbd> moves focus into the input field to/from the next focusable item in the tab order.
- <kbd>Enter</kbd>, <kbd>Space</kbd> Open the file upload dialog box.
- <kbd>Backspace</kbd> Clear the selected value.

## Converting from Previous Versions

### Converting from 4.x

The IDS Upload component is now a WebComponent. Instead of using classes to define, it is done directly:

```html
<!-- 4.x fileupload example -->
<div class="field">
  <label for="fileupload">Upload a File</label>
  <input type="file" class="fileupload" id="fileupload" name="fileupload"/>
</div>

<!-- this is the same using the WebComponent -->
<ids-upload label="Upload a File"></ids-upload>
```
