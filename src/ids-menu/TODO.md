# TODO on IDS Menu

## Features

- [x] Disabled state (single item)
- [] Disabled state (entire menu)
- [x] Selected state (single)
- [x] Selected state (multi/group)
- [x] Trigger `selected` event (optionally pass a trigger element)
- [x] Expose "selected" list values on the component
- [x] Submenu state
- [x] Submenu functionality
- [x] Keyboard Nav
- [x] Keyboard Select
- [x] Make keyboard navigation not occur twice on nested menu items (prevent bubbling after it occurs once?)
- [] Ensure current aria labels work properly to describe groups (Voiceover doesn't currently read out group headers)
- [x] `focus()` method that figures out which item in the menu to focus, and does so
- [x] Tests
- [x] Docs
- [ ] Get aXe tests passing

## Ids Popup

- [] Add "flip" and "nudge" logic
- [] Might also need to create Ids Popup Boundary?

## Ids Popup Menu

- [x] Combine Popup and Menu
- [x] Create hidden / nested fly-out behavior for submenus
- [] Shift + F10 to open (need to have different targets in Keyboard mixin)

## ContextMenu Mixin?

- [] Apply an IdsPopupMenu to an element with API for open/close and menu functions

## Menu button

- [] Add functional menu buttons with different features (standard, more actions, etc)
