# Ids Search Field TODO

Keep this file in sync with #700

## Major

- [ ] Review/Update search field styles to reflect current 4.x designs (See [changes from this PR](https://github.com/infor-design/enterprise/pull/6234)))
- [ ] Add responsive behavior (opt-in via boolean attribute) for existence within Toolbars or other containers [(example)](https://main-enterprise.demo.design.infor.com/components/toolbarsearchfield/example-flex-toolbar-align-with-searchfield.html) - includes a focusable "collapse" button for accessibility
- [ ] Add "GO" button functionality (named slot? combined with callback/event for when the button is clicked)
- [ ] Add compact/large header variant (may be worth making a standalone, extended component to not "mix" styles) [(large example)](https://main-enterprise.demo.design.infor.com/components/header/example-searchfield-large) | [(full-size example)](https://main-enterprise.demo.design.infor.com/components/header/example-searchfield-full)
- [ ] Add categories functionality (named slot? + dropdown or menu button + callbacks/events for menu selection) [("short categories" example)](https://main-enterprise.demo.design.infor.com/components/searchfield/example-categories-short.html) [("full categories" example)](https://main-enterprise.demo.design.infor.com/components/searchfield/example-categories-full.html)

## Minor

- [ ] Check dark/contrast theme colors for `alternate` variant
- [ ] Check dark/contrast theme colors for `app-menu` color variant
- [ ] Side-by-side Examples
- [ ] Standalone CSS Examples (may be covered by IdsInput and IdsButton, but we probably want to display this component by itself)
