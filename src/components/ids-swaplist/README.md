# Ids SwapList

## Description

A swaplist allows for easy movement of objects between two or more lists. The swaplist makes use of IdsSwappable for sorting and swapping functionality and IdsCard for layout.

## Use Cases

A common usecase for swaplists is to select items from a list of available objects. On one list, the user can view all available items. The user can then move an item from the available list to the selected list, and vice versa. This allows the user to view and track all items in the dataset. Users can drag and drop objects from list to list or select items and click an icon to move them to the desired list. Setting new data will update list UI. Interacting with with swaplist UI also updates datasource.

## Features (With Code Samples)

Example using js to populate the lists:

```html
<ids-swaplist id="swaplist-1">
    <template>
        <ids-text>${text}</ids-text>
    </template>
</ids-swaplist>
```

```js
const swaplist = document.querySelector('ids-swaplist');
const swaplisltData = [
  {
    "id": 1,
    "name": "Available",
    "items": [
      {
        "id": 1,
        "text": "Option A",
        "value": "option_a"
      }
    ]
  },
  {
    "id": 2,
    "name": "Selected",
    "items": [
      {
        "id": 2,
        "text": "Option C",
        "value": "option_c"
      }
    ]
  }
]

swaplist.data = swaplistData;
```
## Settings (Attributes)
**count** Sets the amount of lists on the page. By default `count` is set to 2.

## Events

- `updated` Fires when datasource is updated after UI list changes

## Methods

- `renderLists` Can be called to re-render lists from datasource.

## Converting from Previous Versions (Breaking Changes)

**3.x to 4.x**

- Swaplist was a new component created in v4.0.6

**4.x to 5.x**

- Swaplist is now a custom element `<ids-swaplist></ids-swaplist>`
