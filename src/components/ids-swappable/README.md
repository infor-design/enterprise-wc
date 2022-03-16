# Ids Swappable

## Description
IdsSwappable is an abstract component that provides functionality for drag and drop between items or lists. It consists of two components `ids-swappable` which is a container for and number of `ids-swappable-item`. The `ids-swappable-item` makes use of s single `slot` where the user can use virtually any component they would like, most commonly `ids-text` or `ids-card`.

## Use Cases
IdsSwappable is used to create the IdsSwaplist, which is used to move objects between 2 or more lists, but is not limited to this use case. It can also be used to create standalone sortable/swappable lists.

## Features (With Code Samples)

Basic Usage:

```html
<ids-swappable>
    <ids-swappable-item>
        <ids-text font-size="20" type="h2" overflow="ellipsis" tooltip="true">Item One</ids-text>
    </ids-swappable-item>
    <ids-swappable-item>
        <ids-text font-size="20" type="h2" overflow="ellipsis" tooltip="true">Item Two</ids-text>=
    </ids-swappable-item>
    <ids-swappable-item>
        <ids-text font-size="20" type="h2" overflow="ellipsis" tooltip="true">Item Three</ids-text>
    </ids-swappable-item>
</ids-swappable>
```

IdsSwaplist example:

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

### ids-swappable
**selectedItems** Sets the multi-select attribute. Defaults to false.

### ids-swappable-item
**selected** Sets the selected attribute. Items need to be selected before that can be dragged.
**originalText** Sets the originalText attribute. This happens when the component is connected and is used to revert the text after item is dropped.
**tabbable** Sets if the item is tabbable. Defaults to true.
