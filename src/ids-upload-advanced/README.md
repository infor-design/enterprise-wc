# Ids Upload Advanced Component

## Description

The IDS Upload Advanced component is a web component that contains an API that makes it easy to set functionality such as limit the file types, max file size, max number of files to be uploaded. It shows currently uploading files with a progress indicator. It aso contains functionality to display the file status, error, progress and other functionality.

## Use Cases

- Upload files to a server with drag and drop or use browse file link to select a file
- Displays the progress of the file upload process
- Allows to aborted uploading files and manage upload files

## Terminology

**Drop Area:** An html element that display as drag and drop files target area.
**Browse File Link:** A link to open the browse file window in lieu of drag drop

## Features (With Code Samples)

A standard upload advanced element:

```html
<ids-upload-advanced></ids-upload-advanced>
```

Set the whole upload advanced element to disabled. Note that making the component `disabled` while currently in the process of uploading, will not stop uploading.

```html
<ids-upload-advanced disabled="true"></ids-upload-advanced>
```

Set to hide the browse link:

```html
<ids-upload-advanced show-browse-link="false"></ids-upload-advanced>
```

Set custom icon in main drop area:

```html
<ids-upload-advanced icon="upload-adv"></ids-upload-advanced>
```

Add limit the file types (.png, .jpg):

```html
<ids-upload-advanced accept=".png, .jpg"></ids-upload-advanced>
```

Set max file size (in bytes), can be uploaded. An error will bew shown if the file is over the limit.

```html
<ids-upload-advanced max-file-size="2097152"></ids-upload-advanced>
```

Set max number of files in total, that can be uploaded:

```html
<ids-upload-advanced max-files="5"></ids-upload-advanced>
```

Set max files can be in process uploading at one time.

```html
<ids-upload-advanced max-files-in-process="2"></ids-upload-advanced>
```

Set custom param name, that might be used to read data from a server API.

```html
<ids-upload-advanced param-name="someCustomParamName"></ids-upload-advanced>
```

Set the custom text strings using the named slots.

```html
<ids-upload-advanced>
  <span slot="text-btn-cancel">Cancel</span>
  <span slot="text-btn-close-error">Close</span>
  <span slot="text-btn-remove">Remove</span>
  <span slot="text-droparea">Drag and Drop Here</span>
  <span slot="text-droparea-with-browse">Drag/Drop here or Click {browseLink} to Browse.</span>
  <span slot="text-droparea-with-browse-link">here</span>
  <span slot="text-progress-label">{percent}% ({loaded}) loaded form total {size} - {file-name}</span>
</ids-upload-advanced>
```

Set the custom error strings this way:

```html
<ids-upload-advanced accept=".png" max-files="5" max-files-in-process="2" max-file-size="1000000">
  <span slot="error-max-files">Max files error</span>
  <span slot="error-max-files-in-process">Max files in process error</span>
  <span slot="error-accept-file-type">Limit file types error</span>
  <span slot="error-max-file-size">Max file size error</span>
  <span slot="error-url">Required URL error</span>
  <span slot="error-xhr-headers">XHRHeaders error</span>
</ids-upload-advanced>
```

Set extra headers to send with XHR, when use component `XMLHttpRequest` to send files. XHR Headers must be a valid JSON string contains array of name/value objects.

```html
<ids-upload-advanced>
  <span slot="xhr-headers">[{ "name": "header1", "value": "header1-value" }]</span>
</ids-upload-advanced>
```

Set the url to use component `XMLHttpRequest` to send files:

```html
<ids-upload-advanced url="http://somedomain.com/upload"></ids-upload-advanced>
```

Set the method, when use component `XMLHttpRequest` method to send files. The default is set `POST`, it can be set to `PUT`.

```html
<ids-upload-advanced method="PUT"></ids-upload-advanced>
```

You can also set the custom `Send()` method with the JS api.

```html
<ids-upload-advanced id="some-id"></ids-upload-advanced>
```

```javascript
// Custom send method
function customSendMethodXhr(formData, uiElem) {
  const xhr = new XMLHttpRequest();
  // attach ui method to set updates
  xhr.upload.addEventListener('progress', uiElem.progressHandler.bind(uiElem), false);
  xhr.addEventListener('load', uiElem.completeHandler.bind(uiElem), false);
  xhr.addEventListener('error', uiElem.errorHandler.bind(uiElem), false);
  xhr.addEventListener('abort', uiElem.abortHandler.bind(uiElem), false);

  xhr.open('POST', 'http://somedomain/upload'); // Using post method
  xhr.send(formData);

  // File abort
  uiElem?.addEventListener('abort', () => {
    xhr.abort();
  });
}

// Attach this custom send method, to upload element.
document.addEventListener('DOMContentLoaded', () => {
  const uploadEl = document.querySelector('#some-id');
  uploadEl.send = customSendMethodXhr;
});
```

