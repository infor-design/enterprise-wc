# Ids Data Grid

## Description

The data grid component (ids-data-grid) is used to arrange tabular data in rows and columns for easier scanning and comparison. Data grids are very configurable in both design and functionality and they can be found within almost every product/app.

You should pass an array of objects in to the grid on the `dataset` object. Also pass the `columns` array which contains the column configuration. There are a number of events described in the events and API section, as well as the column settings.

A Read-Only data grid uses "Formatters" to render cell content. A number of these are listed in the API section and it is possible to create your own.

## Use Cases

- The data grid component is most useful when it is used for categorically sorting dense and repetitive information. Each individual item is listed down the Y axis of the chart, and their shared attribute categories are listed along the X axis. The resulting cells are filled with information that is relevant to the corresponding item and attribute.

## Terminology

- **Title**: The name of the data grid optionally appearing above the grid and describing the contents.
- **Options**: An optionally actions menu button with functionality that operates on the entire data grid.
- **Cell**: Body elements of the data grid that contain an object's value or attribute. Cells should only contain one type of content or it can be confusing and hurt accessibility.
- **Header Cell**: These cells contain the names of the columns in the grid and related functions like filtering and sorting. All cells below the header cell will hold values related to the attribute in the header cell.
- **Column**: Cells stacked vertically that contain values relate to the attribute found on the top header cell.
- **Row**: Each row contains one cell per column in the data grid, and each cell displays a single value in the bound data item.
- **Tree**: Denotes the use of hierarchical data, with an expandable and collapsible hierarchy.

## Themeable Parts

- `table` allows you to further style the table main element
- `container` allows you to further style the container element
- `body` allows you to further style the body element
- `header` allows you to further style the header element
- `headerCell` allows you to further style the header cells
- `row` allows you to further style the rows
- `cell` allows you to further style the row cells
- `cell-selected` allows you to further style row cells that are selected (in mixed-selection mode, activated cells are also styled)
- `tooltip-popup` allows you to further style or adjust the outer tooltip popup element
- `tooltip-arrow` allows you to adjust the tooltip arrow element

## Features (With Code Examples)

A data grid is created by adding an `ids-data-grid` html element in the page and setting the options either inline in the markup or in the JS part of the code. You can only use simple types (string, boolean ect) for inline markup so passing the data and column arrangement is always done in the JS part. The data will be an array of objects so its in the correct tabular form. The columns are also an array of objects but with defined options and types. See more about columns in next section.

```html
<ids-data-grid id="data-grid-1"></ids-data-grid>
```

```js
const dataGrid = document.querySelector('#data-grid-1');
dataGrid.data = dataset;
dataGrid.columns = columns;
```

### Column Groups

Setting column groups allows you to add a second level of columns in your header and the ability to group the first level. This is useful for when you have a large number of columns and you want to group them into logical or related sections.

Column groups are achieved by providing an array to the `columnGroups` setting. Only one level of column groups can be defined.

```js
dataGrid.columnGroups = [
{
  colspan: 3,
  id: 'group1',
  name: 'Column Group One',
  align: 'center'
},
{
  colspan: 2,
  id: 'group2',
  name: 'Column Group Two'
},
{
  colspan: 2,
  id: 'group3',
  name: 'Column Group Three',
  align: 'right'
},
{
  colspan: 11,
  id: 'group4',
  name: 'Column Group Four',
  align: 'left'
}
];
```

If the column is hidden it will be automatically removed from the `colspan`. If in the last group you didn't provided a bug enough `colspan` it will be set to the remaining columns. The `name` text can be right or left aligned and given an id. The only required property is `colspan`.

### Selection

The data grid selection feature involves the setting `rowSelection`. This can be one of several values.

- `false` No selection enabled.
- `multiple` Allows multiple rows to be selected. When doing this it is recommended to add a `formatters.selectionCheckbox` for the first column.
- `single` Allows a single row to be selected. When doing this you can optionally to add a `formatters.selectionRadio` for the first column. You can use the `suppressRowDeselection` if you want one row to always be selected.
- `mixed` Allows multiple rows to be selected by clicking only on the checkbox or <kbd>Space</kbd> key. If clicking a row then that row is activated, meaning it is the current row and something might be shown based on the data of that row. You can use the `suppressRowDeactivation` if you want one row to always be selected.

Here is a code example for multi select

```html
<ids-data-grid id="data-grid-1" label="Books" row-selection="multiple">
</ids-data-grid>
```

```js
  dataGrid.addEventListener('beforerowselected', (e: Event) => {
    console.info(`Before Row Selected`, (<CustomEvent>e).detail);
    if (Number((e as any).detail.data.book) === 104) {
      console.error('Row 104 randomly cant be selected');
      (<CustomEvent>e).detail.response(false);
    }
  });

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

### Tree Grid

The tree grid feature involves the setting `treeGrid` to true. In addition the data passed to the tree grid should contain a field called `children`. That contains the child rows. This can by unlimited levels but 2-4 is recommended as a max for a more usable UI. In addition you can preset some states by adding `rowExpanded: false` to the parent elements (default is expanded). And also set `rowHidden: false` for child rows that are expanded. You also need a `Expander` formatter on a cell (usually the first visible cell.

Here is a code example for a tree grid.

```html
<ids-data-grid id="tree-grid" label="Buildings" tree-grid="true" group-selects-children="true"></ids-data-grid>
```

```js
dataGrid.addEventListener('rowexpanded', (e) => {
  console.info(`Row Expanded`, e.detail);
});

dataGrid.addEventListener('rowcollapsed', (e) => {
  console.info(`Row Collapsed`, e.detail);
});
```

The following events are relevant to selection/activation.

`rowexpanded` Fires when a tree grid row is expanded by click or keyboard.
`rowcollapsed` Fires when a tree grid row is collapsed by click or keyboard.

Some additional settings are needed or possibly needed.

- `idColumn` {string} For saving the row state during sort this should be set to the id column in the data set. Defaults to `id`.
- `groupSelectsChildren` {boolean} If the tree grid has multiple selection, setting this will select all children when a parent is selected.
- `suppressRowClickSelection` {boolean} If using selection you might want to set this so clicking a row will not select it.
### Expandable Row

The Expandable Row feature involves the setting `expandableRow` to true. In addition a row template should be provided via an id that points to the `expandableRowTemplate` which is a `template` element. You can preset the expandable state by adding `rowExpanded: true` to the row element you want to expand. The default is collapsed.

Here is a code example for an expandable row

```html
<ids-data-grid
    id="data-grid-expandable-row"
    expandable-row="true"
    expandable-row-template="expandable-row-tmpl"
    label="Books">
    <template id="expandable-row-tmpl">
        <ids-layout-grid auto-fit="true" padding-x="md">
        <ids-text font-size="16" type="span">${convention}</ids-text>
        </ids-layout-grid>
        <ids-layout-grid auto-fit="true" padding-x="md">
        <ids-text font-size="14" type="span">${price} USD</ids-text>
        </ids-layout-grid>
        <ids-layout-grid auto-fit="true" padding-x="md">
        <ids-text font-size="14" type="span">Lorem Ipsum is simply sample text of the printing and typesetting industry. Lorem Ipsum has been the industry standard sample text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only...</ids-text>
        </ids-layout-grid>
    </template>
