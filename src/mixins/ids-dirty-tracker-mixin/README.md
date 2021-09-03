# Ids Dirty Tracker Mixin

This mixin tracks the input element text/value changes and show a dirty indicator icon (yellow triangle) to indicate the field has been modified from the starting value. It relies on there being an input element reference from which to check and it will work on `this.input` for the input.

To implement the dirty tracker mixin:

1. Import `IdsDirtyTrackerMixin`
1. Add `IdsDirtyTrackerMixin` to the mixes() section
1. Add `IdsDirtyTrackerMixin` to the @mixes comment section
1. Make sure you attributes extend `return [...attributes` in the `attributes` property because `attributes.DIRTY_TRACKER` is added.
1. Make sure the `connectedCallback` calls `super.connectedCallback();`
