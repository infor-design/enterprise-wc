# Ids Data Grid

## Description

The datagrid component (ids-data-grid) is used to arrange tabular data in rows and columns for easier scanning and comparison. Data grids are very configurable in both design and functionality and they can be found within almost every product/app.

You should pass an array of objects in to the grid on the `dataset` object. Also pass the `columns` array for the column information. There are a number of events described in the events and API section, as well as the column settings.

A Read-Only Datagrid uses "Formatters" to render cell content. A number of these are listed in the API section and it is possible to create your own.

## Use Cases

- The datagrid component is most useful when it is used for categorically sorting dense and repetitive information. Each individual item is listed down the Y axis of the chart, and their shared attribute categories are listed along the X axis. The resulting cells are filled with information that is relevant to the corresponding item and attribute.

## Terminology

- **Datagrid Title**: The name of the datagrid optionally appearing above the grid and describing the contents.
- **Options**: An optionally actions menu button with datagrid functionality that operates on the entire datagrid contents.
- **Cell**: Body elements of the datagrid that contain an object's value or attribute. Cells should only contain one type of content or it can be confusing and hurt accessibility.
- **Header Cell**: These cells contain the names of the columns in the grid and related functions like filtering and sorting. All cells below the header cell will hold values related to the attribute in the header cell.
- **Column**: Cells stacked vertically that contain values relate to the attribute found on the top header cell.
- **Row**: Each row contains one cell per column in the DataGrid, and each cell displays a single value in the bound data item.

## Themeable Parts

- `table` allows you to further style the table main element
- `container` allows you to further style the container element
- `body` allows you to further style the body element
- `header` allows you to further style the header element
- `headerCell` allows you to further style the header cells
- `row` allows you to further style the rows
- `cell` allows you to further style the row cells

## Features (With Code Examples)

A datagrid is created by adding an `ids-data-grid` html element in the page and setting the options either inline in the markup or in the JS part of the code. You can only use simple types (string, boolean ect) for inline markup so passing the data and column arrangement is always done in the JS part. The data will be an array of objects so its in the correct tabular form. The columns are also an array of object but with defined options and types. (See Columns in next section)

```html
<ids-data-grid id="data-grid-1" data-automation-id="data-grid-1-automation" alternate-row-shading="true"></ids-data-grid>
```

```js
const dataGrid = document.querySelector('#data-grid-1');
dataGrid.data = dataset;
dataGrid.columns = columns;
```

### Selection

The datagrid selection feature involves the setting `rowSelection`. This can be one of several values.

- `false` No selection enabled.
- `multiple` Allows multiple rows to be selected. When doing this it is recommended to add a `formatters.selectionCheckbox` for the first column.
- `single` Allows a single row to be selected. When doing this you can optionally to add a `formatters.selectionRadio` for the first column. You can use the `supressRowDeselection` if you want one row to always be selected.
- `mixed` Allows multiple rows to be selected by clicking only on the checkbox or <kbd>Space</kbd> key. If clicking a row then that row is activated, meaning it is the current row and something might be shown based on the data of that row. You can use the `supressRowDeactivation` if you want one row to always be selected.

Here is a code example for multi select

```html
<ids-data-grid id="data-grid-1" label="Books" row-selection="multiple">
</ids-data-grid>
```

```js
  dataGrid.addEventListener('rowselected', (e) => {
    console.info(`Row Selected`, e.detail);
  });

  dataGrid.addEventListener('rowdeselected', (e) => {
    console.info(`Row Deselected`, e.detail);
  });

  dataGrid.addEventListener('selectionchanged', (e) => {
    console.info(`Selection Changed`, e.detail);
  });
```

The following events are relevant to selection/activation.

`rowselected` Fires when an individual row is activation and gives information about that row.
`rowdeselected` Fires when an individual row is deselected and gives information about that row.
`selectionchanged` Fires once for each time selection changes and gives information about all selected rows.

