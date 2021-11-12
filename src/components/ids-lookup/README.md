# Ids Lookup Component

## Description

A lookup is an input element that opens a modal with a datagrid list for selecting grid rows.

Allows for users to select from multiple complex options via input field component. Single selection and multi selection can be possible in the modal dialog list with the addition of checkboxes.

## Use Cases

- Best used when users need more contextual information around options in the grid information.
- Use when you want users to contribute data to your website and let them organize their content themselves.

## Terminology

- **Grid/Datagrid**: Refers to a datagrid when in a lookup as apposed to a responsive grid.

## Features (With Code Examples)

A normal lookup used as a web component. To distinguish between single and multi-select situations, use a checkbox column in multi-select and consider a radio select for single select.

```html
<ids-lookup id="lookup-1" label="Normal Lookup"></ids-lookup>
```

If necessary you can provide your own custom modal to the lookup. When doing this you control the modal contents and events entirely. The lookup will just open it for you.

```html
<ids-lookup id="custom-lookup" label="Custom Lookup">
    <ids-modal slot="lookup-modal" id="custom-lookup-modal" aria-labelledby="custom-lookup-modal-title">
    <ids-text slot="title" font-size="24" type="h2" id="lookup-modal-title">Custom Lookup Modal</ids-text>
    <ids-modal-button slot="buttons" id="modal-close-btn" type="primary">
        <span slot="text">Apply</span>
    </ids-modal-button>
    </ids-modal>
</ids-lookup>
```

## Settings and Attributes

- `disabled` {boolean} Set the lookup to disabled state.
- `readonly` {boolean} Set the lookup to readonly state.
- `tabbable` {boolean} Turns on the functionality allow the trigger to be tabbable. For accessibility reasons this should be on in most cases and this is the default.
- `gridSettings` {object} An object containing name/value pairs for all the settings you want to pass to the datagrid in the modal
- `columns` {Array<object>} Set the data array of the datagrid. This can be a JSON Array.
- `data` {Array<object>} Set the columns array of the datagrid. See column settings.
- `validate` {'required' | string} Sets the validation routine to use
- `validationEvents` {'blur' | string} Sets the validation events to use

## Themeable Parts

- `checkbox` allows you to further style the checkbox input element
- `trigger-field` allows you to further style the trigger container
- `input`  allows you to further style the input element
- `trigger-button` allows you to further style the trigger button
- `icon` allows you to further style the icon in the trigger button
- `modal`  allows you to further style the modal dialog container
- `data-grid` allows you to further style the dataGrid element

## States and Variations (With Code Examples)

- Default: The normal, unaltered state for lookups.
- Hover: The state where a user moves over the lookup field with their cursor.
- Focus: Indicates that the user has tabbed through and highlighted the lookup.
- Disabled When the lookup is unable to be changed due to its dependence on other factors or partial irrelevance. Since these states can sometimes lead to confusion, it's useful to pair this state with a Tooltip explanation as to why it's disabled.
- Readonly A lookup state where the selection is only, ever for viewing. While the information cannot be changed, users can copy and view the data. In general a label and value can also be used for read only states as well.
- Error: The state where the user has interacted with the field and received an error. The lookup field is able to explain what caused the error below.

## Keyboard Guidelines

- <kbd>Tab/Shift+Tab</kbd>: Moves focus into the field to/from the next focusable item in the tab order.
- <kbd>Down Arrow</kbd>: Opens the dialog if the input is enabled
- <kbd>Esc</kbd>: Cancels and closes the open dialog
- <kbd>Tab/Shift+Tab</kbd>: Tab and Shift Tab when the dialog is open, tab will move around the items, for example, from the search to the data grid
- <kbd>Down/Up Arrow</kbd>: When focus is on the grid in the dialog this moves the focus up and down on the rows
- <kbd>Enter/Space</kbd>: Toggle selection on the current row if multiselect. If single select, the row is selected and inserted if autoApply is enabled.

## Responsive Guidelines

- Default size is 300px wide but there are a number of widths in mobile mode it will go to 100%
- The dialog stretches to 100% - 16px at smaller breakpoints

## Converting from Previous Versions

- 3.x: Lookup had all new markup and classes.
- 4.x: Lookup had all new markup and classes for web components.
  - inforLookup class changed to lookup
  - Initialization options and API is different
  - Uses events rather than callbacks
- 5.x: Lookup had all new markup and classes for web components.

## Designs

[Design Specs](https://www.figma.com/file/ok0LLOT9PP1J0kBkPMaZ5c/IDS_Component_File_v4.6-(Draft))

## Accessibility Guidelines

- There should be a label on all lookups to give an indication what the field is containing.

## Regional Considerations

Labels should be localized in the current language. The close and link icons will flip to the alternate side in Right To Left mode. Consider that in some languages text may be a lot longer (German). And in some cases it cant be wrapped (Thai).
