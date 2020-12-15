# TODO on the IDS Popup

- [x] Fix centering - `align="center"` should position the element directly over top
- [x] See if we can fix the attribute display in the DOM to match what comes from `get align()`;
- [x] Fix the bad placement on initial load
- [x] Make switching the alignment target work
- [x] Influence the "direction" the popup is placed in when using an alignEdge with coordinate-based placement
- [x] Figure out how to fix `top, top` and `left, left` when setting opposite dimensions, like `align-x="top"` or `align-y="left"`
- [x] Add MutationObserver detection for the Popup content wrapper, do a `refresh()` when it changes
- [x] Tests for basic placement
- [x] Fix bad input tests (see functional tests)
- [x] Move current Popup `alignTarget` samples to another page, use a button on the index to place Popup by target.
- [ ] Create a "Click in the boundary" page that places a Popup by coordinates.
- [x] Add Popup "open" (visible) and "closed" (hidden) states.
- [x] Figure out how to get default placement/visibility working again after adding `shouldUpdate: true` setting to the `connectedCallback`
- [ ] Add tests for "type"
- [x] Improve test page for placement within the page
- [ ] Add option to close on clicking out in the page
- [ ] Improve "alignTarget" to accept an element reference directly (IDS Popup Menu).
