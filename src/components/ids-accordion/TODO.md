# Ids Accordion TODOs

## Major

- [x] Add an allowOnePage setting so only one can be open at once. [see](https://github.com/infor-design/enterprise/blob/main/src/components/accordion/accordion.js#L31)
- [ ] Add a way to expand/collapse headers programmatically as setting `$('ids-accordion-header').expanded` does not seem to work.
- [ ] Add a setting to disable accordion-header similar to the [old version](https://main-enterprise.demo.design.infor.com/components/accordion/example-disabled.html)
- [ ] Add an example like the [old version](https://main-enterprise.demo.design.infor.com/components/accordion/test-different-header-types.html) showing how to set an icon in the slot and hide the chevron.
- [ ] Add events to replace `selected` `expanded` and `collapsed` events.
- [ ] Update `d.ts` and `readme` settings files for all accordion settings, events and methods (like ids-tag)
- [ ] The state styling is not correct in all themes see [#501](https://github.com/infor-design/enterprise-wc/issues/501)

## Minor

- [ ] Improve new navigation methods to account for disabled/hidden/collapsed (children inside collapsed panes should become `tabIndex="-1"`)
- [ ] App-menu/Sub-App-menu variants need theme modes/versions besides New Light