</ids-data-grid>
```

```js
dataGrid.addEventListener('rowexpanded', (e) => {
  console.info(`Row Expanded`, e.detail);
});

dataGrid.addEventListener('rowcollapsed', (e) => {
  console.info(`Row Collapsed`, e.detail);
});
```

The following events are relevant to expandable rows

`rowexpanded` Fires when a tree grid row is expanded by click or keyboard.
`rowcollapsed` Fires when a tree grid row is collapsed by click or keyboard.

Some additional settings are needed or possibly needed.

- `idColumn` {string} For saving the row state during sort this should be set to the id column in the data set. Defaults to `id`.
- `expandableRowTemplate` {string} Should point to the row `template` element.

### Editing

The Editing features start by setting `editable` to true. In addition you should add editors to columns and enable features of each of the editors. The features differ depending on the component used for editing. See the Keyboard section for information on which keys can be used when editing..

Here is a code example for an editable text cell.

```js
columns.push({
    id: 'description',
    name: 'Description',
    field: 'description',
    sortable: true,
    resizable: true,
    reorderable: true,
    formatter: dataGrid.formatters.text,
    editor: {
      type: 'input',
      inline: true,
      editorSettings: {
        autoselect: true,
        dirtyTracker: true
      }
    }
  });
```

Here is a code example for an editable dropdown cell

```js
columns.push({
  id: 'description',
  name: 'Description',
  field: 'description',
  resizable: true,
  reorderable: true,
  formatter: dataGrid.formatters.dropdown,
  editor: {
    type: 'dropdown',
    editorSettings: {
      dirtyTracker: true,
      validate: 'required',
      options: [
        {
          label: 'Option 1',
          value: 'opt1'
        },
        {
          label: 'Option 2',
          value: 'opt2'
        }
      ]
    }
  }
});
```

To cancel or disabled editing there are a few ways:

- setting the column `editor` setting to undefined will disable editing on the column (as will not having an editor setting at all).
- adding a `readonly` or `disabled` function which returned true for some cells based on a condition will disable or mark the cell readonly.
- return false in the `beforecelledit` event in the response function

The following settings are available on editors.

`type` As of now can be `checkbox`, `input`, `datepicker`, `timepicker`, or `dropdown` but more will be added.
`inline` Default is false. If true the editor (for example an input) will be visible in a field.
`editorSettings` Is an object that is loosely typed that lets you pass any option the editor supports in. For example any of the IdsInput or IdsCheckbox options can be passing in. Some special ones are:
`editorSettings.autoselect` Text will be selected when entering edit mode
`editorSettings.dirtyTracker` Enables the dirty tracker that marks changed cells.
`editorSettings.validate` Text will be selected when entering edit mode
`editorSettings.mask` Will pass mask settings to the input (if supported).
`editorSettings.maskOptions` Will pass maskOptions settings to the input (if supported).
`editorSettings.options` Dataset used for dropdown editor's list box options.
`editorSettings.maxlength` Sets the input editor's `maxlength` property to the max characters you can type
`editorSettings.uppercase` Sets the input editor's to all uppercase

When the use clicks in the cell or activates editing with the keyboard with the Enter key and types. The following events will fire.

`beforecelledit` Fires before a cell is being edit (before edit is started). Can be vetoed by returning false as shown below.
`celledit` Fires exactly when a cell is being edited.
`endcelledit` Fires when a cell edit is completed and changed.
`cancelcelledit` Fires when an edit is cancelled via the <kbd>Esc</kbd> key.

To cancel editing based on some condition or if editing is not allowed you can veto the `beforecelledit` event.

```js
  dataGrid.addEventListener('beforecelledit', (e: Event) => {
    (<CustomEvent>e).detail.response(false);
  });
