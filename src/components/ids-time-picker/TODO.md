# Ids Time Picker TODO

Keep this file in sync with #636

## Major

- [x] Make the picker popup's dropdowns display values that reflect what's in the IdsTriggerField
- [x] Add validation passthrough to the inner IdsTriggerField
- [x] Add option to limit hours [similar to this Enterprise issue](https://github.com/infor-design/enterprise/issues/5880)
- [x] Review theme colors for accuracy (should be inherited from IdsTriggerField)
- [x] Add ARIA-attributes
- [x] Fix onOutsideClick() (ids-time-picker width too-wide, but inline-flex breaks alignment) - maybe get rid of the div
- [x] Add config for enabling/disabling leading-zeros on hours, minutes, and seconds (depends on localized date string `h` vs. `hh` or `m` vs. `mm`)
- [x] Replace the `range()` with the Date object or some other API, so we don't have to assume manually. See [Ed's comment](https://github.com/infor-design/enterprise-wc/pull/432#discussion_r756304951).
- [x] Separate out the "picker contents" to a separate, embeddable form element (could potentially be shared by this component and the Date Picker's "Date/Time" view)
- [x] Allow reset of the Time Picker's value ([#623](https://github.com/infor-design/enterprise-wc/issues/623))
- [x] `useCurrentTime` setting/attribute and functionality

## Minor

- [x] Add Side-by-side Examples
- [x] Add Standalone CSS Examples
- [x] Fix skipped and percy tests
- [x] Add custom id's/automation id's that can be used for scripting
- [x] Add "Themeable Parts" for `label`, `input`, and `popup`
- [x] Make private `this.is24Hours`, `this.is12Hours`, `this.hasSeconds` and `this.hasPeriod` (i.e. `this.#is24Hours`)
- [x] Align center hours/minutes/seconds dropdown label
- [x] Add `:` separator between hours/minutes/seconds dropdowns
