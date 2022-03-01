# Ids SwapList

## Description

A swaplist allows for easy movement of objects between two or more lists. The swaplist makes use of IdsSwappable for sorting and swapping functionality and IdsCard for layout.

## Use Cases

A common usecase for swaplists is to select items from a list of available objects. On one list, the user can view all available items. The user can then move an item from the available list to the selected list, and vice versa. This allows the user to view and track all items in the dataset. Users can drag and drop objects from list to list or select items and click an icon to move them to the desired list.

## Features (With Code Samples)

Example using js to populate the lists:

```html
<ids-swaplist id="swaplist-1" count="2"></ids-swaplist>
```

```js
const swappable = document.querySelector('#swaplist-1').container.querySelectorAll('ids-swappable');

data.forEach((d) => {
    swappable.innerHTML += `
    <ids-swappable-item>
        <ids-text>${d.city}</ids-text>
    </ids-swappable-item>
    `;
});
```
## Settings (Attributes)
**count** Sets the amount of lists on the page. By default `count` is set to 2.
