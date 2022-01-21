# Editor TODO's

- [ ] write tests (func, e2e, percy, coverage)

## Next Phase

- [ ] add ids-color-picker
- [ ] add preview mode
- [ ] custom modal templates (currently use default in built)
- [ ] custom source-formatter (currently use default in built), if possible theme able
- [ ] if possible, custom theme for source-formatter
- [ ] output value as json
- [ ] each action should fully work (ie. `redo`, `undo`, `clear formatting`, `un/ordered list`)
- [ ] find way to work without `document.execCommand()`
- [ ] safari need to fix below issues
    - [ ] header(1-6)
    - [ ] color picker (popup not open, could be just css styles -because currently made as hidden input)
    - [ ] text align
    - [ ] block quote
    - [ ] hyperlink (model not open)
    - [ ] insert image (model not open)

## Blockers

- [ ] toolbar spillover icons need view box
- [ ] CSP error (mixed with style or html injection)