`rowactivated` Fires when an individual row is activated and gives information about that row.
`rowdeactivated` Fires when an individual row is deactivated and gives information about that row.
`activationchanged` Fires once for each time activation changes and gives information about the active row.

## Settings and Attributes

When used as an attribute the settings are kebab case, when used in the JS they are camel case.

- `virtualScroll` {boolean} When virtual scroll is used the grid can render many thousands of rows and only the rows visible in the scroll area are rendered for performance. This setting has limitations such as the rows need to be fixed size.
- `alternateRowShading` {boolean} For better scan-ability you can shade alternate rows.
- `listStyle` {boolean} Sets the style of the grid to list style for simple readonly lists.
- `columns` {Array<object>} Sets the data array of the datagrid. This can be a JSON Array.
- `rowHeight` {string | 'xs' | 'sm' | 'md' | 'lg'} Sets the height of each row
- `data` {Array<object>} Sets the columns array of the datagrid. See column settings.
- `rowSelection` {string|boolean} Set the row selection mode between false, 'single', 'multiple' and 'mixed
- `supressRowDeactivation` {boolean} Set to true to prevent rows from being deactivated if clicked. i.e. once a row is activated, it remains activated until another row is activated in its place.
- `supressRowDeselection`  {boolean} Set to true to prevent rows from being deselected if click or space bar the row. i.e. once a row is selected, it remains selected until another row is selected in its place.

## Column Settings (General)

|Setting|Description|
|---|---|
|`id` | The unique id of the column. Each column in the grid should have some unique id.|
|`sortable` | If false, the column cannot be sorted.|
|`resizable` | If false the column will not be resizable, thus is a fixed size and can never be changed by the user by dragging the left and right edge.|
|`readonly` | If true the cell will be set to readonly color, indicating no editing.|
|`formatter` | Controls how the data is rendered in the cell.|
|`hidden` | Excludes the column from being added to the DOM.|
|`align` | Can be `left` or `right` or `center`. Note that `center` has limited column type support.|
|`width` | The column width, this can be an integer for pixel width or a percent for example `10%`, if left off the columns will be sized to contents and to fit the width of the grid using the internal algorithm.|
|`cssPart` | Allows you to set the name of a css part that can be used to customize the cell's css. This can be a string or a function. See the columns-custom-css example. The default cssPart for cells is called `cell` and it also can be used for more global changes.  |

## Column Settings (Specific)

|Setting|Description|
|---|---|
|`href` | Used to create the href for hyperlink formatters. This can be a string or a function that can work dynamically. It can also replace `{{value}}` with the current value. |
|`text` | Used to create the txt value for hyperlink formatters if a hard coded link text is needed. |

## Formatters

|Formatter|Description|
|---|---|
|`text` | Formats the column value as a direct text element using toString in the grid cell. Undefined or Null values will be shown as empty.|
|`password` | Formats the column value masking the string length with stars. Undefined or Null values will be shown as empty. This is good for private data. |
|`rowNumber` | Formats the cell with a row number column that is shown 1 to n no matter what the sort order is. |
|`date` | Formats date data as a date string in the desired format, by default it will use `dateStyle: 'short'` for other options you can pass them in with `column.formatOptions` |
|`time` | Formats date data as a time string in the desired format, by default it will use `timeStyle: 'short'` for other options you can pass them in with `column.formatOptions` |
|`decimal` | Formats number data as a decimal string in the specified locale. For additional options you can pass them in with `column.formatOptions`. |
|`integer` | Formats number data as a integer string in the specified locale. For additional options you can pass them in with `column.formatOptions`. |
|`selectionCheckbox` | Displays a checkbox column for selection when using `rowSelection="mixed"` or `rowSelection="multiple"`|
|`selectionRadio` | Displays a checkbox column for selection when using `rowSelection="single"` |

### Formatters (Deprecated from 4.x)

