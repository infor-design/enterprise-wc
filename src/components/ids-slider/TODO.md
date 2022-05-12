# Ids Slider TODO

Keep this file in sync with #698

## Major

- [x] Step Slider: Make it snap a dragged handle to the specified steps (snap could be optional) [(example)](https://main-enterprise.demo.design.infor.com/components/slider/example-stepping.html) - [(example 2)](https://main-enterprise.demo.design.infor.com/components/slider/test-options.html)
- [x] Fix keyboard focus bug (focusing on slider handles doesn't trigger tooltip show/hide)
- [x] Ensure values update on both slider range AND tooltip when API changes the value [required behavior](https://main-enterprise.demo.design.infor.com/components/slider/example-tooltip-onload-and-textbox.html)
- [x] Convert all instances of "Double Slider" back to "Range Slider" (correct terminology)
- [x] Range Slider: Fix keyboard behavior (secondary handle can be keyboard-navigated below the primary handle, vice-versa)
- [x] Range Slider: fix bug where when drag is released too close to other thumb, it calculates the UI translate for that thumb thru calculateUIFromClick()
- [x] Add colors and ticks feature [(example)](https://main-enterprise.demo.design.infor.com/components/slider/example-colors-and-ticks.html)
- [x] Add "new" theme colors
- [x] Add disabled state
- [x] Add readonly state
## Minor

- [ ] Screenreader visibility (currently responds as text and a group)
- [ ] Check disabled/readonly states against aXe (similar contrast issues to other form components)
- [ ] Add field-height support (specifically there is a [different compact size in 4.x](https://main-enterprise.demo.design.infor.com/components/slider/example-short.html))
- [ ] Tooltip: Bug where something between extra clicks/focus causes the tooltip to never hide
- [ ] Review/Re-enable skipped functional test regarding drags/clicks interchangeably
- [ ] Should not animate when loading (currently somewhat fixed but its done with a timeout)
- [ ] Range Slider: Ticks should not be colorful unless the handle value is greater
- [ ] Standalone CSS Examples
- [ ] Side-by-Side Examples
