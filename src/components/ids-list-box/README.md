# Ids List Box Component

## Description

The List Box Component is used in the dropdown and autocomplete to form a aria list with options and give the right accessibility. It shouldn't need to be used directly.
You might want the listview component if considering using it directly or we might expand on it later.

## Use Cases

- Used with in dropdown and autocomplete

## Terminology

- **listbox**: The aria role for the outside container.
- **option**: The aria role for the inner options

## Features (With Code Examples)

A normal ids-list-box with options

```html
<ids-list-box>
    <ids-list-box-option value="opt1" id="opt1" tooltip="Additional Info on Option One">Option One</ids-list-box-option>
    <ids-list-box-option value="opt2" id="opt2" tooltip="Additional Info on Option Two">Option Two</ids-list-box-option>
    <ids-list-box-option value="opt3" id="opt3" tooltip="Additional Info on Option Three">Option Three</ids-list-box-option>
    <ids-list-box-option value="opt4" id="opt4" tooltip="Additional Info on Option Four">Option Four</ids-list-box-option>
    <ids-list-box-option value="opt5" id="opt5" tooltip="Additional Info on Option Five">Option Five</ids-list-box-option>
    <ids-list-box-option value="opt6" id="opt6" tooltip="Additional Info on Option Six">Option Six</ids-list-box-option>
</ids-list-box>
```

## Settings and Attributes

- `value` {string} The value for use when the option is selected.
- `id` {string} The id for the option (value is still always needed)

## Keyboard Guidelines

The board is done in the dropdown and autocomplete but we might change this.

## Responsive Guidelines

- Flows with padding and margin within the width and height of the parent container. Possibly scrolling as needed based on parent dimensions.

## Converting from Previous Versions

- 3.x: Did not exist
- 4.x: Did not exist

## Regional Considerations

Labels should be localized in the current language. The icons will flip to the alternate side in Right To Left mode. Consider that in some languages text may be a lot longer (German). And in some cases it cant be wrapped (Thai).
