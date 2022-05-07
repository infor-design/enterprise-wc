# Ids Time Picker TODO

Keep this file in sync with #636

## Major

- [x] Make the picker popup's dropdowns display values that reflect what's in the IdsTriggerField
- [ ] Add validation passthrough to the inner IdsTriggerField
- [ ] Add option to limit hours [similar to this Enterprise issue](https://github.com/infor-design/enterprise/issues/5880)
- [ ] Review theme colors for accuracy (should be inherited from IdsTriggerField)
- [ ] Add ARIA-attributes
- [ ] Fix onOutsideClick() (ids-time-picker width too-wide, but inline-flex breaks alignment) - maybe get rid of the div
- [ ] Add config for enabling/disabling leading-zeros on hours, minutes, and seconds (depends on localized date string `h` vs. `hh` or `m` vs. `mm`)
- [ ] Replace the `range()` with the Date object or some other API, so we don't have to assume manually. See [Ed's comment](https://github.com/infor-design/enterprise-wc/pull/432#discussion_r756304951).
- [x] Separate out the "picker contents" to a separate, embeddable form element (could potentially be shared by this component and the Date Picker's "Date/Time" view)
- [x] Allow reset of the Time Picker's value ([#623](https://github.com/infor-design/enterprise-wc/issues/623))

## Minor

- [ ] Add Side-by-side Examples
- [ ] Add Standalone CSS Examples
- [ ] Fix skipped e2e and percy tests
- [ ] Add custom id's/automation id's that can be used for scripting
- [ ] Add "Themeable Parts" for `label`, `input`, and `popup`
- [ ] Make private `this.is24Hours`, `this.is12Hours`, `this.hasSeconds` and `this.hasPeriod` (i.e. `this.#is24Hours`)
- [ ] Make private `this.dropdowns` (i.e. `this.#dropdowns()`). See [Ed's comment](https://github.com/infor-design/enterprise-wc/pull/432#discussion_r756209961).
