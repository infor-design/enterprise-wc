# Ids Layout Grid Component

## Description

The Ids Layout Grid is comprised of 2 web components, IdsLayoutGrid and IdsLayoutGridCell. IdsLayoutGrid is the parent grid container in which the columns and rows are defined. IdsLayoutGridCell is a child element of Layout Grid. These elements contain the contents of your UI and can span multi columns or rows and be positioned along the tracks of the Layout Grid. A Layout Grid can also be nested inside a Layout Grid Cell.

## Use Cases

- Use to create full page layouts (i.e Header, Sidebar, Main Content, Footer).
- Use to layout complex forms
- Use to layout a list of IdsCards

## Attributes

### IdsLayoutGrid
- **AutoFit**: Automatically adjust the width or height of a cell, row, or column to fit its contents.
- **AutoFill**: Automatically fill a range of cells with a pattern or sequence.
- **Cols**: Specifies the number of columns by default in the grid.
- **ColsXs**: Specifies the number of columns to use on extra small screens.
- **ColsSm**: Specifies the number of columns to use on small screens.
- **ColsMd**: Specifies the number of columns to use on medium screens.
- **ColsLg**: Specifies the number of columns to use on large screens.
- **ColsXl**: Specifies the number of columns to use on extra large screens.
- **ColsXxl**: Specifies the number of columns to use on extra-extra large screens.
- **Rows**: Specifies the number of rows by default in the grid.
- **RowsXs**: Specifies the number of rows to use on extra small screens.
- **RowsSm**: Specifies the number of rows to use on small screens.
- **RowsMd**: Specifies the number of rows to use on medium screens.
- **RowsLg**: Specifies the number of rows to use on large screens.
- **RowsXl**: Specifies the number of rows to use on extra large screens.
- **RowsXxl**: Specifies the number of rows to use on extra-extra large screens.
- **RowHeight**: Specifies the height of a row in the grid.
- **MinColWidth**: Specifies the minimum width of a column in a grid.
- **MaxColWidth**: Specifies the maximum width of a column in a grid.
- **MinRowHeight**: Specifies the minimum height of a row in a grid.
- **MaxRowHeight**: Specifies the maximum height of a row in a grid.
- **Gap**: Specifies the size of the gap between cells in a grid. If not assigned defaults to `md`.
- **Margin**: Specifies the amount of space between a grid and its outer border.
- **MarginY**: Specifies the amount of vertical space between a grid and its outer border.
- **MaxWidth**: Specifies the maximum width of a grid and its outer border. Allows for setting the max-width attribute with predefined values (see Breakpoints) or custom values that end with 'px', providing flexibility for styling and dynamic updates.
- **Padding**: Specifies the amount of space between a grid content and its inner border.
- **PaddingX**: Specifies the amount of horizontal space between a grid content and its inner border.
- **PaddingY**: Specifies the amount of vertical space between a grid and its inner border.
- **JustifyContent**: Specifies how to align the items in a grid along the main axis. If not assigned defaults to `start`.
- **Flow**: Specifies how the items in a grid should wrap or overflow when there isn't enough space.

### IdsLayoutGridCell
- **ColSpan**: Specifies the number of columns a cell should span by default in a grid.
- **ColSpanXs**: Specifies the number of columns a cell should span on extra small screens.
- **ColSpanSm**: Specifies the number of columns a cell should span on small screens.
- **ColSpanMd**: Specifies the number of columns a cell should span on medium screens.
- **ColSpanLg**: Specifies the number of columns a cell should span on large screens.
- **ColSpanXl**: Specifies the number of columns a cell should span on extra large screens.
- **ColSpanXxl**: Specifies the number of columns a cell should span on extra-extra large screens.
- **ColStart**: Specifies the starting column for a cell by default in a grid.
- **ColStartXs**: Specifies the starting column for a cell on extra small screens.
- **ColStartSm**: Specifies the starting column for a cell on small screens.
- **ColStartMd**: Specifies the starting column for a cell on medium screens.
- **ColStartLg**: Specifies the starting column for a cell on large screens.
- **ColStartXl**: Specifies the starting column for a cell on extra large screens.
- **ColStartXxl**: Specifies the starting column for a cell on extra-extra large screens.
- **ColEnd**: Specifies the ending column for a cell by default in a grid.
- **ColEndXs**: Specifies the ending column for a cell on extra small screens.
- **ColEndSm**: Specifies the ending column for a cell on small screens.
- **ColEndMd**: Specifies the ending column for a cell on medium screens.
- **ColEndLg**: Specifies the ending column for a cell on large screens.
- **ColEndXl**: Specifies the ending column for a cell on extra large screens.
- **ColEndXxl**: Specifies the ending column for a cell on extra-extra large screens.
- **Editable**: Specifies whether the content of an element can be edited by the user.
- **Fill**: Specifies whether an element should fill the available space in its container.
- **Height**: Specifies the height of an element.
- **MinHeight**: Specifies the minimum height of an element.
- **Order**: Specifies the order in which an element should appear by default in a container.
- **OrderXs**: Specifies the order in which an element should appear on extra small screens.
- **OrderSm**: Specifies the order in which an element should appear on small screens.
- **OrderMd**: Specifies the order in which an element should appear on medium screens.
- **OrderLg**: Specifies the order in which an element should appear on large screens.
- **OrderXl**: Specifies the order in which an element should appear on extra large screens.
- **OrderXxl**: Specifies the order in which an element should appear on extra-extra large screens.
- **RowSpan**: Specifies the number of rows a cell should span by default in a grid.
- **RowSpanXs**: Specifies the number of rows a cell should span on extra small screens.
- **RowSpanSm**: Specifies the number of rows a cell should span on small screens.
- **RowSpanMd**: Specifies the number of rows a cell should span on medium screens.
- **RowSpanLg**: Specifies the number of rows a cell should span on large screens.
- **RowSpanXl**: Specifies the number of rows a cell should span on extra large screens.
- **RowSpanXxl**: Specifies the number of rows a cell should span on extra-extra large screens.
- **Sticky**: Specifies whether an element should be "stuck" to a viewport

