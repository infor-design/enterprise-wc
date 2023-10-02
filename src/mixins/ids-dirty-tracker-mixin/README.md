# Ids Dirty Tracker Mixin

This mixin tracks the input element text/value changes and show a dirty indicator icon (yellow triangle) to indicate the field has been modified from the starting value. It relies on the existence of an input element reference `this.input`. Note that checkboxes and radios should not have dirty indicators.

To implement the dirty tracker mixin:

1. Import `IdsDirtyTrackerMixin` and add to the component-base.js
1. Add `IdsDirtyTrackerMixin` to the @mixes comment section
1. Make sure you attributes extend `return [...super.attributes` in the `attributes` property because `attributes.DIRTY_TRACKER` is added.
1. Make sure the `connectedCallback` calls `super.connectedCallback();`
