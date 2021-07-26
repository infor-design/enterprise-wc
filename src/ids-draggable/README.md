# Ids Draggable

## Description

A container which limits and tracks the dragging of an HTML Element along a specific axis or within the bounds of it's parent element.

## Use Cases

A draggable would be used in the case where you may have a pane splitter (e.g. in `ids-splitter`), or a list that is meant to be dragged along a specific axis. It may also be used in many cases where we have a canvas or pane that should be resized (in one or two dimensions).

It does not currently support drag/drop targets in the current iteration, but in the future this component may be used for moving items.

## Features (With Code Examples)
A draggable component with no bounds to where it is moved.
```html
 <ids-draggable>
    <div class="ids-draggable-demo-box">
      <ids-text>Drag Me</ids-text></div>
  </ids-draggable>
```

A draggable component along the X axis (e.g. drags horizontally).
```html
 <ids-draggable axis="x">
    <div class="ids-draggable-demo-box">
      <ids-text>Horizontally Draggable</ids-text></div>
  </ids-draggable>
```

A draggable component along the Y axis (e.g. drags vertically).
```html
 <ids-draggable axis="y">
    <div class="ids-draggable-demo-box">
      <ids-text>Vertically Draggable</ids-text></div>
  </ids-draggable>
```

A draggable component which can be dragged either horizontally or vertically
but is contained by it's first non zero-width/height parent (can also work for non-`<div>`, but cannot be a controlled `ids-layout-grid-cell`).
```html
<div>
 <ids-draggable parent-containment>
    <div class="ids-draggable-demo-box">
      <ids-text>Vertically Draggable</ids-text></div>
  </ids-draggable>
</div>
```

A draggable component which is draggable only by a specific handle on the tab (note: a draggable component currently has a limitation of one handle element, even if the class matches multiple handles).
```html
<div>
 <ids-draggable handle=".drag-handle">
    <div class="ids-draggable-demo-box">
      <ids-icon
        class="drag-handle"
        icon="drag"
        size="large"
      ></ids-icon>
      <ids-text>
        All-content drags, but only .drag-handle is draggable
      </ids-text>
    </div>
  </ids-draggable>
</div>
```

## Settings and Attributes

- `parent-containment` {boolean} Flags this draggable as having drag range being contained only within the first/closest inner parent of the content with a measurable width or height.
- `is-draggable` {boolean} Whether or not the `ids-draggable` and content is being dragged.
- `disabled` {boolean}
- `axis?` {'x' | 'y'}   The axis that the draggable content will be moving along (e.g. X => horizontal, Y => vertical); By default, not defined and supports both axes.
- `handle?` {string} A query selector representing an optional handle that can be used to drag the content of the draggable.

## Accessibility

- Wherever possible, it would be worth adding some visual indicator that content is dragged (this can be done using the `is-dragging` attribute or listening on `ids-dragstart` and `ids-dragend` callbacks).
- It is good to keep in mind that draggable content may present issues for people with visual impairments, and so things such as scrollability and typical keyboard
navigation should all function as normal in the case where a user is browsing content that may have resize handles or other draggability aspects.