## Responsive Breakpoints

- **XS**: 360px
- **S**: 600px
- **MD**: 840px
- **LG**: 1024px
- **XL**: 1280px
- **XXL**: 1440px

**Example Usage**
## Features (With Code Examples)

```html
<ids-layout-grid cols="2" cols-lg="4" cols-xl="6" cols-xxl="8">
```

This `<ids-layout-grid>` element has four attributes (cols, cols-lg, cols-xl, and cols-xxl) that are used to define the number of columns in the grid layout at different breakpoint sizes. The `cols` attribute sets the number of columns in the grid layout by default. The `cols-lg` attribute sets the number of columns in the grid layout at the lg breakpoint size (large devices/screen sizes). The `cols-xl` attribute sets the number of columns in the grid layout at the xl breakpoint size (extra-large devices/screen sizes).

Finally, the `cols-xxl` attribute sets the number of columns in the grid layout at the xxl breakpoint size (extra-extra-large devices/screen sizes). Overall, this code is defining a grid layout that will display two columns by default and adjust the number of columns displayed at different breakpoint sizes for different device types.

---

```html
<ids-layout-grid-cell col-span="2" col-span-lg="4">
```

This `<ids-layout-grid-cell>` element is used to define a cell within a grid layout. It has two attributes (`col-span` and `col-span-lg`) that define the number of columns a cell should span at different breakpoint sizes. The `col-span` attribute sets the number of columns that the cell should span by default. The `col-span-lg` attribute sets the number of columns that the cell should span at the lg breakpoint size (large devices) and its value is set to 4. Overall, this code is defining a cell within a grid layout that will span two columns by default and adjust the number of columns it spans at the lg breakpoint size.

---

```html
<ids-layout-grid
    auto-fit
    min-col-width="100px"
    max-col-width="1fr"
>
   <ids-layout-grid-cell fill></ids-layout-grid-cell>
   <ids-layout-grid-cell fill></ids-layout-grid-cell>
   <ids-layout-grid-cell fill></ids-layout-grid-cell>
   <ids-layout-grid-cell fill></ids-layout-grid-cell>
   <ids-layout-grid-cell fill></ids-layout-grid-cell>
   <ids-layout-grid-cell fill></ids-layout-grid-cell>
   <ids-layout-grid-cell fill></ids-layout-grid-cell>
   <ids-layout-grid-cell fill></ids-layout-grid-cell>
</ids-layout-grid>
```

For AutoFit layout the grid cells in this example have a min/max value of 100px and 1fr respectively. The cells will take up as much space as is available until they reach the threshold of the MinColWidth, then they will automatically shift until they reach that threshold again. This removes the need for media queries in many cases.

---

```html
<ids-layout-grid cols="4">
   <ids-layout-grid-cell col-span="3" fill></ids-layout-grid-cell>
   <ids-layout-grid-cell fill></ids-layout-grid-cell>
   <ids-layout-grid-cell row-span="2" fill></ids-layout-grid-cell>
   <ids-layout-grid-cell fill></ids-layout-grid-cell>
   <ids-layout-grid-cell fill></ids-layout-grid-cell>
   <ids-layout-grid-cell fill></ids-layout-grid-cell>
   <ids-layout-grid-cell fill></ids-layout-grid-cell>
   <ids-layout-grid-cell fill></ids-layout-grid-cell>
</ids-layout-grid>
```

