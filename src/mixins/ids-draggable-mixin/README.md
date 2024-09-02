# Ids Draggable Mixin

This mixin enhances elements with drag-and-drop functionality using a designated handle. It triggers the `dragstart` event when an element begins to drag and continuously fires the `drag` event while the element is being moved. Upon release, the `dragend` event is triggered when the element is dropped onto the target.

To implement the draggable mixin:

1. Import `IdsDraggable` and add to the component-base.js
2. Make sure you attributes extend `return [...super.attributes` in the `attributes` property because `attributes.DRAGGABLE` is added.
3. Make sure the `connectedCallback` calls `super.connectedCallback();`

See ids-card as an example.
