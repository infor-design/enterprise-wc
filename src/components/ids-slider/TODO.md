# Ids Slider TODO

Keep this file in sync with #698

## Major

- [x] Step Slider: Make it snap a dragged handle to the specified steps (snap could be optional) [(example)](https://main-enterprise.demo.design.infor.com/components/slider/example-stepping.html) - [(example 2)](https://main-enterprise.demo.design.infor.com/components/slider/test-options.html)
- [x] Fix keyboard focus bug (focusing on slider handles doesn't trigger tooltip show/hide)
- [ ] Ensure values update on both slider range AND tooltip when API changes the value [required behavior](https://main-enterprise.demo.design.infor.com/components/slider/example-tooltip-onload-and-textbox.html)
- [ ] Convert all instances of "Double Slider" back to "Range Slider" (correct terminology)
- [ ] Add field-height support (specifically there is a [different compact size in 4.x](https://main-enterprise.demo.design.infor.com/components/slider/example-short.html))

## Minor

- [ ] Add colors and ticks feature [(example)](https://main-enterprise.demo.design.infor.com/components/slider/example-colors-and-ticks.html)
- [x] Double Slider: fix bug where when drag is released too close to other thumb, it calculates the UI translate for that thumb thru calculateUIFromClick()
- [ ] Should not animate when loading
