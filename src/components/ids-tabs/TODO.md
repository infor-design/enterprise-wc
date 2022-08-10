# Ids Tabs TODOs

Keep this file in sync with #683

## Major

- [x] Add Module Tabs ([#729](https://github.com/infor-design/enterprise-wc/issues/729))
- [x] Add overflow detection feature (may need design review?)
- [x] Dismissible Tabs
- [x] `ids-tab-divider`: Improve accessibility + add aXe tests
- [x] Sortable Behavior ([Example](https://main-enterprise.demo.design.infor.com/components/tabs-module/example-sortable.html))

## Minor

- [ ] test: for keyboard events
- [ ] test: figure out how to get coveralls + Jest to detect certain parts of code
- [ ] test: figure out why ids-tab.selected = false doesn't trigger in Jest
- [ ] test: resolve aXe color contrast issues (disabled state, similar to other components)
- [ ] test: re-enable skipped Percy tests, resolve missing initial selected state (no selected state is present in the tests, but exists when the browser loads the same test page)
- [ ] Review current solution for potential optimization (remove extraneous elements and looping)
- [ ] Review changes to IdsSwappable to allow swappable tabs, ensure containment/separation of concerns is correct
