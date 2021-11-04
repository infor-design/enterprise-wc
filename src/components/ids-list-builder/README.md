# Ids ListBuilder 

## Description

An interactive list where you can add, move up/down, edit, and delete items which supports both mouse and keyboard navigation for accessibility.

Selecting an item can be toggled by a mouse click or by tabbing to the list item and hitting 'Space'. 

Moving a selected list item up/down can be done by clicking and dragging list items up/down or by toggling the toolbar up/down buttons with mouse or keyboard.

Editing a selected list item can be done by hitting 'Enter' or by toggling the toolbar edit button with mouse or keyboard.

Deleting a selected list item can be done by toggling the toolbar delete button with mouse or keyboard.

Adding a new list item can be done by toggling the toolbar add button with mouse or keyboard.

## Use Cases

- Allows for users to create and edit lists of varying content. After importing JSON or array of objects, allowing user to edit, order, add, and/or delete items.

## Terminology

- **Selected list item**: The currently toggled selected list item, indicated by a blue background and white text
- **Toolbar**: At the top of the list builder, contains 5 buttons for interacting with the list items
- **Template**: The pattern or structure of data to display for each list item

## Features (With Code Samples)

### A List Builder with a template to display productNames

```html
<ids-list-builder>
  <template>
    <ids-text font-size="16" type="h2">${productName}</ids-text>
  </template>
</ids-list-builder>
```

To inject data you would do something like:

```html
<script>
  document.querySelector('ids-list-builder').data = [
    {
      id: 1,
      productId: '7439937961',
      productName: 'Steampan Lid',
      inStock: true,
      units: '9',
      unitPrice: 23,
      color: 'Green'
    },
    {
      id: 2,
      productId: '3672150959',
      productName: 'Coconut - Creamed, Pure',
      inStock: true,
      units: '588',
      unitPrice: 18,
      color: 'Yellow'
    },
    {
      id: 3,
      productId: '8233719404',
      productName: 'Onions - Red',
      inStock: false,
      units: '68',
      unitPrice: 58,
      color: 'Green'
    }, 
  ]
</script>
```

and if you want to display more data you could modify the template like so:

```html
<ids-list-builder>
  <template>
    <ids-text font-size="16" type="h2">Item: ${productName}</ids-text>
    <ids-text font-size="16" type="h2">Price: ${unitPrice}</ids-text>
    <ids-text font-size="16" type="h2">Stock: ${units}</ids-text>
  </template>
</ids-list-builder>
```

## Settings (Attributes)

Since this component inherits [IdsListView](../ids-list-view/README.md), it will have all of its properties. The only property that should be of concern, and overrides that of its super class, is `data`.

- `data` {array} the list of items to populate the list builder with

## Responsive Guidelines

- This component stretches to 100% width of its container

## Converting from Previous Version

### Converting from 4.x

The Ids ListBuilder is now a Web Component. Instead of using classes to define it, it is done directly with a custom element and attributes:

```html
<!-- 4.x example -->
<div class="listbuilder" id="example-listbuilder" data-init="false">
  <div class="toolbar formatter-toolbar">
    <div class="buttonset">

      <button type="button" class="btn-secondary" title="Add New" data-action="add">
        <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
          <use href="#icon-add"></use>
        </svg>
        <span class="audible">Add New</span>
      </button>

      <div class="separator"></div>

      <button type="button" class="btn-secondary" title="Go Up" data-action="goup">
          <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
          <use href="#icon-up-arrow"></use>
          </svg>
          <span class="audible">Go Up</span>
      </button>

      <button type="button" class="btn-secondary" title="Go Down" data-action="godown">
        <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
          <use href="#icon-down-arrow"></use>
        </svg>
        <span class="audible">Go Down</span>
      </button>

      <div class="separator"></div>

      <button type="button" class="btn-secondary" title="Edit" data-action="edit">
        <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
          <use href="#icon-edit"></use>
        </svg>
        <span class="audible">Edit</span>
      </button>
      <button type="button" class="btn-secondary" title="Delete" data-action="delete">
        <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
          <use href="#icon-delete"></use>
        </svg>
        <span class="audible">Delete</span>
      </button>

    </div>
  </div>
  <div class="listbuilder-content">
    <div class="listview"></div>
  </div>
</div>

<!-- this is the same using the WebComponent -->
<ids-list-builder>
  <template>
    <ids-text font-size="16" type="h2">${productName}</ids-text>
  </template>
</ids-list-builder>
```
