# TODO on the IDS Popup
- [x] Fix centering - `align="center"` should position the element directly over top
- [x] See if we can fix the attribute display in the DOM to match what comes from `get align()`;
- [x] Fix the bad placement on initial load
- [x] Make switching the alignment target work
- [x] Influence the "direction" the popup is placed in when using an alignEdge with coordinate-based placement
- [ ] Tests for basic placement

# Items to discuss about design
- Should we create a global ResizeObserver with pub/sub for all WebComponents to connect (similar to standard IDS renderLoop design) (reading material: https://github.com/WICG/resize-observer/issues/59)
- Should we create a small, required CSS library for scaffolding out some parts of the WebComponents kit?  For example, the reason for in-accurate initial placement on the Popup Component is due to this component being positioned before the Layout Grid CSS is applied to its Shadow DOM elements... should the fix be to provide layout CSS ahead of component loading, or should I make any popup logic staggered until the page loads?
- Should we create a JS core, storing main loops (with a mixin to include in components that need access to it) for things like:
  - utils
  - resizeObserver (+ access mixin)
  - mutationObserver (+ access mixin)
  - renderLoop (requestAnimationFrame loop + access mixin)
  - breakpoint detection (uses our define breakpoint sizes, and includes a wrapper around https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList that encourages using its `change` event) (+ access mixin)