- `Input` No longer suggested to use, use simple list instead
- `Status, Color` No longer used
- `Placeholder` Can now be set on the column and used with other formatters
- `Ellipsis` Can now be set on the column and used with other formatters
- `Readonly` Can now be set on the column and used with other formatters
- `Drilldown` Use button with an icon now
- `Template` is now deprecated for performance reasons, use a custom formatter
- `ClassRange` Use column cssClass function or string
- `Autocomplete, Lookup, TargetedAchievement, ProcessIndicator, Spinbox, Fileupload, Dropdown, Colorpicker, Tree, SummaryRow, GroupFooterRow, GroupRow, Expander, Editor, Textarea, Actions, RowReorder` Will be added later

## Events

- `activecellchange` Fires when the active cell changes with the keyboard or by click.
- `sort` Fires when the sort column is changed.
- `selectionchanged` Fires any time the selection changes.
- `activationchanged` Fires any time the active row changes.
- `rowselected` Fires for each row that is selected.
- `rowdeselected` Fires for each row that is deselected.
- `rowactivated` Fires for each row that is activated.
- `rowdeactivated` Fires for each row that is deactivated.
- `filtered` Fires after a filter action occurs, clear or apply filter condition.
- `filteroperatorchanged` Fires once a filter operator changed.
- `openfilterrow` Fires after the filter row is opened by the user.
- `closefilterrow` Fires after the filter row is closed by the user.

## Filters

Data rows can be filter based on one or several criteria. Whole filter row can turned on/off by the api setting `filterable` and can be disabled by the api setting `filter-row-disabled`. The filter conditions can be applied thru the UI or programmatically. Each column can have its own filter type and turn on/off by columns setting.

### Filter Columns Setting

All the filter settings can be passed thru columns data.

|Setting|Type|Description|
|---|---|---|
|`filterType` | Function | Data grid built-in filter method, see the dedicated section below. |
|`filterTerms` | Array | List of items to be use as operators in menu-button or options in dropdown. |
|`filterFunction` | Function | User defined filter method, it must return a boolean. |
|`filterOptions` | Object | Setting for components are in use, for example: `label, placeholder, disabled`. |
|`isChecked` | Function | User defined filter method, it must return a boolean. This method use along built-in `checkbox` only, when filter data value is not boolean type. |

### Built-in Filter Methods

|Method|Description|
|---|---|
|`text` | It filter as text comparison. Contains input and menu-button with list of default operators. |
|`integer` | It filter as integer comparison. Contains input and menu-button with list of default operators. |
|`decimal` | It filter as decimal comparison. Contains input and menu-button with list of default operators. |
|`contents` | It filter as text comparison. Contains dropdown and auto generate list of items based on column data. |
|`dropdown` | It filter as text comparison. Contains dropdown and must pass list of item by setting `filterTerms`. |
|`checkbox` | It filter as boolean comparison. Contains menu-button with list of default operators. |
|`date` | It filter as date comparison. Contains date-picker and menu-button with list of default operators. |
|`time` | It filter as time comparison. Contains time-picker and menu-button with list of default operators. |

### Custom Filter

If the built-in filters are not enough, creating a custom filter is an option. There are two parts you can create both parts custom or mix-match with built-in.

1. `UI Only` In order to do custom UI part of filter, add as html markup thru a slot. It must use slot and column-id attributes for example: `<div slot="filter-n" column-id="n">...</div>` where n is the columnId same passed in the columns.
1. `filterFunction` This is a user defined filter method which must return a boolean. It determines if a cell value should be considered as a valid filtered value.

### Filter Code Examples

Basic text filters

```html
<ids-data-grid id="data-grid-1" label="Books" filterable="true">
</ids-data-grid>
```

```js
const columns = [];
columns.push({
  id: 'text',
  name: 'Text',
  field: 'description',
  formatter: dataGrid.formatters.text,
  filterType: dataGrid.filters.text
});
```

No filters

