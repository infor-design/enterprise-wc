# Ids Color Picker TODOs

## Major

- [ ] Fix the keyboard (arrow down , enter, keys around the colors ect), and fix focus state around swatches
- [ ] Tooltip on the colors
- [ ] Standardize/Abstract out Popup/Picker/"return value" interface (to be used in this and other pickers)
- [ ] Fix all the states [See example](https://main-enterprise.demo.design.infor.com/components/dropdown/test-states.html) and [also see](https://main-enterprise.demo.design.infor.com/components/colorpicker/test-states.html)
- [ ] Check Styles match with 4.x on the popup container - swatch/hover/spacing
- [ ] Default color list should load from our theme palette `node_modules/ids-identity/dist/theme-new/tokens/web/ui.config.color-palette.js`
- [ ] Check mark color should change based on swatch background (check mark color can get from colorlist -arrowClass)
- [ ] Standardize/Abstract out Popup/Picker/"return value" interface (to be used in this and other pickers)
- [ ] Check JSDoc comments for everything that's missing
- [ ] Add test for change event firing
- [ ] Add test for setting color / clearing color
- [ ] Change hide/show to open/close for consistency and make sure it fires events that are documented
- [ ] Ability to set custom labels for selections. Should be able to show color-name `azure06` or `color-hex` `#ffffff` inside the input. [See example](https://main-enterprise.demo.design.infor.com/components/colorpicker/example-custom-labels.html)
- [ ] Show label instead of hex. [See example](https://main-enterprise.demo.design.infor.com/components/colorpicker/example-show-label.html)
- [ ] Add sizes widths and field heights. [See Ids Input](https://main.wc.design.infor.com/ids-input/)
- [ ] Add dirty tracker example to [the example page](https://main.wc.design.infor.com/ids-color-picker/)

## Minor

- [ ] Some text hard coded in component, should give setting/slots to user change those text strings ids-text audible="true"
- [ ] Enable/Disable standard HTML colorpicker independently of other colorpicker parts using a boolean attribute
- [ ] Click the swatch to select / option for the "advanced" picker
- [ ] Add side by side example