```

There are a few utility functions for editing the data grid mentioned in the Methods section.

## Settings and Attributes

When used as an attribute in the DOM the settings are kebab case, when used in JS they are camel case.

- `virtualScroll` {boolean} When virtual scroll is used the grid can render many thousands of rows and only the rows visible in the scroll area are rendered for performance. This setting has limitations such as the rows need to be fixed size.
- `addNewAtEnd` {boolean} Automatically append rows while keyboard navigating data grid in edit mode.
- `alternateRowShading` {boolean} For better scan-ability you can shade alternate rows.
- `listStyle` {boolean} Sets the style of the grid to list style for simple readonly lists.
- `columns` {Array<object>} Sets the columns array of the data grid. See column settings.
- `columnGroups` {Array<object>} Allows you to group columns together in logical sets. See section below for details.
- `rowHeight` {string | `'xxs'` | `'xs'` | `'sm'` | `'md'` | `'lg'`} Sets the height and padding of each row. In smaller row heights the font is lowered.
- `data` {Array<object>} Sets the data to show in the data grid. This can be a JSON Array.
- `disableClientFilter` {boolean} Disables the filter logic client side in situations you want to filter server side.
- `filterable` {boolean} Turns on or off the filter functionality.
- `filterRowDisabled` {boolean} Disables the filter row.
- `headerMenuData` {Array<object>} Dataset to build context menu for header and header group cells.
- `headerMenuId` {string} ID of the popupmenu to use as context menu for header and header group cells.
- `menuData` {Array<object>} Dataset to build context menu for body cells.
- `menuId` {string} ID of the popupmenu to use as context menu for body cells.
- `rowNavigation` {boolean} If using row navigation, the row will be focused when navigating the data grid via clicks and keyboard events.
- `rowSelection` {string|boolean} Set the row selection mode between false, 'single', 'multiple' and 'mixed
- `suppressRowClickSelection` {boolean} If using selection setting this will require clicking a checkbox or radio to select the row. Clicking other cells will not select the row.
- `suppressRowDeactivation` {boolean} Set to true to prevent rows from being deactivated if clicked. i.e. once a row is activated, it remains activated until another row is activated in its place.
- `suppressRowDeselection`  {boolean} Set to true to prevent rows from being deselected if click or space bar the row. i.e. once a row is selected, it remains selected until another row is selected in its place.
- `suppressTooltips`  {boolean} Set to true to prevent display tooltips.
- `idColumn` {string} For saving the row state during sort this should be set to the id column in the data set. Defaults to `id`.
- `expandableRow` {boolean} Indicates expandable rows will be used in the data grid.  See the expandable row section for more details.
- `expandableRowTemplate` {string} Should point to the row `template` element for expandable rows.
- `treeGrid` {boolean} Indicates a tree grid will be used  in the data grid. See the tree grid section for more details.
- `showHeaderExpander` {boolean} Set to show header expander icon for expandable and tree rows.
- `groupSelectsChildren` {boolean} If a tree grid has multiple selection, setting this will select all children when a parent is selected.
- `saveActivePage` {boolean} If set the active page on the pager will be saved to local storage.
- `saveColumns` {boolean} If set columns will be saved to local storage.
- `saveFilter` {boolean} If set filter will be saved to local storage.
- `savePageSize` {boolean} If set the page size on the pager will be saved to local storage.
- `saveRowHeight` {boolean} If set the row height will be saved to local storage.
- `saveSortOrder` {boolean} If set column sort order will be saved to local storage.
- `saveUserSettings` {boolean} If set all settings will be saved to local storage.
- `emptyMessageDescription` {string} Set empty message description text.
- `emptyMessageIcon` {string} Set empty message icon name.
- `emptyMessageLabel` {string} Set empty message label text.
- `suppressEmptyMessage` {boolean} Set to true to prevent display empty message.
- `editable` {boolean} If true in addition to adding editors to columns the data grid is editable.
- `editNextOnEnterPress` {boolean} If enabled when editing using <kbd>ENTER</kbd> will finish editing and start editing the same cell in next row and <kbd>SHIFT + ENTER</kbd> will edit the previous row.

## Column Settings (General)

|Setting|Type|Description|
|---|---|---|
|`id` | {string} | The unique id of the column. Each column in the grid should have some unique id.|
|`name` | {string} | The text to show on the header.|
|`field` | {string} | The name of the field (column) in the data array attached to the grid for example `description`. This can also be nested in an object for example `children.name`. |
|`showHeaderExpander` | {boolean} | If true, an expand/collapse icon will appear on the column's header.|
|`sortable` | {boolean} | If false, the column cannot be sorted. When completed a `sorted` event will fire.|
|`resizable` | {boolean} | If false the column will not be resizable, thus is a fixed size and can never be changed by the user by dragging the left and right edge.  When completed a `columnresized` event will fire. See the `columns-resizable` example for a working example. |
|`reorderable` | {boolean} | If true the column can be dragged into another position with adjacent columns. When completed a `columnmoved` event will fire. See the `columns-reorderable` example for a working example. This currently does not work with grouped columns. |
|`readonly` | {boolean or Function} | If true the cell will be set to readonly color, indicating no editing.|
|`disabled` | {boolean or Function} | If true the cell will be set to disabled color, indicating no editing.|
|`formatter`| {Function} | Controls how the data is rendered in the cell.|
|`hidden` | {boolean} | Excludes the column from being added to the DOM.|
|`align` | {string} | Can be `left` or `right` or `center` to align both the cell and the header. Left is the default so does not need to be specified. |
|`headerAlign` | {string} | Can be `left` or `right` or `center` to align just the header. Left is the default so does not need to be specified. |
|`minWidth` | {number} | The minimum width used to prevent resizing a column below this size. |
|`maxWidth` | {number} | The maximum width used to prevent resizing a column above this size. |
|`cssPart` | {string} | Allows you to set the name of a css part that can be used to customize the cell's css. This can be a string or a function. See the columns-custom-css example. The default cssPart for cells is called `cell` and it also can be used for more global changes.  |
|`frozen` | {string} | Sets the column to be frozen on either left or right side by passing `left` or `right`. See the `columns-frozen` example for a working example. Frozen columns currently have some limitations to be addressed in the future. |<!--lint disable maximum-line-length definition-case-->
|`width` | {number or string} | The column width, this can be an integer for fixed pixel width or a percent for example `10%`, if left off the columns will be sized to contents and to fit the width of the grid using the css table browsers handling (this is known as `auto` columns). I.E. There are three column configurations: `auto`, `fixed` and `percent`. <br /><br />In addition one can specify any css grid column setting like `fr` or `ch`. In order to make what was called a `stretchColumn` in previous versions you can set the width to`minmax(130px, 4fr)`. This is some minimum width and a `fr` unit equal to the remaining number of columns (see example columns-stretch.html). For a spacer column you just need to specify one extra column at the end (see example columns-fixed.html) but this is not recommended for how it looks. |<!--lint enable maximum-line-length definition-case-->
|`headerIcon` | {string} | Allows you to set the name of the header icon. |
|`tooltipOptions` | {Object or Function} | Allows you to set the tooltip options. See the tooltip example. |
|`tooltip` | {string or Function} | Let you set the tooltip content. |
|`headerTooltip` | {string} | Let you set the header title tooltip content. |
|`headerIconTooltip` | {string} | Let you set the header icon tooltip content. |
|`filterButtonTooltip` | {string} | Let you set the header filter button tooltip content. |
|`tooltipCssPart` | {string or Function} | Allows you to set the name of a tooltip css part that can be used to customize the tooltip css. This can be a string or a function. See the columns-custom-css example.
|`headerTooltipCssPart` | {string} | Allows you to sets the header tooltip css part.
|`headerIconTooltipCssPart` | {string} | Allows you to sets the header icon tooltip css part.
|`filterButtonTooltipCssPart` | {string} | Allows you to sets the filter button tooltip css part.
|`cellSelectedCssPart` | {string} | Allows customization of a selected cell's background color.
|`editor` | {object} | Adds an editor to the column if editable is set on the grid. See editing section for more details.

## Column Settings (Specific)

|Setting|Type|Description|
|---|---|---|
|`href` | {string|Function} | Used to create the href for hyperlink formatters. This can be a string or a function that can work dynamically. It can also replace `{{value}}` with the current value. |
|`text` | {string} | Used to create the txt value for hyperlink formatters if a hard coded link text is needed. |
|`disabled` | {boolean|Function} | Sets the cell contents to disabled, can also use a callback to determine this dynamically. Only checkboxes, radios, buttons and link columns can be disabled at this time. Selection columns require disabled rows in order to not be clickable/selectable. |
|`uppercase` | {boolean} | Transforms all the text in the cell contents to uppercase. See also filterOptions and editorOptions |

## Formatters

|Formatter|Description|
|---|---|
|`text` | (Default) Formats the column value as a direct text element using toString in the grid cell. Undefined or Null values will be shown as empty.|
|`password` | Formats the column value masking the string length with stars. Undefined or Null values will be shown as empty. This is good for private data. |
|`rowNumber` | Formats the cell with a row number column that is shown 1 to n no matter what the sort order is. |
|`date` | Formats date data as a date string in the desired format, by default it will use `dateStyle: 'short'` for other options you can pass them in with `column.formatOptions` |
|`time` | Formats date data as a time string in the desired format, by default it will use `timeStyle: 'short'` for other options you can pass them in with `column.formatOptions` |
|`decimal` | Formats number data as a decimal string in the specified locale. For additional options you can pass them in with `column.formatOptions`. |
|`integer` | Formats number data as a integer string in the specified locale. For additional options you can pass them in with `column.formatOptions`. |
|`selectionCheckbox` | Displays a checkbox column for selection when using `rowSelection="mixed"` or `rowSelection="multiple"`|
|`selectionRadio` | Displays a checkbox column for selection when using `rowSelection="single"` |
| `button` | Displays an `ids-button`. Other column settings like `type` can be used to set the button type as can `icon` by set for icon only buttons. Use the `click` setting/function to get an callback handler. |
| `hyperlink` | Displays an `ids-hyperlink`. Other column settings like `href` can be used to set the link href and `text` can be used to set the text to specific text. Use the `click` setting/function to get an callback handler. |
| `checkbox` | Displays an `ids-checkbox`. The value will be checked depending on if the attached field is true or `"true"`. |
| `badge` | Displays an `ids-badge`. The associated field will be placed in the badge. The `color` option can also be set to set the ids-badge color setting. |
| `alert` | Displays `ids-alert` element, and the field value will appear in a tooltip. An `icon` option can be provided as an override.|
| `color` | Displays `ids-color` element. If a `color` option is provided as an override, the field's value will appear in a tooltip. |
| `icon` | Displays the field value as an `ids-icon`. An `icon` option can be provided as an override, and the field value will appear beside this `icon` override. A `size` option can also be provided. |
| `favorite` | Displays the field value as a `star-filled` if true or `star-outlined` if false. A `size` option can be provided as an override. |
| `tag` | Displays the field value as an `ids-tag`. A `color` option can be provided as an override. |
| `progress` | Displays the field value as an `ids-progress`. A `text` option can be provided to customize the label. A `color` and `max` option can be provided as overrides. |
| `rating` | Displays the field value as an `ids-rating`. A `text` option can be provided to customize the label. A `color` and `max` option can be provided as overrides. |
| `slider` | Displays the field value as an `ids-slider`. A `text` option can be provided to customize the label. A `color`, `max`, `min` and `type` option can be provided as overrides. |
| `stepChart` | Displays the field value as an `ids-step-chart`. A `text` option can be provided to customize the label. A `color` and `max` option can be provided as overrides. |
| `image` | Displays the field value as an `ids-image`. A `text` option can be provided to the `alt` and `title` attributes. |

### Deprecated Formatters (Deprecated from 4.x)

- `Input` No longer suggested to use, use simple list instead or a Text Formatter.
- `Status, Color` No longer used, but badges can be used.
- `Placeholder` Can now be set on the column and used with other formatters
- `Ellipsis` Is now always enabled.
- `Readonly` Can now be set on the column and used with other formatters
- `Drilldown` Use button formatter with an icon.
- `Template` is now deprecated for performance reasons, use a custom formatter now.
- `ClassRange` Use column cssClass function or string
- `Autocomplete, Lookup, TargetedAchievement, ProcessIndicator, Spinbox, Fileupload, Dropdown, Colorpicker, Tree, SummaryRow, GroupFooterRow, GroupRow, Expander, Editor, Textarea, Actions, RowReorder` May be added later

## Custom Formatters

It is possible to create your own custom formatter. The idea behind the formatter is it takes the cell value and does processing on it to return the correct markup for the cell. The simplest custom formatter would be this example.

```js
columns.push({
  id: 'custom',
  name: 'Custom',
  field: 'price',
  formatter: (rowData: Record<string, unknown>, columnData: Record<string, any>) => {
    const value = `Custom: ${rowData[columnData.field] || '0'}`;
    return `<span class="text-ellipsis">${value}</span>`;
  }
});
```

To style a custom formatter you may need to add a css part for the element. For example:

```js
formatter: (rowData: Record<string, unknown>, columnData: Record<string, any>) => {
  const value = `${rowData[columnData.field] || ''}`;
  return `<a part="custom-link" href="#" class="text-ellipsis">${escapeHTML(value)}</a>`;
},
```

Then in the style sheet you add for you page you put the styles.

```css
ids-data-grid::part(custom-link) {
  color: #da1217;
}