## Attributes and Properties

### IDS Upload Advanced attributes and properties

- `accept` {string} sets a limit on the file types that can be uploaded.
- `disabled` {boolean|string} sets the whole upload advanced element to disabled.
- `icon` {string} sets the icon to be use in main drop area.
- `max-file-size` {number|string} sets the max file size in bytes.
- `max-files` {number|string} sets the max number of files can be uploaded.
- `max-files-in-process` {number|string} sets the max number of files can be uploaded while in process.
- `method` {string} sets the method when use component `XMLHttpRequest` method to send files.
- `param-name` {string} sets the variable name to read from server.
- `show-browse-link` {boolean|string} sets a link to browse files to upload.
- `url` {string} sets the url to use component `XMLHttpRequest` to send files.

### IDS Upload Advanced File (file-component)

- `disabled` {boolean} set the whole file element to disabled.
- `error` {string} set the file state to show there was an error during the file operations.
- `file-name` {string} set the file name.
- `size` {number|string} set the file size in bytes.
- `value` {number|string} set the progress bar value.

## Text strings (use with slot)

- `text-btn-cancel` Text for `x-close` button, while file in process.
- `text-btn-close-error` Text for `x-close` button, when file gets error.
- `text-btn-remove` Text for `x-close` button, when file complete uploading.
- `text-droparea` Text to show in drop area.
- `text-droparea-with-browse` Text to show in drop area when `show-browse-link` set to true.
- `text-droparea-with-browse-link` Text for `browse` link, when `show-browse-link` set to true.
- `text-progress-label` Text to set the label on progress component.

## Error strings (use with slot)

- `error-max-files` Error text to show when exceeded maximum number of files.
- `error-max-files-in-process` Error text to show when exceeded maximum number of files in process.
- `error-accept-file-type` Error text for limit the file types to be uploaded.
- `error-max-file-size` Error text to show when exceeded maximum file size.
- `error-url` Error text to show when url attribute not set.
- `error-xhr-headers` Error text to show when given value not a valid JSON array of key/value objects.

## Extra headers JSON array of key/value (use slot)

- `xhr-headers` sets the HTTP headers to be send along if used component's `XMLHttpRequest` method. (*XHR Headers must be a valid JSON string contains array of name/value objects*)

## Get current attached files from API (updated files data)

- `all` List of all the files added.
- `inProcess` List of files in-process.
- `aborted` List of files aborted.
- `errored` List of all the files had error.
- `completed` List of all completed files.

## Events that triggered

### Triggered on IdsUploadAdvanced

- `filesdragenter` Triggered when files enter to drag area.
- `filesdrop` Triggered when files dropped in to drag area.
- `beginupload` Triggered when each file sent to in-process.
- `abort` Triggered when each file get abort.
- `error` Triggered when each file get error.
- `complete` Triggered when each file complete uploading.
- `closebuttonclick` Triggered when clicked on close button in each file ui-element.

### Triggered on IdsUploadAdvancedFile (file-component)

- `beginupload` Triggered when file sent to in-process.
- `abort` Triggered when file get abort.
- `error` Triggered when file get error.
- `complete` Triggered when file complete uploading.
- `closebuttonclick` Triggered when clicked on close button.

## Keyboard Guidelines

The Ids Upload Advanced doesn't contain any interactions beyond a standard keys:

- <kbd>Tab</kbd> and <kbd>Shift Tab</kbd> moves focus into the edit field to/from the next focusable item in the tab order.
- <kbd>Space</kbd> and <kbd>Enter</kbd> open files browse window if on file browse link and behave as clicked on each buttons for example close button.

## Responsive Guidelines

- Its set as `block` element with `100%` width, so set the desired width on parent container in order to set the width.

## Converting from Previous Versions

### Converting from 4.x

The IDS Upload Advanced component is now a WebComponent. Instead of using classes to define, it is now via the web component structure.

```html
<!-- 4.x fileupload-advanced example -->
<div class="field">
  <div class="fileupload-advanced" data-options="{allowedTypes: 'jpg|png|gif'}">
</div>

<!-- This is the same upload-advanced using a WebComponent -->
<ids-upload-advanced accept=".jpg, .png, .gif"></ids-upload-advanced>
```
