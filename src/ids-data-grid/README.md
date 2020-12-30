# Ids Data Grid

## Description

The datagrid component (ids-data-grid) is used to arrange tabular data in rows and columns for easier scanning and comparison. Datagrids are very configurable in both design and functionality and they can be found within almost every product/app.

You should pass an array of objects in to the grid on the `dataset` object. Also pass the `columns` array for the column information. There are a number of events described in the events and API section, as well as the column settings.

A Read-Only Datagrid uses "Formatters" to render cell content. A number of these are listed in the API section and it is possible to create your own.

## Use Cases

- The datagrid component is most useful when it is used for categorically sorting dense and repetitive information. Each individual item is listed down the Y axis of the chart, and their shared attribute categories are listed along the X axis. The resulting cells are filled with information that is relevant to the corresponding item and attribute.

## Terminology

- **Datagrid Title**: The name of the datagrid optionally appearing above the grid and describing the contents.
- **Options**: An optionaly actions menu button with datagrid functionality that operates on the entire datagrid contents.
- **Cell**: Body elements of the datagrid that contain an object's value or attribute. Cells should only contain one type of content or it can be confusing and hurt accessibility.
- **Header Cell**: These cells contain the names of the columns in the grid and related functions like filtering and sorting. All cells below the header cell will hold values related to the attribute in the header cell.
- **Column**: Cells stacked vertically that contain values relate to the attribute found on the top header cell.
- **Row**: Each row contains one cell per column in the DataGrid, and each cell displays a single value in the bound data item.

## Features (With Code Examples)

A datagrid is created by adding an `ids-data-grid` html element in the page and setting the options either inline in the markup or in the JS part of the code. You can only use simple types (string, boolean ect) for inline markup so passing the data and column arrangement is always done in the JS part. The data will be an array of objects so its in the correct tabular form. The columns are also an array of object but with defined options and types. (See Columns in next section)

```html
<ids-data-grid id="data-grid-1" data-automation-id="data-grid-1-automation" alternate-row-shading="true"></ids-card>

<script>
    const dataGrid = document.querySelector('#data-grid-1');

    dataGrid.data = dataset;
    dataGrid.columns = columns;
</script>
```

## Settings and Attributes

When used as an attribute the settings are kebab case, when used in the JS they are camel case.

- `virtualScroll` {boolean} When virtual scroll is used the grid can render many thousands of rows and only the rows visible in the scroll area are rendered for performance. This setting has limitations such as the rows need to be fixed size.
- `alternateRowShading` {boolean} For better scan-ability you can shade alternate rows.

## Column Settings (General)

|Setting|Description|
|---|---|
|`id` | The unique id of the column. Each column in the grid should have some unique id.|
|`sortable` | If false, the column cannot be sorted.|
|`resizable` | If false the column will not be resizable, thus is a fixed size and can never be changed by the user by dragging the left and right edge.|
|`formatter` | Controls how the data is rendered in the cell.|
|`align` | Can be `left` or `right` or `center`. Note that `center` has limited column type support.|
|`width` | The column width, this can be an integer for pixel width or a percent fx `10%`, if left off the columns will be sized to contents and to fit the width of the grid using the internal algorithm.|

## Formatters

|Formatter|Description|
|---|---|
|`text` | Formats the column value as a direct text element using toString in the grid cell, Undefined or Null values will be shown as empty.|

## States and Variations

**Rows**
- Hover
- Selected
- Disabled
- Readonly

**Columns**
- Focus
- Hover
- Sorted
- All Selected or Not
- Disabled
- Filtered

**Cells**
- Hover (sometimes)
- Selected (inherited from row)
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
- <kbd>F2</kbd> toggles actionable mode. Pressing the <kbd>Tab</kbd> key while in actionable mode moves focus to the next actionable cell. While in actionable mode you can do things like type + enter. This will move you down a row when you hit enter. If the cell has a control that uses down arrow (like the dropdowns or lookups that are editable). Then the user needs to hit enter to enable the edit mode on that cell.
- <kbd>Triple Click</kbd> Not a keyboard shortcut, but if you have text in a cell that is overflowed a triple click will select all the text even the part that is invisible.
- <kbd>Ctrl+A (PC) / Cmd+A (Mac)</kbd> If the grid is mixed or multiselect this will select all rows.

## Responsive Guidelines

- Datagrid will size in width and height to the parent container and scroll if necessary under the header.

## Converting from Previous Version

- Datagrid has all new markup and a custom element but similarly named options
- Still uses same columns and data set options. Some column options enhanced and changed.
- Uses normal native events
- Some Api Functions have changed

## Proposed Changes

- Remove isList version

## Accessibility Guidelines

1.1.1 Non-text Content - All images, links and icons have text labels for screen readers when the formatters are used.
- 1.4.3 Contrast (Minimum) - The visual presentation of text and links and images of text has a contrast ratio of at least 4.5:1.
- 2.1.1 Keyboard - Make all functionality available from a keyboard. The grid has keyboard shortcuts and is usable with a screen reader due to the addition of aria tags.

## Regional Considerations

Titles and labels should be localized in the current language. All elements will flip to the alternate side in Right To Left mode. Consider that in some languages text may be a lot longer (German). And in some cases it cant be wrapped (Thai). For some of these cases text-ellipsis is supported.
