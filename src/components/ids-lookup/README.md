# Ids Lookup Component

## Description

A lookup is an input element that opens a modal with a data grid list for selecting grid rows.

Allows for users to select from multiple complex options via input field component. Single selection and multi selection can be possible in the modal dialog by setting the data grid settings.

## Use Cases

- Best used when users need more contextual information around selecting options from the grid columns.
- Use when you want users to contribute data to your website and let them organize their content themselves.

## Terminology

- **Grid/Data Grid**: Refers to a data grid when in a lookup as apposed to a responsive grid.

## Features (With Code Examples)

A normal lookup used as a web component. To distinguish between single and multi-select situations, use a checkbox column in multi-select and consider a radio select for single select. The set the appropriate settings in the data grid.

```html
<ids-lookup id="lookup-1" label="Normal Lookup"></ids-lookup>
```

If necessary you can provide your own custom modal to the lookup. When doing this you control the modal contents and events entirely. The lookup will just open it for you. Add the `confirm` or the `cancel` attribute to your custom modal-button to set which action should take place.

```html
<ids-lookup id="custom-lookup" label="Custom Lookup">
    <ids-modal slot="lookup-modal" id="custom-lookup-modal" aria-labelledby="custom-lookup-modal-title">
    <ids-text slot="title" font-size="24" type="h2" id="lookup-modal-title">Custom Lookup Modal</ids-text>
    <ids-modal-button slot="buttons" cancel id="modal-confirm-btn" appearance="primary">
        <span>Cancel</span>
    </ids-modal-button>
    <ids-modal-button slot="buttons" confirm id="modal-close-btn" appearance="primary">
        <span>Apply</span>
    </ids-modal-button>
    </ids-modal>
</ids-lookup>
```

To set all of the datagrid setting, pass the settings to the gridSettings property.

```js
lookup.dataGridSettings = {
  rowSelection: 'multiple',
  pageSize: 5,
  pageNumber: 1,
  pagination: 'client-side'
};
lookup.data = data;
```

### Lookup search

With a few settings, its possible to have the lookup modal add a search field that will provide events to facilitate searching for results. In the example we show a search field, when typing and hitting enter an event fires that lets you go to the server and get data or do whatever is required. When a `cleared` event fires you can reset the query. The developer is responsible for all the logic. We just provide an `ids-search-field` and events and a few settings.

Add `searchable="true"` and an optional placeholder text in the search field.

```html
<ids-lookup
    id="lookup-1"
    label="Items"
    title="Select an Item"
    field="id"
    value="4,5"
    searchable="true"
    searchfield-placeholder="Search for an item"
></ids-lookup>
```

Then use the `search` and `cleared` events to implement search logic. The events will fire when typing and then hitting enter or hitting the clear X button. For the example we use the same pretend back end data, fetch it and run the filtering over the datagrid filter event. Only one column was implemented in this example (color).

```js
  let searchTerm = '';
  const checkRow = (row: Record<string, unknown>) => !(row.color as string)?.includes(searchTerm);

  lookup.addEventListener('search', async (e: Event) => {
    const res = await fetch(url);
    const data = await res.json();
    lookup.data = data;
    searchTerm = (e as CustomEvent).detail.searchTerm;
    lookup.dataGrid?.datasource.filter(checkRow);
    lookup.dataGrid?.redrawBody();
    lookup.recordCount = String(lookup.dataGrid?.datasource.data.length);
    console.info(`Search term changed`);
  });

  lookup.addEventListener('cleared', async () => {
    const res = await fetch(url);
    const data = await res.json();
    lookup.data = data;
    lookup.recordCount = data.length;
    console.info(`Search term cleared`);
  });
```

## Settings and Attributes

- `autocomplete` {boolean} Sets the lookup to autocomplete, it will use the data for autocomplete / typeahead selection
- `disabled` {boolean} Sets the lookup to disabled state.
- `readonly` {boolean} Sets the lookup to readonly state.
- `field` {string} Sets the field to use in the data set when selecting.
- `label` {string} Sets the label on the input.
- `tabbable` {boolean} Turns on the functionality allow the trigger to be tabbable. For accessibility reasons this should be on in most cases and this is the default.
- `gridSettings` {object} An object containing name/value pairs for all the settings you want to pass to the data grid in the modal
- `columns` {Array<object>} Sets the data array of the data grid. This can be a JSON Array.
- `data` {Array<object>} Sets the columns array of the data grid. See column settings.
- `validate` {'required' | string} Sets the validation routine to use
- `validationEvents` {'blur' | string} Sets the validation events to use
- `value` {string} Sets the field value, use commas to delimit multiple values.
- `title` {string} Sets the title on the lookup.
- `searchable` {boolean} Sets the lookup to searchable, appending a search field at the top of the modal
- `searchfield-placeholder` {string} Sets the placeholder text on the searchfield if searchable is true.
- `record-count` {string} If set will append a record count to the modal title on the lookup

## Events

- `change` Fires when the lookup is changed either by typing, or selecting rows in the lookup modal
- `search` Fires when enabling `searchable="true"` and then typing and hitting enter in the search field on the modal
- `clear` Fires if `searchable="true"` and you clear the search field by hitting the `x` button
- `beforerowselected` Fires before selecting a row and can be vetoed
- `rowselected` Fires when a row is selected on the lookup modal
- `beforerowdeselected` Fires before deselecting a row and can be vetoed
- `rowdeselected` Fires when a row is deselected on the lookup modal
- `selectionchanged` Fires when selection has changed (either a row was deselected or selected)

## Themeable Parts

- `checkbox` allows you to further style the checkbox input element
- `trigger-field` allows you to further style the trigger container
- `input`  allows you to further style the input element
- `trigger-button` allows you to further style the trigger button
- `icon` allows you to further style the icon in the trigger button
- `modal`  allows you to further style the modal dialog container
- `data-grid` allows you to further style the data grid element

## States and Variations

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
- <kbd>Space</kbd>: Toggle selection on the current row if multiselect. If single select, the row is selected and inserted if autoApply is enabled.

## Responsive Guidelines

- Default size is 300px wide but there are a number of widths in mobile mode it will go to 100%
- The dialog stretches to 100% - 16px at smaller breakpoints

## Converting from Previous Versions (Breaking Changes)

**3.x to 4.x**

- Lookup had all new markup and classes for web components.
- inforLookup class changed to lookup
- Initialization options and API is different
- Uses events rather than callbacks

**4.x to 5.x**

- It has all new markup and classes for web components.
- Markup has changed to a custom element `<ids-lookup></ids-lookup>`
- If using events events are now plain JS events for example
- Can now be imported as a single JS file and used with encapsulated styles
- Greatly simplified the API

## Accessibility Guidelines

- There should be a label on all lookups to give an indication what the field is containing.

## Regional Considerations

Labels should be localized in the current language. The close and link icons will flip to the alternate side in Right To Left mode. Consider that in some languages text may be a lot longer (German). And in some cases it cant be wrapped (Thai).