```html
<ids-data-grid id="data-grid-1" label="Books" filterable="false">
</ids-data-grid>
```

```js
const columns = [];
columns.push({
  id: 'text',
  name: 'Text',
  field: 'description',
  formatter: dataGrid.formatters.text,
  filterType: dataGrid.filters.text
});
```

Disabled filter row, will disabled all attached filters.

```html
<ids-data-grid id="data-grid-1" label="Books" filterable="true" filter-row-disabled="true">
</ids-data-grid>
```

```js
const columns = [];
columns.push({
  id: 'text',
  name: 'Text',
  field: 'description',
  formatter: dataGrid.formatters.text,
  filterType: dataGrid.filters.text
});
```

Hyperlink, integer, decimal, date and time filters

```html
<ids-data-grid id="data-grid-1" label="Books" filterable="true">
</ids-data-grid>
```

```js
const columns = [];
columns.push({
  id: 'hyperlink',
  name: 'Hyperlink',
  field: 'description',
  href: '#',
  formatter: dataGrid.formatters.text,
  filterType: dataGrid.filters.hyperlink
});
columns.push({
  id: 'integer',
  name: 'Integer',
  field: 'price',
  filterType: dataGrid.filters.integer,
  formatter: dataGrid.formatters.integer,
  formatOptions: { locale: 'en-US' }
});
columns.push({
  id: 'decimal',
  name: 'Decimal',
  field: 'price',
  filterType: dataGrid.filters.decimal,
  formatter: dataGrid.formatters.decimal,
  formatOptions: { locale: 'en-US' }
});
columns.push({
  id: 'date',
  name: 'Date',
  field: 'publishDate',
  filterType: dataGrid.filters.date,
  formatter: dataGrid.formatters.date
});
columns.push({
  id: 'time',
  name: 'Time',
  field: 'publishDate',
  filterType: dataGrid.filters.time,
  formatter: dataGrid.formatters.time
});
```

Some filter options label, placeholder, disabled.

```html
<ids-data-grid id="data-grid-1" label="Books" filterable="true">
</ids-data-grid>
```

```js
const columns = [];
columns.push({
  id: 'description',
  name: 'Description',
  field: 'description',
  formatter: dataGrid.formatters.text,
  filterType: dataGrid.filters.text,
  filterOptions: {
    label: 'Label text for description input',
    placeholder: 'Placeholder text for description input',
    disabled: true
  }
});
```

Custom operators items for menu-button.

```html
<ids-data-grid id="data-grid-1" label="Books" filterable="true">
</ids-data-grid>
```

```js
const columns = [];
columns.push({
  id: 'description',
  name: 'Description',
  field: 'description',
  formatter: dataGrid.formatters.text,
  filterType: dataGrid.filters.text,
  filterTerms: [{
    value: 'contains',
    label: 'Contains',
    icon: 'filter-contains'
  },
  {
    value: 'equals',
    label: 'Equals',
    icon: 'filter-equals',
    selected: true
  }]
});
```

Contents and dropdown type filters.

```html
<ids-data-grid id="data-grid-1" label="Books" filterable="true">
</ids-data-grid>
```

```js
const columns = [];
columns.push({
  id: 'location',
  name: 'Location',
  field: 'location',
  formatter: dataGrid.formatters.text,
  filterType: dataGrid.filters.contents,
  filterOptions: {
    notFilteredItem: { value: 'not-filtered', label: 'Not Filtered' }
  }
});
columns.push({
  id: 'useForEmployee',
  name: 'NotFilterdItem (shown as blank)',
  field: 'useForEmployee',
  formatter: dataGrid.formatters.text,
  filterType: dataGrid.filters.dropdown,
  filterTerms: [
    { value: 'Yes', label: 'Yes' },
    { value: 'No', label: 'No' }
  ]
});
columns.push({
  id: 'useForEmployeeCustomNotFilterdItem',
  name: 'NotFilterdItem (show as custom text)',
  field: 'useForEmployee',
  formatter: dataGrid.formatters.text,
  filterType: dataGrid.filters.dropdown,
  filterTerms: [
    { value: 'not-filtered', label: 'Not Filtered' },
    { value: 'Yes', label: 'Yes' },
    { value: 'No', label: 'No' }
  ]
});
```