ids-data-grid::part(custom-link):hover {
  color: #6c080b;
}
```

The formatter is then linked via the column on the formatter setting. When the grid cell is rendered the formatter function is called and the following arguments are passed in.

- `rowData` The current row's data from the data array.
- `columnData` The column object with all of the column configuration for this cell.

## Events

- `activecellchanged` Fires when the active cell changes with the keyboard or by click.
- `sorted` Fires when the sort column is changed.
- `selectionchanged` Fires any time the selection changes.
- `activationchanged` Fires any time the active row changes.
- `beforerowselected` Fires before each row is selected. You can veto the selection by returning false in the event response for example `e.detail.response(false);`
- `rowselected` Fires for each row that is selected.
- `beforerowdeselected` Fires before each row is deselected. You can veto the deselection by returning false in the event response for example `e.detail.response(false);`
- `rowdeselected` Fires for each row that is deselected.
- `rowactivated` Fires for each row that is activated.
- `rowdeactivated` Fires for each row that is deactivated.
- `rowclick` Fires for each row that is clicked.
- `dblclick` Fires each time double clicked on body cells or header cells. Based on where it clicked details can be capture like `type: 'body-cell'|'header-title'|'header-filter'` etc.
- `filtered` Fires after a filter action occurs, clear or apply filter condition.
- `filteroperatorchanged` Fires once a filter operator changed.
- `filterrowopened` Fires after the filter row is opened by the user.
- `filterrowclosed` Fires after the filter row is closed by the user.
- `columnresized` Fires when a column is resized or setColumnWidth is called.
- `columnmoved` Fires when a column is moved / reordered or moveColumn is called
- `beforetooltipshow` Fires before tooltip show, you can return false in the response to veto
- `rowExpanded` Fires when a tree or expandable row is expanded or collapsed
- `rowCollapsed` Fires when a tree or expandable row is expanded or collapsed
- `columnmoved` Fires when a column is moved / reordered or moveColumn is called.
- `beforetooltipshow` Fires before tooltip show, you can return false in the response to veto.
- `beforemenushow` Fires before context menu show, you can return false in the response to veto.
- `menushow` Fires after context menu show.
- `menuselected` Fires after context menu item selected.
- `settingschanged` Fires after settings are changed in some way.
- `scrollstart` Fires when data-grid reaches the topmost row.
- `scrollend` Fires when data-grid reaches the bottommost row.
- `afterrendered` Fires after rendered the data grid.

## Methods

- `setColumnWidth` Can be used to set the width of a column.
- `setColumnVisibility` Can be used to set the visibility of a column.
- `setActivateCell(cell, row)` Can be used to set focus of a cell.
- `selectedRows` Lists the indexes of the currently selected rows.
- `saveSetting(setting: string)` Save the given setting to local storage.
- `saveAllSettings` Save all user settings to local storage.
- `savedSetting(setting: string)` Get saved given setting value from local storage.
- `allSavedSettings` Get saved all user settings from local storage.
- `clearSetting(setting: string, key?: string)` Clear the given saved setting from local storage.
- `clearAllSettings(userKeys: unknown)` Clear saved all user settings from local storage.
- `restoreSetting(setting: string, value?: unknown)` Restore the given saved setting from local storage.
- `editFirstCell` Puts the first cell on the active row into edit mode.
- `appendData(data: Record<string, unknown>)` Use this to add more data to the datagrid's existing dataset.  This will automatically render additional rows in the datagrid.
- `addRow(data: Record<string, unknown>, index?: number)` Adds a new row at optional row index and defaults the values to all those provided in the data
- `addRows(data: Array<Record<string, unknown>>, index?: number)` Adds multiple new rows at optional row index and defaults the values to all those provided in the data
- `removeRow(index: number)` Removed the provided row index from the dataset and visual datagrid
- `clearRow(index: number)` Clears all values on the given row.
- `commitCellEdit` Stops editing and commits the value in the active editor.
- `cancelCellEdit` Stops editing and reverts the value in the active editor.
- `resetDirtyCells` Clears all dirty cell indicators.
- `dirtyCells` Gives a list of all currently dirty cells.
- `exportToExcel(format: 'csv' | 'xlsx', filename: string, keepGridFormatting: boolean)` Export datagrid datasource to an excel file. This keeps grid formatting by default.
- `collapseAll()` Collapse all expandable or tree rows.
- `expandAll()` Expand all expandable or tree rows.
- `toggleAll(opt: boolean)` Toggle collapse/expand all expandable or tree rows. `opt false`: will expand all, `opt: true`: will collapse all
- `refreshRow` IdsDataGridRow method to refresh row element and its cells.
- `refreshCell` IdsDataGridCell method to refresh cell element.
- `updateDataset(row: number, data: Record<string, unknonw>, isClear?: boolean)` Updates datasource for row.
- `updateDatasetAndRefresh(row: number, data: Record<string, unknonw>, isClear?: boolean)` Updates datasource for row and refreshes row/cells UI.
- `updateData(value: string, refresh = true)` IdsDataGridCell method to update datasource on a specific cell.
- `rowByIndex(rowIndex: number)` method to retrieve a specific row datagrid.
- `cellByIndex(rowIndex: number, columnIndex: number)` method to retrieve a specific cell from datagrid.
- `cellByIndex(columnIndex: number)` IdsDataGridRow method to retrieve a specific cell from row.

## Filters

Data rows can be filter based on one or several criteria. Whole filter row can turned on/off by the api setting `filterable` and can be disabled by the api setting `filter-row-disabled`. The filter conditions can be applied thru the UI or programmatically. Each column can have its own filter type and turn on/off by columns setting.

### Filter Columns Setting

All the filter settings can be passed thru columns data.

|Setting|Type|Description|
|---|---|---|
|`filterType` | Function | Data grid built-in filter method, see the dedicated section below. |
|`filterConditions` | Array | List of items to be use as operators in menu-button or options in dropdown. |
|`filterFunction` | Function | User defined filter method, it must return a boolean. |
|`filterOptions` | Object | Passes settings in for the filter component example: `label, placeholder, disabled, uppercase, maxlength`. |
|`isChecked` | Function | User defined filter method, it must return a boolean. This method use along built-in `checkbox` only, when filter data value is not boolean type. |

### Built-in Filter Methods

|Method|Description|
|---|---|
|`text` | It filter as text comparison. Contains input and menu-button with list of default operators. |
|`integer` | It filter as integer comparison. Contains input and menu-button with list of default operators. |
|`decimal` | It filter as decimal comparison. Contains input and menu-button with list of default operators. |
|`contents` | It filter as text comparison. Contains dropdown and auto generate list of items based on column data. |
|`dropdown` | It filter as text comparison. Contains dropdown and must pass list of item by setting `filterConditions`. |
|`checkbox` | It filter as boolean comparison. Contains menu-button with list of default operators. |
|`date` | It filter as date comparison. Contains date-picker and menu-button with list of default operators. |
|`time` | It filter as time comparison. Contains time-picker and menu-button with list of default operators. |

### Custom Filter

If the built-in filters are not enough, creating a custom filter is an option. There are two parts you can create both parts custom or mix-match with built-in.

1. `UI Only` In order to do custom UI part of filter, add as html markup thru a slot. It must use slot and column-id attributes for example: `<div slot="filter-n" column-id="n">...</div>` where n is the columnId same passed in the columns.
1. `filterFunction` This is a user defined filter method which must return a boolean. It determines if a cell value should be considered as a valid filtered value.
1. `disableClientFilter` This is an api setting to disable filter logic client side. It will set filter conditions and fire an event `filtered` which can listen for custom logic.

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
  filterConditions: [{
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
  filterConditions: [
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
  filterConditions: [
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
      <span class="audible">Greater Than Or Equals</span>
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

Disable client filter

```html
<ids-data-grid id="data-grid-1" label="Books" disable-client-filter="true">
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

