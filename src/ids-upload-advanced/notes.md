# Notes - Ids Upload Advanced

## Attributes

- `accept` {string} sets limit the file types to be uploaded.
- `disabled` {boolean|string} sets to disabled state. NOTE: Making `Disabled` while `In-Process`, will NOT stop uploading files in process.
- `icon` {string} sets icon to be use in main drop area.
- `max-file-size` {number|string} sets the max file size in bytes.
- `max-files` {number|string} sets the max number of files can be uploaded.
- `max-files-in-process` {number|string} sets the max number of files can be uploaded while in process.
- `param-name` {string} sets the variable name to read from server.
- `show-browse-link` {boolean|string} sets a link to browse files to upload.
- `url` {string} sets the url to use component `XMLHttpRequest` to send files.

## Text strings (use slot)

- `text-btn-cancel` Text for `x-close` button, while file in process.
- `text-btn-close-error` Text for `x-close` button, when file gets error.
- `text-btn-remove` Text for `x-close` button, when file complete uploading.
- `text-droparea` Text to show in drop area.
- `text-droparea-with-browse` Text to show in drop area when `show-browse-link` set to true.
- `text-droparea-with-browse-link` Text for `browse` link, when `show-browse-link` set to true.
- `text-progress-label` Text to set the label on progress component.

## Error strings (use slot)

- `error-max-files` Error text to show when exceeded maximum number of files.
- `error-max-files-in-process` Error text to show when exceeded maximum number of files in process.
- `error-accept-file-type` Error text for limit the file types to be uploaded.
- `error-max-file-size` Error text to show when exceeded maximum file size.
- `error-url` Error text to show when url attribute not set.
- `error-xhr-headers` Error text to show when given value not a valid JSON array of key/value objects.

## Extra headers JSON array of key/value (use slot)

- `xhr-headers` sets the HTTP headers to be send along if used component's `XMLHttpRequest` method.

## Get current API files (updated data for end user)

- `all` List of all the files added.
- `inProcess` List of files in-process.
- `aborted` List of files aborted.
- `errored` List of all the files had error.
- `completed` List of all completed files.

## Events can be catch

### Triggered on IdsUploadAdvanced

- `filesdragenter` Triggered when files enter to drag area.
- `filesdrop` Triggered when files dropped in to drag area.
- `beginprocess` Triggered when each file sent to in-process.
- `abort` Triggered when each file get abort.
- `error` Triggered when each file get error.
- `complete` Triggered when each file complete uploading.
- `closebuttonclick` Triggered when clicked on close button in each file ui-element.

### Triggered on IdsUploadAdvancedFile (ui-element)

- `beginprocess` Triggered when file sent to in-process.
- `abort` Triggered when file get abort.
- `error` Triggered when file get error.
- `complete` Triggered when file complete uploading.
- `closebuttonclick` Triggered when clicked on close button.

## TODO

- Is there other way to hook the custom user send() method.
- Type file (`ids-upload-advanced.d.ts`)
- Documentation (`README.md`)
- Tests (functional and e2e)
