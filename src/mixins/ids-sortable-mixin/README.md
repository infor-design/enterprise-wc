# Ids Sortable Mixin

This mixin injects a `sortable` property into a component that can be toggled to allow `ids-draggable` elements to be organized/swapped properly by "dragging and dropping". This mixin requires that the class using it ***is*** a list **or** ***provides*** a list of the items to be dragged and sorted, and that those items ***are*** `ids-draggable` components. It supports **horizontal** as well as **vertical** drag and drop directions. By default, it checks and swaps based on vertical dragging. The attribute setting `axis="x"` is required on the `ids-draggable` components for horizontal dragging to work properly. Please see `ids-list-view` component for an example of how it utilizes this mixin properly.

The items to be dragged and dropped **MUST** be `ids-draggable` or else this mixin won't work. It depends on event listeners for the events `ids-dragstart`, `ids-drag`, `ids-dragend` which are fired by `ids-draggable`. It works like this:

1. User clicks item/starts drag
    - A placeholder is created under the selected item
2. User drags item around the screen
    - The placeholder moves up/down or left/right as a marker to indicate where the item will end up after being "dropped"
3. User releases mouse button/ends drag
    - The placeholder is removed from the DOM

For more info on dragging and dropping elements in a list, and what the coding logic in this mixin is based on, refer to [this article](https://htmldom.dev/drag-and-drop-element-in-a-list/)

The usage of this mixin would be:

1. Import the mixin and add it to the `mix` list
1. Manually add the `sortable` attribute to your example, or have your component set this property automatically.
1. Call `attachDragEventListeners()` as needed. Calling it once in `connectedCallback()` usually suffices, **but if your list is dynamic** (items get added/deleted/modified) **or the list dynamically renders** (i.e. `ids-virtual-scroll`), you would need to make sure each new `ids-draggable` item gets the drag event listeners attached after they get added to the DOM.
1. **[Optional]** Override `OnDragStart()`, `OnDrag()`, `OnDragEnd()`, `createPlaceholderNode()` accordingly if you need additional function calls to modify or style elements