dataGrid.addEventListener('filtered', (e: any) => {
  console.info('filtered:', e.detail);
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
- `filterrowopened` Fires after the filter row is opened by the user.
- `filterrowclosed` Fires after the filter row is closed by the user.

## Custom cell colors

In some cases, it may be desirable to customize the background color of cells.  This can be done with the `cssPart` column setting:

```js
const columns = [];
columns.push({
  id: 'text',
  name: 'Text',
  field: 'description',
  cssPart: 'custom-cell'
});
```

The `cssPart` property is translated into a `part` attribute that is applied to every cell in the column.  In the event the color needs to be conditional based on the row index or other logic, a function can be used:

```js
columns.push({
  // ...
  cssPart: (row: number) => ((row % 2 === 0) ? 'custom-cell-1' : 'custom-cell-2')
  // ...
});
```

After this is defined, accompanying CSS can be written to target the parts `custom-cell`, `custom-cell-1`, and `custom-cell-2` to change background color or other CSS properties of the cell:

```css
ids-data-grid::part(cell) {
  background-color: #ebf9f1;
}

ids-data-grid::part(cell-selected) {
  background-color: #c9dad0;
}
```

### Changing selected cell colors

Another column setting, `cellSelectedCssPart` can be used alongside `cssPart` to customize the selected color of the row in a similar way.  When using `mixed` selection, this color is also applied to activated rows:

```js
const columns = [];
columns.push({
  id: 'text',
  name: 'Text',
  field: 'description',
  cssPart: 'custom-cell',
  cellSelectedCssPart: 'custom-cell-selected'
});
```

This column setting can also be a function, just like `cssPart`:

```js
columns.push({
  // ...
  cssPart: (row: number) => ((row % 2 === 0) ? 'custom-cell-1' : 'custom-cell-2'),
  cellSelectedCssPart: (row: number) => ((row % 2 === 0) ? 'custom-cell-selected-1' : 'custom-cell-selected-2')
  // ...
});
```

## Tooltip Code Examples

Set suppress tooltips to turn off.

```html
<ids-data-grid id="data-grid-1" label="Books" suppress-tooltips>
</ids-data-grid>
```

Set custom tooltip strings.

```js
const columns = [];
columns.push({
  id: 'text',
  name: 'Text',
  field: 'description',
  tooltip: 'This is a product Id',
  headerTooltip: 'This is the product Id header title',
  headerIconTooltip: 'This is product Id header icon',
  filterButtonTooltip: 'This is the product Id filterButton'
});
```

Set tooltip as callback.

```js
const tooltipCallback = (args: any): string => {
  const { type, columnIndex, rowIndex, text } = args;

  if (type === 'header-title') {
    return `Text: ${text}<br/>Header Row: ${rowIndex}, Cell: ${columnIndex}`;
  } else if (type === 'filter-button') {
    return `Text: ${text}<br/>FilterButton Row: ${rowIndex}, Cell: ${columnIndex}`;
  }
  return `Text: ${text}<br/>for Row: ${rowIndex}, Cell: ${columnIndex}`;
};
const columns = [];
columns.push({
  id: 'text',
  name: 'Text',
  field: 'description',
  tooltip: tooltipCallback
});
```

Set tooltip custom options.

```js
const columns = [];
columns.push({
  id: 'text',
  name: 'Text',
  field: 'description',
  tooltipOptions: {
    placement: 'top',
    headerPlacement: 'top',
    headerIconPlacement: 'top',
    filterButtonPlacement: 'bottom',
    x: 0,
    y: 10,
    headerX: 0,
    headerIconX: 0,
    headerY: 10,
    headerIconY: 10,
    filterButtonX: 0,
    filterButtonY: 22
  }
});
```

Set tooltip options as callback.

```js
const tooltipOptionsCallback = (args: any): string => {
  const { type, columnIndex, rowIndex, text } = args;

  if (type === 'header-title') {
    return { headerPlacement: 'top', headerX: 0, headerY: 10 };
  } else if (type === 'header-icon') {
    return { headerIconPlacement: 'top', headerIconX: 0, headerIconY: 10 };
  } else if (type === 'filter-button') {
    return { filterButtonPlacement: 'bottom', filterButtonX: 0, filterButtonY: 22 };
  }
  return { placement: 'top', x: 0, y: 10 };
};
const columns = [];
columns.push({
  id: 'text',
  name: 'Text',
  field: 'description',
  tooltipOptions: tooltipOptionsCallback
});
```

Set tooltip custom css.

```js
const columns = [];
columns.push({
  id: 'text',
  name: 'Text',
  field: 'description',
  tooltipCssPart: 'custom-turquoise',
  headerTooltipCssPart: 'custom-turquoise',
  headerIconTooltipCssPart: 'custom-turquoise',
  filterButtonTooltipCssPart: 'custom-turquoise'
});
```
```css
/* tooltip css part `custom-turquoise` */
ids-data-grid::part(custom-turquoise-tooltip-arrow-top)::after {
  border-top-color: #2f8d8e;
}
ids-data-grid::part(custom-turquoise-tooltip-popup) {
  background-color: #2f8d8e;
}
```

Set tooltip custom css as callback.

```js
const tooltipCssPartCallback = (args: { type: string }): string => {
  const { type } = args;
  let cssPart = '';
  // Set random css part each time, for `body-cell` tooltips
  if (type === 'body-cell') {
    const parts = ['azure', 'ruby'];
    const randomIndex = Math.floor(Math.random() * parts.length);
    cssPart = parts[randomIndex];
  }
  return cssPart;
};
const columns = [];
columns.push({
  id: 'text',
  name: 'Text',
  field: 'description',
  tooltipCssPart: tooltipCssPartCallback
});
```
```css
/* tooltip css part `azure` */
ids-data-grid::part(azure-tooltip-arrow-top)::after {
  border-top-color: #0066d4;
}
ids-data-grid::part(azure-tooltip-popup) {
  background-color: #0066d4;
}

/* tooltip css part `ruby` */
ids-data-grid::part(ruby-tooltip-arrow-top)::after {
  border-top-color: #c31014;
}
ids-data-grid::part(ruby-tooltip-popup) {
  background-color: #c31014;
}
```

## context menu Code Examples

The context menus can be set via the dataset.

```html
<ids-data-grid id="data-grid-1" label="Books">
</ids-data-grid>
```
```js
// Dataset for header cells context menu
const headerMenuData = {
  id: 'grid-header-context menu',
  contents: [{
    id: 'header-actions-group',
    items: [
      { id: 'actions-split', value: 'actions-split', text: 'Split' },
      { id: 'actions-sort', value: 'actions-sort', text: 'Sort' },
    ]
  }],
};

// Dataset for body cells context menu
const menuData = {
  id: 'grid-context menu',
  contents: [{
    id: 'actions-group',
    items: [
      { id: 'item-1', value: 'item-1', text: 'Item One' },
      { id: 'item-2', value: 'item-2', text: 'Item Two' },
      { id: 'item-3', value: 'item-3', text: 'Item Three' }
    ]
  }],
};

// Set context menu data with data-grid
dataGrid.menuData = menuData;
dataGrid.headerMenuData = headerMenuData;

// Set to return true/false in the response to veto before context menu show.
dataGrid.addEventListener('beforemenushow', (e: any) => {
  console.info('before context menu show', e.detail);
  // e.detail.response(false);
});

// Set to watch after context menu show.
dataGrid.addEventListener('menushow', (e: any) => {
  console.info('After context menu show', e.detail);
});

// Set to watch after context menu item selected.
dataGrid.addEventListener('menuselected', (e: any) => {
  console.info('context menu item selected', e.detail);
});
```

Set context menu thru Slot.

```html
<ids-data-grid id="data-grid-1" label="Books">
  <!-- context menu header cells -->
  <ids-popup-menu trigger-type="custom" slot="header-context menu">
    <ids-menu-group>
      <ids-menu-item value="header-split">Split</ids-menu-item>
      <ids-menu-item value="header-sort">Sort</ids-menu-item>
    </ids-menu-group>
  </ids-popup-menu>
  <!-- context menu body cells -->
  <ids-popup-menu trigger-type="custom" slot="context menu">
    <ids-menu-group>
      <ids-menu-item value="item-1">Item One</ids-menu-item>
      <ids-menu-item value="item-2">Item Two</ids-menu-item>
      <ids-menu-item value="item-3">Item Three</ids-menu-item>
      <ids-menu-item value="item-4">Item Four</ids-menu-item>
    </ids-menu-group>
  </ids-popup-menu>
</ids-data-grid>
```

Set context menu thru ID.

```html
<ids-data-grid
  header-menu-id="grid-header-context menu"
  menu-id="grid-context menu"
  id="data-grid-1"
  label="Books"
></ids-data-grid>

<!-- context menu header cells -->
<ids-popup-menu trigger-type="custom" id="grid-header-context menu">
  <ids-menu-group>
    <ids-menu-item value="header-split">Split</ids-menu-item>
    <ids-menu-item value="header-sort">Sort</ids-menu-item>
  </ids-menu-group>
</ids-popup-menu>

<!-- context menu body cells -->
<ids-popup-menu trigger-type="custom" id="grid-context menu">
  <ids-menu-group>
    <ids-menu-item value="item-1">Item One</ids-menu-item>
    <ids-menu-item value="item-2">Item Two</ids-menu-item>
    <ids-menu-item value="item-3">Item Three</ids-menu-item>
    <ids-menu-item value="item-4">Item Four</ids-menu-item>
  </ids-menu-group>
</ids-popup-menu>
```

## Empty Message

Set empty message thru slot (markup).

```html
<ids-data-grid id="data-grid-em-thru-slot" label="Books">
  <ids-empty-message hidden icon="empty-search-data-new" slot="empty-message">
    <ids-text type="h2" font-size="20" label="true" slot="label">No Data</ids-text>
    <ids-text hidden label="true" slot="description">There is No data available.</ids-text>
  </ids-empty-message>
</ids-data-grid>
```

Set empty message thru settings (markup).

```html
<ids-data-grid
  id="data-grid-em-thru-settings"
  label="Books"
  empty-message-icon="empty-error-loading-new"
  empty-message-label="No Data"
  empty-message-description="There is No data available."
></ids-data-grid>
```

Set empty message thru settings (javascript).

```html
<ids-data-grid id="data-grid-em-thru-settings-js" label="Books">
</ids-data-grid>
```

```js
const dataGrid = document.querySelector('#data-grid-em-thru-settings-js');
dataGrid.emptyMessageIcon = 'empty-error-loading-new';
dataGrid.emptyMessageLabel = 'No Data';
dataGrid.emptyMessageDescription = 'There is No data available.';
```

## Row Height

As mentioned in the settings section you can change the row height by setting the rowHeight option.

```html
     <ids-data-grid id="data-grid-row-height" row-height="md"></ids-data-grid>
```

Its worth mentioning the characteristics and usage for each one.

Large (`row-height="lg"`) - Row Height is 50. The default row height, header is 16px and body cells are 16px. 16px padding on cells and header. You should use this most of the time if there is plenty of room on the UI and to avoid the UI looking crowded.
Medium (`row-height="md"`) - Row Height is 40. Header is 16px and body cells are 16px. 12px padding on cells and header. If you need to see a few more rows but still want to avoid a crowded UI, this is the next best option.
Small (`row-height="sm"`) - Row Height is 35. Header is 16px and body cells are 16px. 8px padding on cells and header. This is the smallest option that is recommended for readability and spacing.
Extra Small (`row-height="xs"`) - Row Height is 30. Header is 14px and body cells are 14px. 8px padding on cells and header. If you need a very compressed data grid with a lot of data you can use this option. But there is a trade off of bad readability and spacing.
Extra Extra Small (`row-height="xxs"`) - Row Height is 25. Header is 14px and body cells are 14px. 2px padding on cells and header. Avoid this option as it is very crowded but it is included for edge cases.

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
- Checked/Not Checked (Checkboxes)

## Keyboard Guidelines

- <kbd>Tab</kbd>The initial tab enters the grid with focus on the first cell of the first row, often a header. A second tab moves out of the grid to the next tab stop on the page. Once focus is established in the grid, a TAB into or a Shift Tab into the grid will return to the cell which last had focus. If in edit mode will finish editing and start editing the next cell.
- <kbd>Shift + Tab</kbd> Moves the reverse of tab. If in edit mode will finish editing and start editing the previous cell.
- <kbd>Left</kbd> and <kbd>Right</kbd> Move focus to the adjacent column's cell. There is no wrap at the end or beginning of columns.
- <kbd>Up</kbd> and <kbd>Down</kbd> Move focus to the adjacent row's cell. There is no wrap at the first or last row.
- <kbd>Home</kbd> moves focus to the first cell of the current row
- <kbd>End</kbd> moves focus to the last cell of the current row
- <kbd>Page Up</kbd> moves focus to the first cell in the current column
- <kbd>Page Down</kbd> moves focus to the last cell in the current column
- <kbd>Space</kbd> Toggles selection the activate row. If suppressRowDeselection is set it will be ignored on deselect. If the cell contains an expandable element then the row will toggle the expanded state. If the cell contains a checkbox editor, will toggle the checkbox state.
- <kbd>F2</kbd> toggles actionable mode. Pressing the <kbd>Tab</kbd> key while in actionable mode moves focus to the next actionable cell. While in actionable mode you can do things like type + enter. This will move you down a row when you hit enter. If the cell has a control that uses down arrow (like the drop downs or lookups that are editable). Then the user needs to hit enter to enable the edit mode on that cell.
- <kbd>Triple Click</kbd> Not a keyboard shortcut, but if you have text in a cell that is overflowed a triple click will select all the text even the part that is invisible.
- <kbd>Ctrl+A (PC) / Cmd+A (Mac)</kbd> If the grid is mixed or multi select this will select all rows.
- <kbd>Ctrl+A (PC) / Cmd+A (Mac)</kbd> If the grid is mixed or multi select this will select all rows.
- <kbd>Enter</kbd> Activates edit mode on the cell if it is editable. There is also an "auto edit detection". If the user starts typing then edit mode will happen automatically without enter. If in edit mode already <kbd>Enter</kbd> will finish edit mode. If `editNextOnEnterPress` is enabled then editing will start on the same column in next row.
- <kbd>Shift + Enter</kbd> Same as enter but if `editNextOnEnterPress` is enabled then editing will start on the same column in previous row.
- <kbd>F2</kbd> Finish editing same as Enter. But if `editNextOnEnterPress` is enabled, will stay in same cell. `cancelEditMode` will fire.
- <kbd>CMD/CTRL + Enter</kbd> Finish editing same as Enter.
- <kbd>ESC</kbd> Revert to the previous value and cancel editing. `cancelEditMode` will fire.

## Responsive Guidelines

- By default, data grid grows depending on the amount of contents within and will scroll if necessary under the header. It stops growing when it reaches the size of the parent container.
- `autoFit` property or `auto-fit` attribute can be set manually to make the data grid size fill and be responsive to the size of the screen, regardless of the amount of contents.

## Converting from Previous Versions (Breaking Changes)

**3.x to 4.x**
- Counts have all new markup and classes.

**4.x to 5.x**
- Data grid has all new markup and a custom element but some similarly named options
- Still uses same columns and data set options. Some column options enhanced and changed.
- If using events events are now plain JS events for example: sorted, rendered
- Some Api Functions have changed
- If using properties/settings these are now attributes or as plain properties for example: data, virtual-scroll
- Markup has changed to a custom element `<ids-data-grid></ids-data-grid>`
- Can now be imported as a single JS file and used with encapsulated styles
- `Drill Down` Formatter is now covered by `Button` formatter with `icon="drilldown"`
- `textOverflow` setting is now by default
- `rowNavigation` setting has replaced `cellNavigation`. Cell navigation is the default behavior.
- `stretchColumn` is now more flexible and can be achieved by setting a column width to `minmax(130px, 4fr)`. I.E. some min width and a `fr` unit equal to the remaining number of columns (or similar variations).
- split columns are not supported anymore but could be done with a custom formatter if needed
- `frozenColumns` setting is now set on each column by adding `frozen: 'left'` or `frozen: 'right'` to the column definition.
- Some events are renamed see the events section for more details, also the signature of the events has changed.
- Custom formatter functions can now be any type of function and have a different signature.
- The `expanded` column option for tree was renamed to `rowExpanded`.
- The `expandrow/collapserow` events are renamed to `rowexpanded/rowcollapsed`
- The `beforeentereditmode/entereditmode/exiteditmode` event is renamed to `beforecelledit/celledit/endcelledit/cancelcelledit`
- The `actionablemode` feature has been replaced with simply tabbing to the next editable field when in edit mode.

## Accessibility Guidelines

1.1.1 Non-text Content - All images, links and icons have text labels for screen readers when the formatters are used.
- 1.4.3 Contrast (Minimum) - The visual presentation of text and links and images of text has a contrast ratio of at least 4.5:1.
- 2.1.1 Keyboard - Make all functionality available from a keyboard. The grid has keyboard shortcuts and is usable with a screen reader due to the addition of aria tags.
- A datagrid in general including this one uses the following aria tags
  - `aria-label` labels the enter table on the main table
  - `aria-rowcount` lists the visible row count on the main table
  - `aria-colindex` the index of each column on the column elements
  - `aria-rwindex` the index of each row on the row elements
  - `aria-setsize` for tree grid lists the number of elements in each level (group)
  - `aria-level` the level of indentation
  - `aria-posinset` the depth into each set
  - `aria-expanded` on the row it indicates if the row is expanded (for tree and expandable row)
  - `aria-sort` indicates the sort direction on the sortable columns
  - `aria-checked` indicates if the element is checked on checkbox columns and headers

## Regional Considerations

Titles and labels should be localized in the current language. All elements will flip to the alternate side in Right To Left mode. Consider that in some languages text may be a lot longer (German). And in some cases it cant be wrapped (Thai). For some of these cases text-ellipsis is supported.

## Code Separation (For Developers)

The code is divided into several files. Here is a description of where everything is.

- `ids-data-grid-cell.ts` creates a non-shadow root `ids-data-grid-cell`, and handles its own selection, and activation.
- `ids-data-grid-cell.scss` contains all css related to `.ids-data-grid-cell` and its children
- `ids-data-grid-contextmenu.ts` contains code in the form of export functions, that adds ability to get right click menus on headers and cells
- `ids-data-grid-filter.scss` contains all css related to the filter row and its children
- `ids-data-grid-filter.ts` contains code to implement the filtering functionality and its ui (some functions are in ids-data-source)
- `ids-data-grid-formatters.ts` contains all formatter functions and some supporting code like data extraction
- `ids-data-grid-header.ts` contains most header functionality, the header template, and code related to header actions like sort, reorder and selection.
- `ids-data-grid-header.scss` contains all css related to `.ids-data-grid-header` and its children
- `ids-data-grid-row.ts` contains most row functionality, the row template, and code related to row actions like expand, collapse, select, activate
- `ids-data-grid-row.scss` contains all css related to `.ids-data-grid-row` and its children
- `ids-data-grid-tooltip-mixin.js` contains a tooltip mixin that adds tooltip functionality to cells and headers, its different from `ids-tooltip-mixin` (more specific)
- `ids-data-grid.js` contains all main data grid code, the api and settings and the main generator loop for the data grid
