# TODO on the IDS Popup
- [x] Fix centering - `align="center"` should position the element directly over top
- [x] See if we can fix the attribute display in the DOM to match what comes from `get align()`;
- [x] Fix the bad placement on initial load
- [x] Make switching the alignment target work
- [x] Influence the "direction" the popup is placed in when using an alignEdge with coordinate-based placement
- [x] Figure out how to fix `top, top` and `left, left` when setting opposite dimensions, like `align-x="top"` or `align-y="left"`
- [ ] Add MutationObserver detection for the Popup content wrapper, do a `refresh()` when it changes
- [x] Tests for basic placement
- [ ] Fix bad input tests (see functional tests)
