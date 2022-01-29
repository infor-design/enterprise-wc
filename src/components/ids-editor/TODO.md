# Editor TODO's

- [ ] CSP error (mixed with style or html injection)
- [ ] safari need to fix below action issues (might issue with: `#getSelection()`)
    - [ ] header(1-6)
    - [ ] color picker (popup not open, could be just css styles -because currently made as hidden input)
    - [ ] text align
    - [ ] block quote
    - [ ] hyperlink (model not open)
    - [ ] insert image (model not open)
    - [ ] un/order list (CSP error)
- [ ] add ids-color-picker (currently in use html `input[type="color"]` element)
- [ ] add preview mode ([see 4.x](https://main-enterprise.demo.design.infor.com/components/editor/example-preview.html))
- [ ] custom modal templates (currently use default in built)
- [ ] custom source-formatter with and/or without custom theme (currently use default in built)
- [ ] output value as json format
- [ ] each action should be fully working (etc. `redo`, `undo`, `clear-formatting`, `un/ordered list`)
- [ ] find way to work without `document.execCommand(), document.queryCommandSupported(), document.queryCommandState()`
- [ ] write tests for more coverage
