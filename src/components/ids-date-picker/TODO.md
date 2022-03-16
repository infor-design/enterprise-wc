# Ids Data Picker TODOs

## Major

- [x] Keyboard Shortcuts according to https://github.com/infor-design/enterprise/blob/main/src/components/datepicker/readme.md#keyboard-shortcuts
- [] General accessibility (screen reader) / axe
- [x] Clicking the month/year opens the month and year selection panel
- [] Configurable legend https://main-enterprise.demo.design.infor.com/components/datepicker/example-legend.html
- [] Range picker https://main-enterprise.demo.design.infor.com/components/datepicker/example-range.html including https://main-enterprise.demo.design.infor.com/components/datepicker/test-week-picker.html https://github.com/infor-design/enterprise/blob/main/src/components/datepicker/datepicker.js#L69-L79
- [] Make it open faster (seems a little slow and for @EdwardCoyle it was 2-3 seconds)
- [] Add functional tests for these cases https://main-enterprise.demo.design.infor.com/components/datepicker/example-anniversary-format.html and https://main-enterprise.demo.design.infor.com/components/datepicker/example-custom-format.html
- [] Add disabled dates https://main-enterprise.demo.design.infor.com/components/datepicker/example-disabled-dates.html for month view as well. Can rethink the API see current settings https://github.com/infor-design/enterprise/blob/main/src/components/datepicker/datepicker.js#L40-L57
- [] Add Masking / Localization with way to customize or disable the mask
- [] Add sizes and field height examples like input https://main-enterprise.demo.design.infor.com/components/datepicker/example-sizes.html with tests
- [] Date picker with time https://main-enterprise.demo.design.infor.com/components/datepicker/example-timeformat.html with tests see settings https://github.com/infor-design/enterprise/blob/main/src/components/datepicker/datepicker.js#L26-L31
- [] Add tests for invalid dates https://main-enterprise.demo.design.infor.com/components/datepicker/example-validation.html
- [] Add test that the change and input event is fired when the date is changed as a test. And make sure the hide/show events are fired as well (from the popup component). And add to breaking changes.
- [] Add test that the placeholder works (should work)
- [] Add test for UTC picker https://github.com/infor-design/enterprise/blob/main/src/components/datepicker/datepicker.js#L83

## Minor

- [] Figure out https://main-enterprise.demo.design.infor.com/components/datepicker/example-month-year-format.html if needed?
- [] Add week numbers when design approved https://github.com/infor-design/enterprise/issues/5785
- [] Add mobility changes when design approved https://github.com/infor-design/enterprise/issues/5763 (some need to be confirmed)
- [] Add test for this case https://github.com/infor-design/enterprise/issues/5255
- [] Add side by side example