Checkbox type filters.

```html
<ids-data-grid id="data-grid-1" label="Books" filterable="true">
</ids-data-grid>
```

```js
const columns = [];
columns.push({
  id: 'checkbox',
  name: 'Checkbox',
  field: 'inStock',
  formatter: dataGrid.formatters.text,
  filterType: dataGrid.filters.checkbox
});
columns.push({
  id: 'customCheckMethod',
  name: 'Custom check method',
  field: 'active',
  formatter: dataGrid.formatters.text,
  filterType: dataGrid.filters.checkbox,
  isChecked: (value) => value === 'Yes'
});
```

Custom filter method.

```html
<ids-data-grid id="data-grid-1" label="Books" filterable="true">
</ids-data-grid>
```

```js
// Custom filter checking
const myCustomFilter = (opt) => {
  const { operator, columnId, value } = opt.condition;
  const val = {
    condition: Number.parseInt(value, 10),
    data: Number.parseInt(opt.data[columnId], 10)
  };
  let isMatch = false;
  if (Number.isNaN(val.condition) || Number.isNaN(val.data)) return isMatch;

  if (operator === 'equals') isMatch = (val.data === val.condition);
  if (operator === 'greater-than') isMatch = (val.data > val.condition);
  if (operator === 'greater-equals') isMatch = (val.data >= val.condition);
  if (operator === 'less-than') isMatch = (val.data < val.condition);
  if (operator === 'less-equals') isMatch = (val.data <= val.condition);

  return isMatch;
};

const columns = [];
columns.push({
  id: 'customFilterMethod',
  name: 'Custom Filter Method',
  field: 'price',
  filterFunction: myCustomFilter,
  formatter: dataGrid.formatters.integer,
  formatOptions: { locale: 'en-US' }
});
```

Custom filter UI part.

```html
<ids-data-grid id="data-grid-1" label="Books" filterable="true">
  <div slot="filter-description" column-id="description">
    <ids-menu-button id="btn-filter-description" icon="filter-greater-equals" menu="menu-filter-description" dropdown-icon>
      <span slot="text" class="audible">Greater Than Or Equals</span>
    </ids-menu-button>
    <ids-popup-menu id="menu-filter-description" target="#btn-filter-description">
      <ids-menu-group select="single">
        <ids-menu-item value="equals" icon="filter-equals">Equals</ids-menu-item>
        <ids-menu-item value="greater-than" icon="filter-greater-than">Greater Than</ids-menu-item>
        <ids-menu-item value="greater-equals" icon="filter-greater-equals" selected="true">Greater Than Or Equals</ids-menu-item>
        <ids-menu-item value="less-than" icon="filter-less-than">Less Than</ids-menu-item>
        <ids-menu-item value="less-equals" icon="filter-less-equals">Less Than Or Equals</ids-menu-item>
      </ids-menu-group>
    </ids-popup-menu>
    <ids-input id="input-filter-description" type="text" size="full" placeholder="Slotted description" label="Slotted description input">
    </ids-input>
  </div>
</ids-data-grid>
```

```js
const columns = [];
columns.push({
  id: 'text',
  name: 'Text',
  field: 'description',
  formatter: dataGrid.formatters.text,
  filterType: dataGrid.filters.text
});
```

### Filter rows programmatically

```js
// Filter rows
const conditions = [{ columnId: 'description', operator: 'contains', value: '5' }];
dataGrid.applyFilter(conditions);

// Reset all filters
dataGrid.applyFilter([]);
```

### Filter Events

The following events are relevant to data-grid filters.

