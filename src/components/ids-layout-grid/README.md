# Ids Layout Grid Component

## Description

The Ids Layout Grid is comprised of 2 web components, IdsLayoutGrid and IdsLayoutGridCell. IdsLayoutGrid is the parent grid container in which the columns and rows are defined. IdsLayoutGridCell is a child element of Layout Grid. These elements contain the contents of your UI and can span multi columns or rows and be positioned along the tracks of the Layout Grid. A Layout Grid can also be nested inside a Layout Grid Cell.

## Use Cases

- Use to create full page layouts (i.e Header, Sidebar, Main Content, Footer).
- Use to layout complex forms
- Use to layout a list of IdsCards

## Attributes

IdsLayoutGrid
- AutoFit
- AutoFill
- Cols
- ColsXs
- ColsSm
- ColsMd
- ColsLg
- ColsXl
- ColsXxl
- Rows
- RowsXs
- RowsSm
- RowsMd
- RowsLg
- RowsXl
- RowsXxl
- RowHeight
- MinColWidth
- MaxColWidth
- MinRowHeight
- MaxRowHeight
- Gap
- Margin
- Padding
- PaddingX
- PaddingY
- JustifyContent
- Flow

IdsLayoutGridCell
- ColSpan
- ColSpanXs
- ColSpanSm
- ColSpanMd
- ColSpanLg
- ColSpanXl
- ColSpanXxl
- ColStart
- ColStartXs
- ColStartSm
- ColStartMd
- ColStartLg
- ColStartXl
- ColStartXxl
- ColEnd
- ColEndXs
- ColEndSm
- ColEndMd
- ColEndLg
- ColEndXl
- ColEndXxl
- Editable
- Fill
- Height
- MinHeight
- Order
- OrderXs
- OrderSm
- OrderMd
- OrderLg
- OrderXl
- OrderXxl
- RowSpan
- RowSpanXs
- RowSpanSm
- RowSpanMd
- RowSpanLg
- RowSpanXl
- RowSpanXxl
- Sticky
- StickyPosition

## Terminology

- **Grid**: In our case a grid is the container that holds a grid and has the `display: grid` property set on it. We refer to this as `ids-layout-grid`.
- **GridCell** Any direct child of a grid container, we refer to this as `ids-layout-grid-cell`.
- **Cols** These are the vertical columns of the grid, also referred to as tracks.
- **Rows** The horizontal tracks of the grid.
- **MinColWidth** This sets the minimum col width in the grid.
- **MaxColWidth** This sets the minimum col width in the grid.
- **Breakpoints**:

```html
XXL: 1440px
XL: 1280px
L: 1024px
M: 840px
S: 600px
XS: 360px
```

## Features (With Code Examples)

For AutoFit layout the grid cells have a min/max value of 100px and 1fr respectively. The cells will take up as much space as is available until they reach the threshold of the MinColWidth, then they will automatically shift until they reach that threshold again. This removes the need for media queries in many cases.

```html
<ids-layout-grid
    auto-fit="true"
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

An Ids Layout Grid with a custom number of columns or rows. The example below shows a 4 column grid where the first cell spans 3 columns and the 3rd cell spans 2 rows.

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
<div class="grid grid-cols-3">
  <div class="grid-cell col-span-2 fill"><ids-text font-size="12">A</ids-text></div>
  <div class="grid-cell fill"><ids-text font-size="12">B</ids-text></div>
</div>
```

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
