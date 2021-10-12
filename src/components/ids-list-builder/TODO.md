BUGS
- [ ] checkTemplateHeight in ids-list-view is buggy; prints out 0px for height; had to comment it out in render() of ids-list-view for ids-virtual-scroll to properly render the data()--changed it to be an if statement only if item-height is not declared for ids-virtual-scroll
- [ ] item-height attribute on ids-virtual-scroll doesn't even affect the height of the list items

TODO
- [ ] fix virtual scroll item-height
- [x] fix height of toolbar (replaced ids-card wrapper w div)
- [x] fix ids-toolbar items iteration error (export modules in index.js was whack)
- [ ] add themes/color styles
- [x] add hover, focus, select styles/attributes; appropriate cursors for 4 dots vs li
- [x] add ability to drag
- [x] add ability to edit
  - [ ] autoselect all text, and focus the input when edit button is clicked
- [x] add ability to delete
- [x] add ability to move list items up/down
- [ ] add ability to create new item
- [ ] when dragging, make draggable z-index higher than parent container/toolbar
- [x] merge w main, check if any conflicts w tims changes 