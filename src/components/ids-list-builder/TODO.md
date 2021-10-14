BUGS
- [ ] checkTemplateHeight in ids-list-view is buggy; prints out 0px for height; had to comment it out in render() of ids-list-view for ids-virtual-scroll to properly render the data()--changed it to be an if statement only if item-height is not declared for ids-virtual-scroll
- [ ] item-height attribute on ids-virtual-scroll doesn't even affect the height of the list items
- [ ] fix virtual scroll item-height

TODO
- [x] fix height of toolbar (replaced ids-card wrapper w div)
- [x] fix ids-toolbar items iteration error (export modules in index.js was whack)
- [ ] add themes/color styles
- [x] add hover, focus, select styles/attributes; appropriate cursors for 4 dots vs li
- [x] add ability to drag
  - [x] lower opacity of placeholder & intensity of color
  - [x] lower opacity of dragging element
- [x] add ability to edit
  - [x] autoselect all text, and focus the input when edit button is clicked
  - [x] make styling/functionality match the example
  - [x] make the input text white when editing
- [x] add ability to delete
- [x] add ability to move list items up/down
- [x] add ability to create new item
- [x] when dragging, make draggable z-index higher than parent container/toolbar
- [x] merge w main, check if any conflicts w tims changes
- [x] fix collapsing height when li text is empty
- [x] add keyboard listeners for navigating, selecting, editing the li's
- [x] add key listener for enter button when editing li to unfocus the editor
- [x] for the demo, attach an array of example data and pass it to the data property
  - [x] BUG: super.render() in ids-list-view::render() causes the ids-toolbar-section get items() to return undefined -- causing errors in the ids-toolbar get items() -- SOLVED by wrapping it in requestAnimationFrame() (thanks john!)
  - [x] BUG: ids-draggables and tool bar buttons all broken when trying to import data thru example.js -- not sure if it's related to the above... -- SOLVED by reattaching all event listeners to the list items that get added AFTER connectedCallback()

  - [ ] write tests
