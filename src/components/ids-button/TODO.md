# Base Button

- [x] Default/Primary/Secondary/Tertiary styles
- [x] Pass "prototype" CSS classes (ids-button/ids-icon-button) from the corresponding JS classes.
- [x] Extra CSS classes (user defined)
- [x] Focusable prop
- [x] Disabled prop (figure out why it broke?)
- [x] Ripple effect (take coords instead of mouse directly)
- [ ] Dispatch events?
- [x] Why doesn't the linter like `get protoClasses()` if it works?
- [x] See if we can remove the button-level "disabled" and "focusable" in favor of one that's component-level
- [x] Lots of tests
- [ ] API method/prop for toggling the `.audible` class on the text span
- [ ] API method/prop for re-arranging the order of named text/icon slots?
- [ ] Icon button is too big

## Icon Button

[x] get/set icon def
[x] get/set audible text/label def

## Toggle Button

[x] get/set pressed() state
[x] "unpressed" icon def
[x] "pressed" icon def
[x] "unpressed" text def
[x] "pressed" text def

## Menu Button

[ ] get/set value() from menu? (store/report menu's current value)
[ ] "is-open" state?
[ ] make it open a popup (maybe call this `IdsPopupButton`?)
