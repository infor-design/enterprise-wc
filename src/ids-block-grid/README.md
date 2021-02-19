# Ids Block Grid Component

## Description

The IDS Block Grid Component displays data as selectable blocks within a simple grid. It gives a way of evenly split contents of a list within a grid.

## Use Cases

Use when you wanted to create rows of images with paragraphs/links that need to stay evenly spaced.

## Terminology

- **Align**: The position of the block grid. You can set it to be centered, left, or right.

## Feature (With the Code Examples)

A block grid is created by using the `ids-block-grid` as the main container, and `ids-block-grid-item` for the item inside of it.

```html
<ids-block-grid>
  <ids-blockgrid-item>
    Content Here...
  </ids-blockgrid-item>
</ids-block-grid>
```

You can set the alignment of the block grid by setting the `align` property with these three options `left`, `centered` or `right`. By default, the position is set to `centered` align.

```html
<ids-block-grid align="centered">
  <ids-blockgrid-item>
    Content Here...
  </ids-blockgrid-item>
</ids-block-grid>
```

## Settings and Attributes

- `align` {string} Sets the position of the block grid and it's contents.

## States and Variations

- Align

## Responsive Guidelines

- The block grid uses flex container to be able to fill available free space and shrinks them to prevent overflow, while the block grid item has a width of 200px. It automatically sets the height depends on how many the block grid item is.

## Accessibility

The use of this component is not recommended for Accessibility since the lack of elements in the page may pose issues for screen reader and other assistive technology. Consider a way to disable this functionality.
