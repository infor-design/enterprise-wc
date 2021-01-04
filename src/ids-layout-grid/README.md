# Ids Layout Grid Component

## Description

The Ids Layout Grid is comprised of 2 web components, IdsLayoutGrid and IdsLayoutGridCell. IdsLayoutGrid is the parent grid container in which the columns and rows are defined. IdsLayoutGridCell is a child element of Layout Grid. These elements contain the contents of your UI and can span multi columns or rows and be positioned along the tracks of the Layout Grid. A Layout Grid can also be nested inside a Layout Grid Cell.

## Use Cases

- Use to create full page layouts (i.e Header, Sidebar, Main Content, Footer).
- Use to layout complex forms
- Use to layout a list of IdsCards

## Terminology

Grid: In our case a grid is the container that holds a grid and has the `display: grid` property set on it. We refer to this as `ids-layout-grid`.
GridCell: Any direct child of a grid container, we refer to this as `ids-layout-grid-cell`.
Cols: These are the vertical columns of the grid, also referred to as tracks.
Rows: The horizontal tracks of the grid.

## Features (With Code Examples)

For auto layout the grid cells have a min/max value of 100px and 1fr respectively. The cells will take up as much space as is available until they reach the threshold of 100px, then they will automatically shift until they reach that threshold again. This removes the need for media queries in many cases.

```html
<ids-layout-grid auto="true">
   <ids-layout-grid-cell fill="true"></ids-layout-grid-cell>
   <ids-layout-grid-cell fill="true"></ids-layout-grid-cell>
   <ids-layout-grid-cell fill="true"></ids-layout-grid-cell>
   <ids-layout-grid-cell fill="true"></ids-layout-grid-cell>
   <ids-layout-grid-cell fill="true"></ids-layout-grid-cell>
   <ids-layout-grid-cell fill="true"></ids-layout-grid-cell>
   <ids-layout-grid-cell fill="true"></ids-layout-grid-cell>
   <ids-layout-grid-cell fill="true"></ids-layout-grid-cell>
</ids-layout-grid>
```

An Ids Layout Grid with a custom number of columns or rows. The example below shows a 4 column grid where the first cell spans 3 columns and the 3rd cell spans 2 rows.

```html
<ids-layout-grid cols="4">
   <ids-layout-grid-cell col-span="3" fill="true"></ids-layout-grid-cell>
   <ids-layout-grid-cell fill="true"></ids-layout-grid-cell>
   <ids-layout-grid-cell row-span="2" fill="true"></ids-layout-grid-cell>
   <ids-layout-grid-cell fill="true"></ids-layout-grid-cell>
   <ids-layout-grid-cell fill="true"></ids-layout-grid-cell>
   <ids-layout-grid-cell fill="true"></ids-layout-grid-cell>
   <ids-layout-grid-cell fill="true"></ids-layout-grid-cell>
   <ids-layout-grid-cell fill="true"></ids-layout-grid-cell>
</ids-layout-grid>
```

Nested Grid. An IdsLayoutGrid component can be nested inside an IdsLayoutGridCell.

```html
<ids-layout-grid cols="4">
   <ids-layout-grid-cell col-span="3" fill="true"></ids-layout-grid-cell>
   <ids-layout-grid-cell fill="true"></ids-layout-grid-cell>
   <ids-layout-grid-cell row-span="2" fill="true"></ids-layout-grid-cell>
   <ids-layout-grid-cell fill="true"></ids-layout-grid-cell>
   <ids-layout-grid-cell fill="true">
      <ids-layout-grid auto="true">
        <ids-layout-grid-cell fill="true"></ids-layout-grid-cell>
        <ids-layout-grid-cell fill="true"></ids-layout-grid-cell>
        <ids-layout-grid-cell fill="true"></ids-layout-grid-cell>
      </ids-layout-grid>
   </ids-layout-grid-cell>
   <ids-layout-grid-cell fill="true"></ids-layout-grid-cell>
   <ids-layout-grid-cell fill="true"></ids-layout-grid-cell>
   <ids-layout-grid-cell fill="true"></ids-layout-grid-cell>
</ids-layout-grid>
```

Standalone CSS Example

```html
<div class="ids-layout-grid ids-layout-cols ids-layout-grid-gap-md" style="--grid-cols: 3;">
  <div class="ids-layout-grid-cell ids-layout-col-span ids-background-fill" style="--grid-col-span: 2"><ids-text font-size="12">A</ids-text></div>
  <div class="ids-layout-grid-cell ids-background-fill"><ids-text font-size="12">B</ids-text></div>
</div>
```

## States and Variations

IdsLayoutGrid
- Auto
- Fixed
- Cols
- Rows

IdsLayoutGridCell
- Fill
- ColSpan
- ColStart
- ColEnd
- RowSpan
- RowStart
- RowEnd

## Keyboard Guidelines

A layout grid is not on its own keyboard focusable and has no keyboard interaction.

## Responsive Guidelines

- A Layout Grid set to auto will flow automatically with the screen size.
- As of now, Layout GrIds with column and row settings will flow as normal until the medium breakpoint (840px). Then they will switch to auto-fit and

## Converting from Previous Versions

TODO

## Designs

## Alternate Designs

- May need to re-visit responsiveness as we begin to test complex layouts.
- Add a breakpoint setting?
- Add fixed unit sizing options for cells and rows.

## Test Plan

1. Accessibility - Axe
1. Visual Regression Test
1. Repeat Tests in All Supported Browsers
1. Some of these as test cases from the [WC gold standard](https://github.com/webcomponents/gold-standard/wiki#api)
1. Can be consumed in NG/Vue/React (pull it in standalone/built see it works standalone)

## Accessibility Guidelines

## Regional Considerations

It's possible that some use cases cells will be flipped when in Right-To-Left languages. This is a TODO still.