An Ids Layout Grid with a custom number of columns or rows. The example above shows a 4 column grid where the first cell spans 3 columns and the 3rd cell spans 2 rows.

---

```html
<ids-layout-grid
    id="eight-column-grid"
    cols="8"
    padding-x="md"
    justify-content="center"
    max-width="lg"
    margin="auto"
>
    <ids-layout-grid-cell col-span="1" fill height="176px">
        <ids-text font-size="12">1 Col</ids-text>
    </ids-layout-grid-cell>
    <ids-layout-grid-cell col-span="1" fill height="176px">
        <ids-text font-size="12">1 Col</ids-text>
    </ids-layout-grid-cell>
    <ids-layout-grid-cell col-span="1" fill height="176px">
        <ids-text font-size="12">1 Col</ids-text>
    </ids-layout-grid-cell>
    <ids-layout-grid-cell col-span="1" fill height="176px">
        <ids-text font-size="12">1 Col</ids-text>
    </ids-layout-grid-cell>
</ids-layout-grid>
```

Above is an example of a contained and centered grid. The max-width attribute is set to "lg", which represents a predefined breakpoint value for the maximum width of the grid. This controls how wide the grid can become. The margin attribute is set to "auto" to horizontally center the entire grid on the page by applying equal left and right margins.

*Note*:
The available sizes for maxWidth are based on the current predefined breakpoint sizes. These breakpoint sizes provide convenient options for setting the maximum width of the grid, ensuring responsiveness and compatibility with different screen sizes. However, the maxWidth attribute also allows users to specify a custom width if needed, giving them flexibility in defining the maximum width according to their specific requirements. While custom widths can be used, it is generally recommended to utilize the predefined breakpoint sizes whenever possible for consistency and responsiveness across different devices and viewports.

---

Examples of grid with responsive col-spans

```html
<ids-layout-grid
    cols="12"
>
  <ids-layout-grid-cell col-span="12" col-span-sm="6" fill>
    <ids-text font-size="12">2 Cols</ids-text>
  </ids-layout-grid-cell>
  <ids-layout-grid-cell col-span="12" col-span-sm="6" col-span-md="4" fill>
    <ids-text font-size="12">2 Cols</ids-text>
  </ids-layout-grid-cell>
</ids-layout-grid>
```

--

Nested Grid. An IdsLayoutGrid component can be nested inside an IdsLayoutGridCell.

```html
<ids-layout-grid cols="4">
   <ids-layout-grid-cell col-span="3" fill></ids-layout-grid-cell>
   <ids-layout-grid-cell fill></ids-layout-grid-cell>
   <ids-layout-grid-cell row-span="2" fill></ids-layout-grid-cell>
   <ids-layout-grid-cell fill></ids-layout-grid-cell>
   <ids-layout-grid-cell fill>
      <ids-layout-grid auto>
        <ids-layout-grid-cell fill></ids-layout-grid-cell>
        <ids-layout-grid-cell fill></ids-layout-grid-cell>
        <ids-layout-grid-cell fill></ids-layout-grid-cell>
      </ids-layout-grid>
   </ids-layout-grid-cell>
   <ids-layout-grid-cell fill></ids-layout-grid-cell>
   <ids-layout-grid-cell fill></ids-layout-grid-cell>
   <ids-layout-grid-cell fill></ids-layout-grid-cell>
</ids-layout-grid>
```

Standalone CSS Example

```html
<div class="ids-layout-grid ids-layout-grid-cols-3">
  <div class="ids-layout-grid-cell ids-layout-grid-col-span-2 fill"><ids-text font-size="12">A</ids-text></div>
  <div class="ids-layout-grid-cell fill"><ids-text font-size="12">B</ids-text></div>
</div>
```

--
## Keyboard Guidelines

A layout grid is not on its own keyboard focusable and has no keyboard interaction.

## Responsive Guidelines

- A Layout Grid set to auto-fit or auto-fill will flow automatically with the screen size.

## Converting from Previous Versions (Breaking Changes)

**3.x to 4.x**

- New concept in 4.x

**4.x to 5.x**

- The Layout grid replaces the former grid entirely. Apply the new markup.
- Using a 8pt style grid https://builttoadapt.io/intro-to-the-8-point-grid-system-d2573cde8632
- Markup has changed to a custom element `<ids-layout-grid></ids-layout-grid>` (see examples above)
- Can now be imported as a single JS file and used with encapsulated styles

## Regional Considerations

The entire grid will flip direction in Right-To-Left languages.
