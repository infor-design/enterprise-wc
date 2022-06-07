# Ids Modal TODO

Keep this file in sync with #708

## Major

- [ ] Examples with CSS parts
- [x] Add breakpoints and full size support from 4.x [(example)](https://main-enterprise.demo.design.infor.com/components/modal/example-fullsize-responsive.html)
- [x] Add `keepOpen` behavior to prevent clicking outside to close (may also just need to ignore `onOutsideClick()`)
- [x] Keep keyboard navigation within the Modal's boundaries (don't focus on anything outside the active modal) ([#267](https://www.github.com/infor-design/enterprise-wc/issues/267))

## Minor

- [ ] Trigger an event on the "target" containing a value of some sort (useful for Lookup/etc)
- [ ] Add API for disable/enable all elements within the modal (is probably tied to `disabled` property of Modal)
- [ ] Shared overlay support (multiple modals with one overlay)
- [ ] Bring over the Modal Manager from 4.x
- [ ] Create top-level containment for all modals (used by the stack)
