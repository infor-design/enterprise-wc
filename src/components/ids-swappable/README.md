# Ids Swappable

## Description
IdsSwappable is an abstract component that provides functionality for drag and drop between items or lists. It consists of two components `ids-swappable` which is a container for and number of `ids-swappable-item`. The `ids-swappable-item` makes use of s single `slot` where the user can use virtually any component they would like, most commonly `ids-text` or `ids-card`.

## Use Cases

IdsSwappable is used to create the [IdsSwaplist](../ids-swaplist/README.md), which is used to move objects between 2 or more lists, but is not limited to this use case. It can also be used to create standalone sortable/swappable element collections.

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

### Mix with other components

Some components support composition with IdsSwappable, such as [IdsTabs](../ids-tabs/README.md).  Since Tabs have their own process for handling selection, using `dragMode="always"` ensures tabs can be moved around regardless of selection:

```html
<ids-tabs>
    <ids-swappable dropzone="move">
        <ids-swappable-item drag-mode="always">
            <ids-tab value="contracts">Contracts</ids-tab>
        </ids-swappable-item>
        <ids-swappable-item drag-mode="always">
            <ids-tab value="opportunities">Opportunities</ids-tab>
        </ids-swappable-item>
        <ids-swappable-item drag-mode="always">
            <ids-tab value="attachments" disabled>Attachments</ids-tab>
        </ids-swappable-item>
        <ids-swappable-item drag-mode="always">
            <ids-tab value="notes">Notes</ids-tab>
        </ids-swappable-item>
    </ids-swappable>
</ids-tabs>
```

## Settings (Attributes)

### ids-swappable

**selectedItems** Sets the multi-select attribute. Defaults to false.

### ids-swappable-item

**drag-mode** Defines how/when dragging can occur.  By default (`select`), swappable items must first be selected in order to be dragged.  Setting to `always` makes dragging possible at all times.
**selected** Sets the selected attribute. Items need to be selected before that can be dragged.
**originalText** Sets the originalText attribute. This happens when the component is connected and is used to revert the text after item is dropped.
**tabbable** Sets if the item is tabbable. Defaults to true.
**disable-drag** Disable the dragging on one item

## Events

- `swapped` Fires when an item is dragged up and down. Gives you the DOM element and new position information.

## Converting from Previous Versions (Breaking Changes)

**3.x to 4.x**

- Sortable behavior is part of the Arrange component
- Arrange was added in v4.2.1
- Invoke the Arrange component on an element with `$('#my-element').arrange();`

**4.x to 5.x**

- Sortable behavior is now enabled by wrapping elements on a page with `<ids-swappable></ids-swappable>` and `<ids-swappable-item></ids-swappable-item>`
