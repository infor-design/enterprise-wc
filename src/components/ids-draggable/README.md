# Ids Draggable

## Description

A container which limits and tracks the dragging of an HTML Element along a specific axis or within the bounds of it's parent element.

## Use Cases

A draggable would be used in the case where you may have a pane splitter (e.g. in `ids-splitter`, internally), or a list that is meant to be dragged along a specific axis. It may also be used in many cases where we have a canvas or pane that should be resized (in one or two dimensions).

It does not currently support drag/drop targets in the current iteration, but in the future this component may be used for moving items.

## Features (With Code Examples)

A draggable component with no bounds to where it is moved.
```html
 <ids-draggable>
  <div class="ids-draggable-demo-box">
    <ids-text>Drag Me</ids-text>
  </div>
</ids-draggable>
```

A draggable component along the X axis (e.g. drags horizontally).
```html
<ids-draggable axis="x">
  <div class="ids-draggable-demo-box">
    <ids-text>Horizontally Draggable</ids-text>
  </div>
</ids-draggable>
```

A draggable component along the Y axis (e.g. drags vertically).
```html
<ids-draggable axis="y">
  <div class="ids-draggable-demo-box">
    <ids-text>Vertically Draggable</ids-text>
  </div>
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
- `min-transform-x` {number} The minimum offset/x-transform/translate the draggable can be translated/dragged on the DOM.
- `max-transform-x` {number} The maximum offset/x-transform/translate the draggable can be placed from its position on the DOM.
- `min-transform-y` {number} The minimum offset/y-transform/translate the draggable can be placed from it's position on the DOM.
- `max-transform-y` {number} The maximum offset/y-transform/translate the draggable can be from it's position on the DOM.

## Accessibility

- Wherever possible, it would be worth adding some visual indicator that content is dragged (this can be done using the `is-dragging` attribute or listening on `ids-dragstart` and `ids-dragend` callbacks).
- if you have text that should be readable, where a minimum width or height is needed, or if it affects presentation, but sure to set reasonable `{min|max}-xform-{x|y}` attributes to restrict the amount of offset on a draggable.
- It is good to keep in mind that draggable content may present issues for people with visual impairments, and so things such as scrollability and typical keyboard
navigation should all function as normal in the case where a user is browsing content that may have resize handles or other draggability aspects.

## Converting from Previous Versions (Breaking Changes)

**3.x to 4.x**
- The 3.X project had two drag components. This replaces both. The Arrange is new

**4.x to 5.x**
- Markup and API fully changed
- Markup has changed to a custom element that wraps draggable content; `<ids-draggable>content</ids-draggable>`.
- Bounding drag movement to a specific axis is done by passing the axis attribute as `x` or `y`.
- The Draggable can be contained to the first measurable parent's rectangle bounds by adding the
flag `parent-container`.
- A handle within the draggable content can be set by using the attribute `handle` as a query selector e.g. `handle=".custom-handle-class"`.
- Draggable events to listen for are now `ids-dragstart`, `ids-drag`, and `ids-dragend`.
- Can now be imported as a single JS file and used with encapsulated styles
- `ids-draggable` replaces `drag`
- `ids-swapabble` replaces `arrange`
- Uses HTML 5 drag drop now