- `filtered` Fires after a filter action occurs, clear or apply filter condition.
- `filteroperatorchanged` Fires once a filter operator changed.
- `openfilterrow` Fires after the filter row is opened by the user.
- `closefilterrow` Fires after the filter row is closed by the user.

## States and Variations

**Rows**
- Hover
- Selected
- Disabled
- Readonly
- Activated

**Columns**
- Focus
- Hover
- Sorted
- Selected
- Disabled
- Filtered

**Cells**
- Hover (sometimes a cursor change)
- Readonly
- Focus

## Keyboard Guidelines

- <kbd>Tab</kbd>The initial tab enters the grid with focus on the first cell of the first row, often a header. A second tab moves out of the grid to the next tab stop on the page. Once focus is established in the grid, a TAB into or a Shift Tab into the grid will return to the cell which last had focus.
- <kbd>Left</kbd> and <kbd>Right</kbd> Move focus to the adjacent column's cell. There is no wrap at the end or beginning of columns.
- <kbd>Up</kbd> and <kbd>Down</kbd> Move focus to the adjacent row's cell. There is no wrap at the first or last row.
- <kbd>Home</kbd> moves focus to the first cell of the current row
- <kbd>End</kbd> moves focus to the last cell of the current row
- <kbd>Page Up</kbd> moves focus to the first cell in the current column
- <kbd>Page Down</kbd> moves focus to the last cell in the current column
- <kbd>Enter</kbd> toggles edit mode on the cell if it is editable. There is also an "auto edit detection". If the user starts typing then edit mode will happen automatically without enter.
- <kbd>Space</kbd> Toggles the activate row. If supressRowDeselection is set it will be ignored on deselect.
- <kbd>F2</kbd> toggles actionable mode. Pressing the <kbd>Tab</kbd> key while in actionable mode moves focus to the next actionable cell. While in actionable mode you can do things like type + enter. This will move you down a row when you hit enter. If the cell has a control that uses down arrow (like the drop downs or lookups that are editable). Then the user needs to hit enter to enable the edit mode on that cell.
- <kbd>Triple Click</kbd> Not a keyboard shortcut, but if you have text in a cell that is overflowed a triple click will select all the text even the part that is invisible.
- <kbd>Ctrl+A (PC) / Cmd+A (Mac)</kbd> If the grid is mixed or multi select this will select all rows.

## Responsive Guidelines

- By default, datagrid grows depending on the amount of contents within and will scroll if necessary under the header. It stops growing when it reaches the size of the parent container.
- `autoFit` property or `auto-fit` attribute can be set manually to make the datagrid size fill and be responsive to the size of the screen, regardless of the amount of contents.

## Converting from Previous Versions (Breaking Changes)

**3.x to 4.x**
- Counts have all new markup and classes.

**4.x to 5.x**
- Datagrid has all new markup and a custom element but similarly named options
- Still uses same columns and data set options. Some column options enhanced and changed.
- If using events events are now plain JS events for example: sorted, rendered
- Some Api Functions have changed
- If using properties/settings these are now attributes or as plain properties for example: data, virtual-scroll
- Markup has changed to a custom element `<ids-data-grid></ids-data-grid>`
- Can now be imported as a single JS file and used with encapsulated styles

## Accessibility Guidelines

1.1.1 Non-text Content - All images, links and icons have text labels for screen readers when the formatters are used.
- 1.4.3 Contrast (Minimum) - The visual presentation of text and links and images of text has a contrast ratio of at least 4.5:1.
- 2.1.1 Keyboard - Make all functionality available from a keyboard. The grid has keyboard shortcuts and is usable with a screen reader due to the addition of aria tags.

## Regional Considerations

Titles and labels should be localized in the current language. All elements will flip to the alternate side in Right To Left mode. Consider that in some languages text may be a lot longer (German). And in some cases it cant be wrapped (Thai). For some of these cases text-ellipsis is supported.
