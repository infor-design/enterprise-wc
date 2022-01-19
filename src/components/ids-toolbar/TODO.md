# Ids Toolbar TODO

- [x] Overflow menu: keyboard functionality doesn't work on user-defined slotted items, but works on Shadow Root items (different item scopes)
- [ ] Overflow menu: selecting an item with the enter key causes a problem where the menu no longer comes up afterward
- [x] Overflow menu: Menu buttons that are spilled over need to pass along their menus as a "submenu" to their corresponding menu item
- [x] Overflow menu: selection of menu item needs to trigger events on their corresponding Toolbar item

## Spacing

- [ ] Add `spacing` setting for Toolbar Sections (#493)
    - `default` (do not alter container)
    - `spaced-evenly` (causes toolbar section to be `width: 100%` and `justify-content: space-evenly`)
